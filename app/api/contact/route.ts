import { NextResponse } from "next/server";
import { Resend } from "resend";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { contactSchema } from "@/lib/validation";

export async function POST(request: Request) {
	try {
		// Rate limit: 3 envíos por hora por IP (anti-spam)
		const ip = clientIp(request);
		const rl = rateLimit(`contact:${ip}`, 3, 60 * 60 * 1000);
		if (!rl.ok) {
			return NextResponse.json(
				{ error: "Demasiados mensajes. Intenta de nuevo más tarde." },
				{
					status: 429,
					headers: { "Retry-After": String(rl.retryAfterSeconds) },
				},
			);
		}

		let body: unknown;
		try {
			body = await request.json();
		} catch {
			return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
		}

		const parsed = contactSchema.safeParse(body);
		if (!parsed.success) {
			return NextResponse.json(
				{
					error: "Datos inválidos",
					issues: parsed.error.flatten().fieldErrors,
				},
				{ status: 400 },
			);
		}

		const { name, email, message } = parsed.data;

		// Honeypot: el bot "llenó" el campo oculto → responder éxito sin enviar
		if (parsed.data.website) {
			return NextResponse.json({ success: true });
		}

		if (!process.env.RESEND_API_KEY) {
			return NextResponse.json(
				{ error: "Servicio de correo no configurado" },
				{ status: 503 },
			);
		}

		const resend = new Resend(process.env.RESEND_API_KEY);

		const { error } = await resend.emails.send({
			from: "Portafolio Contacto <onboarding@resend.dev>",
			to: ["tatancarduar@gmail.com"],
			subject: `Nuevo mensaje de ${name} desde tu portafolio`,
			replyTo: email,
			text: `Nombre: ${name}\nEmail: ${email}\nIP: ${ip}\n\nMensaje:\n${message}`,
		});

		if (error) {
			console.error("[contact] resend error:", error.message);
			return NextResponse.json(
				{ error: "No se pudo enviar el mensaje. Intentá más tarde." },
				{ status: 400 },
			);
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("[contact] unexpected error:", error);
		return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
	}
}
