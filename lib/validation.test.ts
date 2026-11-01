import { describe, it, expect } from "vitest";
import {
	contactSchema,
	profileUpdateSchema,
	projectUpdateSchema,
	httpsUrlSchema,
} from "@/lib/validation";

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

describe("httpsUrlSchema", () => {
	it("acepta https://", () => {
		expect(httpsUrlSchema.safeParse("https://example.com").success).toBe(true);
	});

	it("acepta vacío, null y undefined", () => {
		expect(httpsUrlSchema.safeParse("").success).toBe(true);
		expect(httpsUrlSchema.safeParse(null).success).toBe(true);
		expect(httpsUrlSchema.safeParse(undefined).success).toBe(true);
	});

	it("rechaza http:// y javascript:", () => {
		expect(httpsUrlSchema.safeParse("http://example.com").success).toBe(false);
		expect(httpsUrlSchema.safeParse("javascript:alert(1)").success).toBe(false);
	});

	it("rechaza tipos no string", () => {
		expect(httpsUrlSchema.safeParse(123).success).toBe(false);
	});
});

describe("profileUpdateSchema", () => {
	it("acepta URLs https y nulos", () => {
		const result = profileUpdateSchema.safeParse({
			github_url: "https://github.com/tatan22",
			linkedin_url: null,
			resume_url: "",
		});
		expect(result.success).toBe(true);
	});

	it("rechaza URLs que no empiezan con https://", () => {
		for (const field of ["github_url", "linkedin_url", "resume_url"]) {
			const result = profileUpdateSchema.safeParse({
				github_url: null,
				linkedin_url: null,
				resume_url: null,
				[field]: "ftp://example.com",
			});
			expect(result.success).toBe(false);
		}
	});
});

describe("projectUpdateSchema", () => {
	const valid = {
		tech_stack: ["Next.js", "TypeScript"],
		live_url: "https://example.com",
		github_url: null,
	};

	it("acepta un proyecto válido", () => {
		expect(projectUpdateSchema.safeParse(valid).success).toBe(true);
	});

	it("rechaza live_url o github_url inválidas", () => {
		expect(
			projectUpdateSchema.safeParse({ ...valid, live_url: "example.com" })
				.success,
		).toBe(false);
		expect(
			projectUpdateSchema.safeParse({ ...valid, github_url: "http://x.com" })
				.success,
		).toBe(false);
	});

	it("rechaza tech_stack que no es array de strings", () => {
		for (const tech_stack of ["Next.js", 123, null, ["ok", 1]]) {
			expect(
				projectUpdateSchema.safeParse({ ...valid, tech_stack }).success,
			).toBe(false);
		}
	});
});
