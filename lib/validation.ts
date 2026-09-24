import { z } from "zod";

export const contactSchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, "El nombre debe tener al menos 2 caracteres")
		.max(100, "El nombre no puede exceder 100 caracteres"),
	email: z
		.string()
		.trim()
		.email("Email inválido")
		.max(254, "El email no puede exceder 254 caracteres"),
	message: z
		.string()
		.trim()
		.min(10, "El mensaje debe tener al menos 10 caracteres")
		.max(2000, "El mensaje no puede exceder 2000 caracteres"),
	// Honeypot: los humanos reales nunca llenan este campo
	website: z.string().max(0, "Campo inválido").optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;
