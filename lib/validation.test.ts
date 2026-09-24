import { describe, it, expect } from "vitest";
import { contactSchema } from "@/lib/validation";

describe("contactSchema", () => {
	const valid = {
		name: "Juan Pérez",
		email: "juan@example.com",
		message: "Hola, me interesa un proyecto de landing page.",
	};

	it("acepta un payload válido", () => {
		const result = contactSchema.safeParse(valid);
		expect(result.success).toBe(true);
	});

	it("acepta payload válido con honeypot vacío", () => {
		const result = contactSchema.safeParse({ ...valid, website: "" });
		expect(result.success).toBe(true);
	});

	it("rechaza honeypot llenado (bot)", () => {
		const result = contactSchema.safeParse({
			...valid,
			website: "http://spam.com",
		});
		expect(result.success).toBe(false);
	});

	it("rechaza email inválido", () => {
		const result = contactSchema.safeParse({ ...valid, email: "no-es-email" });
		expect(result.success).toBe(false);
	});

	it("rechaza nombre muy corto", () => {
		const result = contactSchema.safeParse({ ...valid, name: "A" });
		expect(result.success).toBe(false);
	});

	it("rechaza mensaje muy corto", () => {
		const result = contactSchema.safeParse({ ...valid, message: "hola" });
		expect(result.success).toBe(false);
	});

	it("rechaza campos faltantes", () => {
		expect(contactSchema.safeParse({}).success).toBe(false);
		expect(contactSchema.safeParse({ name: "Juan" }).success).toBe(false);
	});

	it("rechaza message mayor a 2000 caracteres", () => {
		const result = contactSchema.safeParse({
			...valid,
			message: "x".repeat(2001),
		});
		expect(result.success).toBe(false);
	});

	it("rechaza tipos no string", () => {
		const result = contactSchema.safeParse({
			...valid,
			name: 123,
			message: null,
		});
		expect(result.success).toBe(false);
	});

	it("hace trim en los strings", () => {
		const result = contactSchema.safeParse({
			name: "  Juan Pérez  ",
			email: "  juan@example.com  ",
			message: "  Hola, me interesa un proyecto grande.  ",
		});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.name).toBe("Juan Pérez");
			expect(result.data.email).toBe("juan@example.com");
		}
	});
});
