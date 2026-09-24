import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { initDb } from "@/lib/db";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

export async function GET() {
	// Protegido también en la ruta (defensa además del middleware)
	const session = cookies().get(ADMIN_SESSION_COOKIE);
	if (!(await verifySessionToken(session?.value))) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		await initDb();
		return NextResponse.json({ message: "Database initialized successfully!" });
	} catch (error) {
		return NextResponse.json(
			{
				error: "Failed to initialize database.",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
