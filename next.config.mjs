import sentryPkg from "@sentry/nextjs";

const { withSentryConfig } = sentryPkg;

/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		instrumentationHook: true,
	},
	poweredByHeader: false,
	images: {
		// Solo hosts que el admin puede configurar (UploadThing) + dominio propio.
		// Antes: hostname "**" (cualquier URL externa → abuso de la quota de Vercel).
		remotePatterns: [
			{ protocol: "https", hostname: "utfs.io" },
			{ protocol: "https", hostname: "cdn.utfs.io" },
			{ protocol: "https", hostname: "ufs.sh" },
			{ protocol: "https", hostname: "jhonatanc-dev.vercel.app" },
			{ protocol: "https", hostname: "lh3.googleusercontent.com" },
		],
		formats: ["image/avif", "image/webp"],
	},
	async headers() {
		return [
			{
				source: "/:path*",
				headers: [
					{ key: "X-Content-Type-Options", value: "nosniff" },
					{ key: "X-Frame-Options", value: "DENY" },
					{
						key: "Referrer-Policy",
						value: "strict-origin-when-cross-origin",
					},
					{
						key: "Permissions-Policy",
						value: "camera=(), microphone=(), geolocation=()",
					},
					{
						key: "Strict-Transport-Security",
						value: "max-age=63072000; includeSubDomains; preload",
					},
				],
			},
			{
				source: "/admin/:path*",
				headers: [
					{ key: "X-Robots-Tag", value: "noindex, nofollow" },
					{ key: "Cache-Control", value: "no-store" },
				],
			},
			{
				source: "/api/:path*",
				headers: [{ key: "Cache-Control", value: "no-store" }],
			},
		];
	},
};

// withSentryConfig sube source maps solo si SENTRY_AUTH_TOKEN está configurado;
// sin token, se omite silenciosamente.
const sentryWrapOptions = {
	org: process.env.SENTRY_ORG,
	project: process.env.SENTRY_PROJECT,
	silent: !process.env.CI,
	widenClientFileUpload: true,
};

export default process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN
	? withSentryConfig(nextConfig, sentryWrapOptions)
	: nextConfig;
