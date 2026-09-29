/**
 * Configuración central del sitio.
 *
 * Para usar un dominio propio, solo define NEXT_PUBLIC_SITE_URL en Vercel
 * (ej: "https://jhonatanc.dev") y todo (canonicals, OG, sitemap, JSON-LD,
 * llms.txt, RSS) apuntará a ese dominio automáticamente.
 */
const FALLBACK_URL = "https://jhonatanc-dev.vercel.app";

function normalizeUrl(url: string): string {
	return url.replace(/\/+$/, "");
}

export const SITE_URL = normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_URL);

export const SITE_NAME = "Jhonatan Cardona — Portafolio";
export const SITE_TITLE =
	"Jhonatan Cardona | Full-Stack TypeScript Engineer & Commerce Creator";
export const SITE_DESCRIPTION =
	"Especialista en crear tiendas online rápidas, escalables y optimizadas para SEO que ayudan a aumentar las ventas. Ingeniero Físico con experiencia en Next.js, NestJS y arquitecturas modernas.";
export const SITE_SHORT_DESCRIPTION =
	"Especialista en crear tiendas online rápidas, escalables y optimizadas para SEO que ayudan a aumentar las ventas.";
export const SITE_LOCALE = "es_CO";

export const AUTHOR_NAME = "Jhonatan Cardona Duarte";
export const AUTHOR_ROLE = "Full-Stack TypeScript Engineer";

export const CONTACT = {
	email: "tatancarduar@gmail.com",
	phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || undefined,
	city: "Pereira",
	region: "Risaralda",
	country: "CO",
	addressLocality: "Pereira",
	addressRegion: "Risaralda",
	addressCountry: "CO",
	geo: { latitude: 4.8133, longitude: -75.6961 },
} as const;

export const SITE_KEYWORDS = [
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
] as const;

export const SOCIAL = {
	github: "https://github.com/tatan22",
	linkedin: "https://linkedin.com/in/jhonatan-cardona-duarte-bb525199",
} as const;

export const SOCIAL_LIST = [
	{ label: "GitHub", url: SOCIAL.github, icon: "github" },
	{ label: "LinkedIn", url: SOCIAL.linkedin, icon: "linkedin" },
] as const;

export const KNOWS_ABOUT = [
	"React",
	"Next.js",
	"TypeScript",
	"NestJS",
	"E-commerce",
	"UI/UX",
	"SEO técnico",
] as const;

/** Construye una URL absoluta a partir de una ruta relativa. */
export function absoluteUrl(path: string): string {
	if (/^https?:\/\//.test(path)) return path;
	return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
