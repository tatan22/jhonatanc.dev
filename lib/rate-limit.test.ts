import { describe, it, expect } from "vitest";
import { rateLimit, clientIp } from "@/lib/rate-limit";

describe("rateLimit", () => {
	it("permite requests dentro del límite", () => {
		const result = rateLimit("test-ok", 3, 60_000);
		expect(result.ok).toBe(true);
		expect(result.remaining).toBe(2);
	});

	it("bloquea después de superar el límite", () => {
		const key = "test-block";
		rateLimit(key, 2, 60_000);
		rateLimit(key, 2, 60_000);
		const third = rateLimit(key, 2, 60_000);
		expect(third.ok).toBe(false);
		expect(third.retryAfterSeconds).toBeGreaterThan(0);
		expect(third.remaining).toBe(0);
	});

	it("usa claves independientes", () => {
		rateLimit("ip-a", 1, 60_000);
		const b = rateLimit("ip-b", 1, 60_000);
		expect(b.ok).toBe(true);
	});

	it("ventana expirada permite nuevos intentos", async () => {
		const key = "test-window";
		rateLimit(key, 1, 1); // ventana de 1ms
		expect(rateLimit(key, 1, 1).ok).toBe(false);
		await new Promise((r) => setTimeout(r, 10));
		expect(rateLimit(key, 1, 10_000).ok).toBe(true);
	});
});

describe("clientIp", () => {
	it("prioriza x-real-ip sobre x-forwarded-for", () => {
		const req = new Request("http://localhost", {
			headers: {
				"x-real-ip": "9.9.9.9",
				"x-forwarded-for": "1.2.3.4, 5.6.7.8",
			},
		});
		expect(clientIp(req)).toBe("9.9.9.9");
	});

	it("usa el último valor de x-forwarded-for (el que agrega el proxy)", () => {
		const req = new Request("http://localhost", {
			headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" },
		});
		expect(clientIp(req)).toBe("5.6.7.8");
	});

	it("ignora un x-forwarded-for forjado al inicio", () => {
		const req = new Request("http://localhost", {
			headers: { "x-forwarded-for": "6.6.6.6, 9.9.9.9" },
		});
		const legit = new Request("http://localhost", {
			headers: { "x-forwarded-for": "1.1.1.1, 9.9.9.9" },
		});
		expect(clientIp(req)).toBe("9.9.9.9");
		expect(clientIp(req)).toBe(clientIp(legit));
	});

	it("devuelve unknown sin headers", () => {
		expect(clientIp(new Request("http://localhost"))).toBe("unknown");
	});

	it("devuelve unknown si los headers están vacíos", () => {
		const req = new Request("http://localhost", {
			headers: { "x-real-ip": "  ", "x-forwarded-for": " , " },
		});
		expect(clientIp(req)).toBe("unknown");
	});
});
