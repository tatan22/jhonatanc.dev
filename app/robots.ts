import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const PRIVATE_PATHS = ["/admin/", "/api/", "/private/"];

/**
 * Bots de motores generativos (GEO/AEO): los permitimos explícitamente para que
 * ChatGPT, Claude, Perplexity, Gemini y Copilot puedan citar el contenido.
 */
const AI_CRAWLERS = [
	"GPTBot",
	"ChatGPT-User",
	"OAI-SearchBot",
	"ClaudeBot",
	"Claude-Web",
	"anthropic-ai",
	"PerplexityBot",
	"Perplexity-User",
	"Google-Extended",
	"Applebot-Extended",
	"CCBot",
	"cohere-ai",
];

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: PRIVATE_PATHS,
			},
			{
				userAgent: "Googlebot",
				allow: "/",
				disallow: PRIVATE_PATHS,
			},
			...AI_CRAWLERS.map((userAgent) => ({
				userAgent,
				allow: "/",
				disallow: PRIVATE_PATHS,
			})),
		],
		sitemap: `${SITE_URL}/sitemap.xml`,
		host: SITE_URL,
	};
}
