import type React from "react";
import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";

import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";

export const metadata: Metadata = {
	title: "Jhonatan Cardona | Frontend Developer & E-commerce Creator",
	description:
		"Ingeniero físico y desarrollador Frontend especializado en React, Next.js, TypeScript y creación de tiendas en línea (E-commerce) en Pereira, Colombia.",
	keywords: [
		"Frontend Developer",
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
		title: "Jhonatan Cardona | Frontend Developer & E-commerce Creator",
		description: "Especialista en React, Next.js y creación de tiendas en línea modernas.",
		siteName: "Portafolio de Jhonatan Cardona",
		images: [
			{
				url: "https://jhonatanc-dev.vercel.app/profile.webp",
				width: 1200,
				height: 630,
				alt: "Jhonatan Cardona - Frontend Developer",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Jhonatan Cardona | Frontend Developer",
		description: "Desarrollador Web especializado en React y E-commerce.",
		images: ["https://jhonatanc-dev.vercel.app/profile.webp"],
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