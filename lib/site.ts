/**
 * Configuración central del sitio.
 *
 * Para usar un dominio propio, solo define NEXT_PUBLIC_SITE_URL en Vercel
 * (ej: "https://jhonatanc.dev") y todo (canonicals, OG, sitemap, JSON-LD)
 * apuntará a ese dominio automáticamente.
 */
const FALLBACK_URL = "https://jhonatanc-dev.vercel.app";

function normalizeUrl(url: string): string {
	return url.replace(/\/+$/, "");
}

export const SITE_URL = normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_URL);

export const SITE_NAME = "Jhonatan Cardona — Portafolio";
export const SITE_DESCRIPTION =
	"Especialista en crear tiendas online rápidas, escalables y optimizadas para SEO que ayudan a aumentar las ventas. Ingeniero Físico con experiencia en Next.js, NestJS y arquitecturas modernas.";

export const AUTHOR_NAME = "Jhonatan Cardona Duarte";

export const SOCIAL = {
	github: "https://github.com/tatan22",
	linkedin: "https://linkedin.com/in/jhonatan-cardona-duarte-bb525199",
} as const;

/** Construye una URL absoluta a partir de una ruta relativa. */
export function absoluteUrl(path: string): string {
	if (/^https?:\/\//.test(path)) return path;
	return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
