/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://vercel.live;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: blob: https: https://utfs.io https://cdn.utfs.io https://ufs.sh https://lh3.googleusercontent.com;
  font-src 'self' data: https://fonts.gstatic.com;
  connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://vercel.live wss://vercel.live https://utfs.io https://cdn.utfs.io https://ufs.sh https://*.ufs.sh https://uploadthing.com https://*.uploadthing.com https://api.uploadthing.com;
  frame-src https://vercel.live;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`
	.replace(/\s{2,}/g, " ")
	.trim();

const nextConfig = {
	compress: true,
	poweredByHeader: false,
	reactStrictMode: true,
	experimental: {
		optimizePackageImports: [
			"lucide-react",
			"@radix-ui/react-icons",
			"framer-motion",
		],
	},
	images: {
		formats: ["image/avif", "image/webp"],
		remotePatterns: [
			{ protocol: "https", hostname: "utfs.io" },
			{ protocol: "https", hostname: "cdn.utfs.io" },
			{ protocol: "https", hostname: "ufs.sh" },
			{ protocol: "https", hostname: "lh3.googleusercontent.com" },
			{ protocol: "https", hostname: "images.unsplash.com" },
			{ protocol: "https", hostname: "picsum.photos" },
			{ protocol: "https", hostname: "www.carvinofertas.com" },
			{ protocol: "https", hostname: "carvinofertas.com" },
		],
	},
	async headers() {
		return [
			{
				source: "/:path*",
				headers: [
					{ key: "Content-Security-Policy", value: cspHeader },
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
					{ key: "X-DNS-Prefetch-Control", value: "on" },
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

export default nextConfig;
