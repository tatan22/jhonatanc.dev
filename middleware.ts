import { NextResponse, type NextRequest } from "next/server";
import { rateLimit, clientIp } from "@/lib/rate-limit";

const RATE_LIMITED_AUTH_PATHS = [
	"/api/auth/sign-in",
	"/api/auth/sign-up",
	"/api/auth/forget-password",
	"/api/auth/reset-password",
	"/api/admin/login",
	"/api/setup",
];

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|imgs|images|profile.webp).*)",
	],
};

export async function middleware(request: NextRequest) {
	const url = request.nextUrl;

	// Rate limiting en acciones sensibles de auth
	if (RATE_LIMITED_AUTH_PATHS.some((path) => url.pathname.startsWith(path))) {
		const ip = clientIp(request);
		const rateResult = rateLimit(`auth:${ip}`, 5, 15 * 60 * 1000); // 5 req / 15 min
		if (!rateResult.ok) {
			return new NextResponse("Too Many Requests", {
				status: 429,
				headers: { "Retry-After": String(rateResult.retryAfterSeconds) },
			});
		}
	}

	// Headers de seguridad adicionales en respuesta
	const response = NextResponse.next();
	response.headers.set("X-Content-Type-Options", "nosniff");
	response.headers.set("X-Frame-Options", "DENY");
	response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
	response.headers.set(
		"Permissions-Policy",
		"camera=(), microphone=(), geolocation=()",
	);

	return response;
}
