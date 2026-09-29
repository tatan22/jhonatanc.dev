import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_SHORT_DESCRIPTION } from "@/lib/site";

/**
 * Web App Manifest — mejora la presencia en móvil, habilita "agregar a inicio"
 * y envía señales de calidad a Google (PWA / Core Web Vitals).
 */
export default function manifest(): MetadataRoute.Manifest {
	return {
		name: SITE_NAME,
		short_name: "JhonatanCardona",
		description: SITE_SHORT_DESCRIPTION,
		start_url: "/",
		display: "standalone",
		background_color: "#0a0a0f",
		theme_color: "#0a0a0f",
		icons: [
			{
				src: "/favicon.ico",
				sizes: "any",
				type: "image/x-icon",
			},
		],
	};
}
