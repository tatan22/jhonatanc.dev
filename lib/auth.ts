const encoder = new TextEncoder();

export const ADMIN_SESSION_COOKIE = "admin_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24; // 1 día

function getSecret(): string | null {
	// Preferencia: secreto dedicado. Fallback: password del admin.
	return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || null;
}

function timingSafeEqual(a: string, b: string): boolean {
	if (a.length !== b.length) return false;
	let result = 0;
	for (let i = 0; i < a.length; i++) {
		result |= a.charCodeAt(i) ^ b.charCodeAt(i);
	}
	return result === 0;
}

async function hmacSha256Base64Url(secret: string, data: string): Promise<string> {
	const key = await crypto.subtle.importKey(
		"raw",
		encoder.encode(secret),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign"],
	);
	const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
	const bytes = new Uint8Array(signature);
	let binary = "";
	for (const byte of bytes) binary += String.fromCharCode(byte);
	return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function randomNonce(): string {
	const bytes = new Uint8Array(16);
	crypto.getRandomValues(bytes);
	let binary = "";
	for (const byte of bytes) binary += String.fromCharCode(byte);
	return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Crea un token de sesión firmado con HMAC-SHA256.
 * Formato: `<exp>.<nonce>.<firma>` — imposible de forjar sin el secreto.
 * Compatible con Edge (middleware) y Node (route handlers).
 */
export async function createSessionToken(
	ttlSeconds: number = SESSION_TTL_SECONDS,
): Promise<string | null> {
	const secret = getSecret();
	if (!secret) return null;

	const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
	const nonce = randomNonce();
	const payload = `${exp}.${nonce}`;
	const signature = await hmacSha256Base64Url(secret, payload);
	return `${payload}.${signature}`;
}

/** Verifica firma y expiración de un token de sesión. */
export async function verifySessionToken(
	token: string | undefined | null,
): Promise<boolean> {
	const secret = getSecret();
	if (!secret || !token) return false;

	const parts = token.split(".");
	if (parts.length !== 3) return false;

	const [expRaw, nonce, signature] = parts;
	const exp = Number(expRaw);
	if (!Number.isFinite(exp) || !nonce || !signature) return false;
	if (exp * 1000 < Date.now()) return false;

	const expected = await hmacSha256Base64Url(secret, `${expRaw}.${nonce}`);
	return timingSafeEqual(signature, expected);
}

/** Comparación en tiempo constante de contraseñas (sin side-channels de timing). */
export async function verifyPassword(
	provided: string,
	expected: string,
): Promise<boolean> {
	const [a, b] = await Promise.all([
		crypto.subtle.digest("SHA-256", encoder.encode(provided)),
		crypto.subtle.digest("SHA-256", encoder.encode(expected)),
	]);
	const aHex = Array.from(new Uint8Array(a))
		.map((b2) => b2.toString(16).padStart(2, "0"))
		.join("");
	const bHex = Array.from(new Uint8Array(b))
		.map((b2) => b2.toString(16).padStart(2, "0"))
		.join("");
	return timingSafeEqual(aHex, bHex);
}
