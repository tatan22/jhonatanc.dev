import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Rutas públicas de admin (login/logout no requieren sesión)
	if (pathname === "/api/admin/login" || pathname === "/api/admin/logout") {
		return NextResponse.next();
	}

	const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
	const isAuthed = await verifySessionToken(token);

	if (isAuthed) {
		// Ya autenticado: no dejar que vea de nuevo el login
		if (pathname === "/admin") {
			return NextResponse.redirect(new URL("/admin/dashboard", request.url));
		}
		return NextResponse.next();
	}

	// Sin sesión: bloquear dashboard y toda la API admin (incluye /api/setup)
	if (pathname.startsWith("/admin")) {
		const loginUrl = new URL("/admin", request.url);
		loginUrl.searchParams.set("next", pathname);
		return NextResponse.redirect(loginUrl);
	}

	return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export const config = {
	matcher: ["/admin/:path*", "/admin", "/api/admin/:path*", "/api/setup"],
};
