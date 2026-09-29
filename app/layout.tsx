import type React from "react";
import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Suspense } from "react";

import { ThemeProvider } from "@/components/theme-provider";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";

import "./globals.css";
import { getProfile } from "@/lib/db";
import {
	SITE_URL,
	SITE_NAME,
	SITE_TITLE,
	SITE_DESCRIPTION,
	SITE_SHORT_DESCRIPTION,
	SITE_LOCALE,
	AUTHOR_NAME,
	AUTHOR_ROLE,
	CONTACT,
	SITE_KEYWORDS,
	KNOWS_ABOUT,
	SOCIAL_LIST,
} from "@/lib/site";
import { FloatingCTA } from "@/components/floating-cta";
import { ExitIntentPopup } from "@/components/exit-intent-popup";
import { AnalyticsDelegate } from "@/components/analytics";
import { ConsentAwareScripts } from "@/components/cpv/ConsentAwareScripts";
import { CpvCookieConsent } from "@/components/cpv/CpvCookieConsent";

export async function generateMetadata(): Promise<Metadata> {
	const profile = await getProfile().catch(() => null);
	const imageUrl = profile?.image_url || "/profile.webp";
	const absoluteImageUrl = imageUrl.startsWith("http")
		? imageUrl
		: `${SITE_URL}${imageUrl}`;

	return {
		metadataBase: new URL(SITE_URL),
		title: {
			default: SITE_TITLE,
			template: "%s | Jhonatan Cardona",
		},
		description: SITE_DESCRIPTION,
		keywords: [...SITE_KEYWORDS],
		authors: [{ name: AUTHOR_NAME, url: SITE_URL }],
		creator: AUTHOR_NAME,
		publisher: AUTHOR_NAME,
		category: "technology",
		alternates: {
			canonical: "/",
			languages: {
				"es-CO": "/",
				es: "/",
			},
			types: {
				"application/rss+xml": "/blog/rss.xml",
			},
		},
		openGraph: {
			type: "website",
			locale: SITE_LOCALE,
			url: `${SITE_URL}/`,
			title: SITE_TITLE,
			description: SITE_SHORT_DESCRIPTION,
			siteName: SITE_NAME,
			images: [
				{
					url: absoluteImageUrl,
					width: 1200,
					height: 630,
					alt: "Jhonatan Cardona — Full-Stack TypeScript Engineer",
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: "Jhonatan Cardona | Full-Stack TypeScript Engineer",
			description: SITE_SHORT_DESCRIPTION,
			images: [absoluteImageUrl],
		},
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				"max-video-preview": -1,
				"max-image-preview": "large",
				"max-snippet": -1,
			},
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

				{/* Analytics solo con consentimiento */}
				<ConsentAwareScripts>
					<GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
					<Analytics />
				</ConsentAwareScripts>

				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org",
							"@graph": [
								{
									"@type": "Person",
									"@id": `${SITE_URL}/#person`,
									name: AUTHOR_NAME,
									jobTitle: AUTHOR_ROLE,
									description:
										"Ingeniero Físico y desarrollador especializado en React, Next.js y TypeScript.",
									url: SITE_URL,
									image: `${SITE_URL}/profile.webp`,
									email: `mailto:${CONTACT.email}`,
									address: {
										"@type": "PostalAddress",
										addressLocality: CONTACT.addressLocality,
										addressRegion: CONTACT.addressRegion,
										addressCountry: CONTACT.addressCountry,
									},
									knowsAbout: [...KNOWS_ABOUT],
									sameAs: SOCIAL_LIST.map((s) => s.url),
								},
								{
									"@type": "WebSite",
									"@id": `${SITE_URL}/#website`,
									url: `${SITE_URL}/`,
									name: SITE_NAME,
									description: SITE_DESCRIPTION,
									inLanguage: "es-CO",
									publisher: { "@id": `${SITE_URL}/#person` },
								},
								{
									"@type": ["ProfessionalService", "LocalBusiness"],
									"@id": `${SITE_URL}/#business`,
									name: "JhonatanCardona.Dev",
									image: `${SITE_URL}/profile.webp`,
									description: SITE_DESCRIPTION,
									url: SITE_URL,
									email: `mailto:${CONTACT.email}`,
									priceRange: "$$",
									currenciesAccepted: "COP",
									areaServed: {
										"@type": "Country",
										name: "Colombia",
									},
									address: {
										"@type": "PostalAddress",
										addressLocality: CONTACT.addressLocality,
										addressRegion: CONTACT.addressRegion,
										addressCountry: CONTACT.addressCountry,
									},
									geo: {
										"@type": "GeoCoordinates",
										latitude: CONTACT.geo.latitude,
										longitude: CONTACT.geo.longitude,
									},
									founder: { "@id": `${SITE_URL}/#person` },
									sameAs: SOCIAL_LIST.map((s) => s.url),
									hasOfferCatalog: {
										"@type": "OfferCatalog",
										name: "Servicios de desarrollo web y e-commerce",
										itemListElement: [
											{
												"@type": "Offer",
												itemOffered: {
													"@type": "Service",
													name: "Desarrollo de tiendas online (e-commerce)",
													url: `${SITE_URL}/#services`,
												},
											},
											{
												"@type": "Offer",
												itemOffered: {
													"@type": "Service",
													name: "Desarrollo web a medida con Next.js",
													url: `${SITE_URL}/#services`,
												},
											},
											{
												"@type": "Offer",
												itemOffered: {
													"@type": "Service",
													name: "SEO técnico y optimización de rendimiento",
													url: `${SITE_URL}/#services`,
												},
											},
										],
									},
								},
							],
						}),
					}}
				/>
				<FloatingCTA />
				<ExitIntentPopup />
				<AnalyticsDelegate />
				<CpvCookieConsent />
			</body>
		</html>
	);
}
