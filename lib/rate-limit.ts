type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Purga periódica para no acumular memoria en procesos largos.
let lastSweep = Date.now();
function sweep(now: number) {
	if (now - lastSweep < 60_000) return;
	lastSweep = now;
	for (const [key, bucket] of buckets) {
		if (bucket.resetAt <= now) buckets.delete(key);
	}
}

export type RateLimitResult = {
	ok: boolean;
	retryAfterSeconds: number;
	remaining: number;
};

/**
 * Rate limiter en memoria (ventana fija).
 * Suficiente para un portafolio single-instance; documentado en auditoría:
 * si escala a múltiples instancias, migrar a Upstash/Vercel KV.
 */
export function rateLimit(
	key: string,
	limit: number,
	windowMs: number,
): RateLimitResult {
	const now = Date.now();
	sweep(now);

	let bucket = buckets.get(key);
	if (!bucket || bucket.resetAt <= now) {
		bucket = { count: 0, resetAt: now + windowMs };
		buckets.set(key, bucket);
	}

	if (bucket.count >= limit) {
		return {
			ok: false,
			retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
			remaining: 0,
		};
	}

	bucket.count += 1;
	return {
		ok: true,
		retryAfterSeconds: 0,
		remaining: limit - bucket.count,
	};
}

/** Extrae la IP real del cliente detrás de proxies (Vercel/Cloudflare). */
export function clientIp(request: Request): string {
	const realIp = request.headers.get("x-real-ip");
	if (realIp?.trim()) return realIp.trim();

	// Solo el último valor lo agrega el proxy: los anteriores los controla el cliente.
	const forwarded = request.headers.get("x-forwarded-for");
	if (forwarded) {
		const parts = forwarded.split(",");
		const last = parts[parts.length - 1].trim();
		if (last) return last;
	}

	return "unknown";
}
