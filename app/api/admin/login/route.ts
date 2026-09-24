import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import {
	ADMIN_SESSION_COOKIE,
	SESSION_TTL_SECONDS,
	createSessionToken,
	verifyPassword,
} from "@/lib/auth";

export async function POST(request: Request) {
	try {
		// Rate limit: 5 intentos cada 15 min por IP
		const ip = clientIp(request);
		const rl = rateLimit(`login:${ip}`, 5, 15 * 60 * 1000);
		if (!rl.ok) {
			return NextResponse.json(
				{ error: "Demasiados intentos. Intenta de nuevo más tarde." },
				{
					status: 429,
					headers: { "Retry-After": String(rl.retryAfterSeconds) },
				},
			);
		}

		const { password } = await request.json();
		const adminPassword = process.env.ADMIN_PASSWORD;

		if (!adminPassword) {
			return NextResponse.json(
				{ error: "Admin password not configured on server" },
				{ status: 500 },
			);
		}

		if (typeof password !== "string" || password.length === 0) {
			return NextResponse.json({ error: "Invalid password" }, { status: 401 });
		}

		const valid = await verifyPassword(password, adminPassword);
		if (!valid) {
			return NextResponse.json({ error: "Invalid password" }, { status: 401 });
		}

		const token = await createSessionToken(SESSION_TTL_SECONDS);
		if (!token) {
			return NextResponse.json(
				{ error: "Session secret not configured" },
				{ status: 500 },
			);
		}

		cookies().set(ADMIN_SESSION_COOKIE, token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			path: "/",
			maxAge: SESSION_TTL_SECONDS,
		});

		return NextResponse.json({ success: true });
	} catch {
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}
