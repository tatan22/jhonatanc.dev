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
	it("lee x-forwarded-for (primera IP)", () => {
		const req = new Request("http://localhost", {
			headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" },
		});
		expect(clientIp(req)).toBe("1.2.3.4");
	});

	it("cae a x-real-ip si no hay forwarded", () => {
		const req = new Request("http://localhost", {
			headers: { "x-real-ip": "9.9.9.9" },
		});
		expect(clientIp(req)).toBe("9.9.9.9");
	});

	it("devuelve unknown sin headers", () => {
		expect(clientIp(new Request("http://localhost"))).toBe("unknown");
	});
});
