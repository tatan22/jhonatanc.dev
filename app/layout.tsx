import type React from "react";
import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";

import { ThemeProvider } from "@/components/theme-provider";
import { GoogleAnalytics } from "@next/third-parties/google";

import "./globals.css";
import { getProfile } from "@/lib/db";

export async function generateMetadata(): Promise<Metadata> {
	const profile = await getProfile();
	const imageUrl = profile?.image_url || "https://jhonatanc-dev.vercel.app/profile.webp";
	const absoluteImageUrl = imageUrl.startsWith('http') ? imageUrl : `https://jhonatanc-dev.vercel.app${imageUrl}`;

	return {
		title: "Jhonatan Cardona | Full-Stack TypeScript Engineer & Commerce Creator",
		description:
			"Especialista en crear tiendas online rápidas, escalables y optimizadas para SEO que ayudan a aumentar las ventas. Ingeniero Físico con experiencia en Next.js, NestJS y arquitecturas modernas para construir soluciones de alto rendimiento.",
		keywords: [
			"Full Stack Developer",
			"Frontend Developer",
			"E-commerce",
			"Tiendas en línea",
			"React",
			"Next.js",
			"NestJS",
			"TypeScript",
			"React Native",
			"Desarrollo Web Pereira",
			"Ingeniero Físico",
		],
		authors: [{ name: "Jhonatan Cardona" }],
		creator: "Jhonatan Cardona",
		openGraph: {
			type: "website",
			locale: "es_CO",
			url: "https://jhonatanc-dev.vercel.app/",
			title: "Jhonatan Cardona | Full-Stack TypeScript Engineer & Commerce Creator",
			description: "Especialista en crear tiendas online rápidas, escalables y optimizadas para SEO que ayudan a aumentar las ventas.",
			siteName: "Portafolio de Jhonatan Cardona",
			images: [
				{
					url: absoluteImageUrl,
					width: 800,
					height: 800,
					alt: "Jhonatan Cardona Profile",
				},
			],
		},
		twitter: {
			card: "summary",
			title: "Jhonatan Cardona | Full-Stack TypeScript Engineer",
			description: "Especialista en crear tiendas online rápidas y optimizadas para SEO que aumentan tus ventas.",
			images: [absoluteImageUrl],
		},
	};
}

export const viewport: Viewport = {
	themeColor: "#0a0a0f",
	width: "device-width",
	initialScale: 1,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="es"
			suppressHydrationWarning
			className={`${GeistSans.variable} ${GeistMono.variable}`}
		>
			<body className="font-sans antialiased bg-background">
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<Suspense fallback={null}>{children}</Suspense>
				</ThemeProvider>

				<Analytics />
				<GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
			</body>
		</html>
	);
}