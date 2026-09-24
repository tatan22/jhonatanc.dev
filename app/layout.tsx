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
import { FloatingCTA } from "@/components/floating-cta";
import { ExitIntentPopup } from "@/components/exit-intent-popup";
import { AnalyticsDelegate } from "@/components/analytics";

const SITE_URL = "https://jhonatanc-dev.vercel.app";

export async function generateMetadata(): Promise<Metadata> {
	const profile = await getProfile().catch(() => null);
	const imageUrl = profile?.image_url || "/profile.webp";
	const absoluteImageUrl = imageUrl.startsWith("http")
		? imageUrl
		: `${SITE_URL}${imageUrl}`;

	return {
		metadataBase: new URL(SITE_URL),
		title: {
			default:
				"Jhonatan Cardona | Full-Stack TypeScript Engineer & Commerce Creator",
			template: "%s | Jhonatan Cardona",
		},
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
		alternates: {
			canonical: "/",
		},
		openGraph: {
			type: "website",
			locale: "es_CO",
			url: `${SITE_URL}/`,
			title: "Jhonatan Cardona | Full-Stack TypeScript Engineer & Commerce Creator",
			description:
				"Especialista en crear tiendas online rápidas, escalables y optimizadas para SEO que ayudan a aumentar las ventas.",
			siteName: "Portafolio de Jhonatan Cardona",
			images: [
				{
					url: absoluteImageUrl,
					width: 1200,
					height: 630,
					alt: "Jhonatan Cardona Profile",
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: "Jhonatan Cardona | Full-Stack TypeScript Engineer",
			description:
				"Especialista en crear tiendas online rápidas y optimizadas para SEO que aumentan tus ventas.",
			images: [absoluteImageUrl],
		},
		robots: {
			index: true,
			follow: true,
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
			<body className="font-sans bg-background">
				<a href="#main-content" className="skip-link">
					Saltar al contenido principal
				</a>
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
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org",
							"@graph": [
								{
									"@type": "Person",
									"@id": `${SITE_URL}/#person`,
									name: "Jhonatan Cardona Duarte",
									jobTitle: "Full-Stack TypeScript Engineer",
									description:
										"Ingeniero Físico y desarrollador especializado en React, Next.js y TypeScript.",
									url: SITE_URL,
									image: `${SITE_URL}/profile.webp`,
									email: "mailto:tatancarduar@gmail.com",
									address: {
										"@type": "PostalAddress",
										addressLocality: "Pereira",
										addressCountry: "CO",
									},
									sameAs: [
										"https://github.com/tatan22",
										"https://linkedin.com/in/jhonatan-cardona-duarte-bb525199",
									],
									knowsAbout: [
										"React",
										"Next.js",
										"TypeScript",
										"NestJS",
										"E-commerce",
										"UI/UX",
									],
								},
								{
									"@type": "WebSite",
									"@id": `${SITE_URL}/#website`,
									url: `${SITE_URL}/`,
									name: "Jhonatan Cardona — Portafolio",
									inLanguage: "es-CO",
									publisher: { "@id": `${SITE_URL}/#person` },
								},
								{
									"@type": "ProfessionalService",
									"@id": `${SITE_URL}/#business`,
									name: "JhonatanCardona.Dev",
									image: `${SITE_URL}/profile.webp`,
									description:
										"Especialista en crear tiendas online rápidas y optimizadas para SEO que aumentan tus ventas.",
									url: SITE_URL,
									priceRange: "$$",
									areaServed: "CO",
									founder: { "@id": `${SITE_URL}/#person` },
								},
							],
						}),
					}}
				/>
				<FloatingCTA />
				<ExitIntentPopup />
				<AnalyticsDelegate />
			</body>
		</html>
	);
}
