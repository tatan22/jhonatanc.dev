import type React from "react";
import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";

import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";

export const metadata: Metadata = {
	title: "Jhonatan Cardona | Full-Stack TypeScript Engineer & Commerce Creator",
	description:
		"Especialista en crear tiendas online rápidas, escalables y optimizadas para SEO que ayudan a aumentar las ventas. Ingeniero Físico con experiencia en Next.js, NestJS y arquitecturas modernas para construir soluciones de alto rendimiento.",
	keywords: [
		"Full Stack Developer",
		"Frontend Developer",
		"Backend Developer",
		"React Developer",
		"Next.js",
		"TypeScript",
		"Tiendas en línea",
		"E-commerce Colombia",
		"Desarrollador Web Pereira",
		"Jhonatan Cardona Duarte",
	],
	authors: [{ name: "Jhonatan Cardona Duarte" }],
	creator: "Jhonatan Cardona Duarte",
	openGraph: {
		type: "website",
		locale: "es_CO",
		url: "https://jhonatanc-dev.vercel.app/",
		title: "Jhonatan Cardona | Full-Stack TypeScript Engineer & Commerce Creator",
		description: "Especialista en crear tiendas online rápidas, escalables y optimizadas para SEO que ayudan a aumentar las ventas.",
		siteName: "Portafolio de Jhonatan Cardona",
	},
	twitter: {
		card: "summary_large_image",
		title: "Jhonatan Cardona | Full-Stack TypeScript Engineer",
		description: "Especialista en crear tiendas online rápidas y optimizadas para SEO que aumentan tus ventas.",
	},
};

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
			</body>
		</html>
	);
}