import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
	createSessionToken,
	verifySessionToken,
	verifyPassword,
	ADMIN_SESSION_COOKIE,
	SESSION_TTL_SECONDS,
} from "@/lib/auth";

describe("session tokens", () => {
	beforeEach(() => {
		vi.stubEnv("ADMIN_SESSION_SECRET", "test-secret-123");
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it("crea un token y lo verifica correctamente", async () => {
		const token = await createSessionToken();
		expect(token).toBeTruthy();
		expect(await verifySessionToken(token)).toBe(true);
	});

	it("rechaza un token inexistente o vacío", async () => {
		expect(await verifySessionToken(null)).toBe(false);
		expect(await verifySessionToken(undefined)).toBe(false);
		expect(await verifySessionToken("")).toBe(false);
	});

	it("rechaza un token manipulado (firma inválida)", async () => {
		const token = await createSessionToken();
		const [exp, nonce] = token!.split(".");
		const forged = `${exp}.${nonce}.AAAAforgedAAAA`;
		expect(await verifySessionToken(forged)).toBe(false);
	});

	it("rechaza un token con payload alterado", async () => {
		const token = await createSessionToken();
		const [, nonce, sig] = token!.split(".");
		// Cambiamos la expiración manteniendo la firma vieja
		const forgedExp = String(Math.floor(Date.now() / 1000) + 999999);
		expect(await verifySessionToken(`${forgedExp}.${nonce}.${sig}`)).toBe(false);
	});

	it("rechaza un token expirado", async () => {
		const token = await createSessionToken(-10); // expiró hace 10s
		expect(await verifySessionToken(token)).toBe(false);
	});

	it("rechaza tokens con formato inválido", async () => {
		expect(await verifySessionToken("solo-una-parte")).toBe(false);
		expect(await verifySessionToken("a.b")).toBe(false);
		expect(await verifySessionToken("a.b.c.d")).toBe(false);
		expect(await verifySessionToken("no-numerico.x.y")).toBe(false);
	});

	it("rechaza si no hay secreto configurado", async () => {
		vi.unstubAllEnvs();
		vi.stubEnv("ADMIN_SESSION_SECRET", "");
		vi.stubEnv("ADMIN_PASSWORD", "");
		expect(await createSessionToken()).toBeNull();
		expect(await verifySessionToken("token")).toBe(false);
	});

	it("expira después del TTL por defecto", async () => {
		const token = await createSessionToken(SESSION_TTL_SECONDS);
		const exp = Number(token!.split(".")[0]);
		const now = Math.floor(Date.now() / 1000);
		expect(exp).toBeGreaterThanOrEqual(now + SESSION_TTL_SECONDS - 5);
	});

	it("exporta el nombre de cookie constante", () => {
		expect(ADMIN_SESSION_COOKIE).toBe("admin_session");
	});
});

describe("verifyPassword", () => {
	it("acepta la contraseña correcta", async () => {
		expect(await verifyPassword("secreta123", "secreta123")).toBe(true);
	});

	it("rechaza la contraseña incorrecta", async () => {
		expect(await verifyPassword("incorrecta", "secreta123")).toBe(false);
	});

	it("rechaza contraseñas vacías", async () => {
		expect(await verifyPassword("", "secreta123")).toBe(false);
		expect(await verifyPassword("secreta123", "")).toBe(false);
	});
});
