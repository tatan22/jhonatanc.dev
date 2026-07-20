import type React from "react";
import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";

import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";
import "@uploadthing/react/styles.css";

export const metadata: Metadata = {
	title: "Jhonatan Cardona | Frontend Developer",
	description:
		"Ingeniero físico y desarrollador Frontend especializado en React, Next.js y TypeScript.",
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