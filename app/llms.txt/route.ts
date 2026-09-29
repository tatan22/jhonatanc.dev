import { getPosts, getProjects, projectSlug } from "@/lib/db";
import {
	SITE_URL,
	SITE_DESCRIPTION,
	AUTHOR_NAME,
	AUTHOR_ROLE,
	CONTACT,
	SOCIAL_LIST,
} from "@/lib/site";

export const revalidate = 3600;

/**
 * llms.txt — resumen curado del sitio para que los motores generativos
 * (ChatGPT, Claude, Perplexity, Gemini) entiendan quién es Jhonatan Cardona,
 * qué ofrece y qué páginas pueden citar. Estándar: https://llmstxt.org
 */
export async function GET() {
	const [posts, projects] = await Promise.all([
		getPosts().catch(() => []),
		getProjects().catch(() => []),
	]);

	const lines: string[] = [];

	lines.push(`# ${AUTHOR_NAME}`);
	lines.push("");
	lines.push(`> ${SITE_DESCRIPTION}`);
	lines.push("");
	lines.push(
		`${AUTHOR_NAME} es ${AUTHOR_ROLE.toLowerCase()}, Ingeniero Físico radicado en ${CONTACT.city}, ${CONTACT.region} (Colombia). Diseña y desarrolla tiendas online y aplicaciones web de alto rendimiento con Next.js, React, TypeScript y NestJS, con SEO técnico incluido.`,
	);
	lines.push("");

	lines.push("## Servicios");
	lines.push("- Desarrollo de tiendas online (e-commerce) rápidas y escalables.");
	lines.push("- Desarrollo web a medida con Next.js, React, TypeScript y NestJS.");
	lines.push("- SEO técnico, Core Web Vitals y optimización de conversión.");
	lines.push("- Aplicaciones móviles con React Native.");
	lines.push("");

	lines.push("## Datos de contacto");
	lines.push(`- Email: ${CONTACT.email}`);
	lines.push(`- Ubicación: ${CONTACT.city}, ${CONTACT.region}, Colombia`);
	lines.push(`- GitHub: ${SOCIAL_LIST[0].url}`);
	lines.push(`- LinkedIn: ${SOCIAL_LIST[1].url}`);
	lines.push("");

	lines.push("## Páginas principales");
	lines.push(
		`- [Inicio](${SITE_URL}/): presentación, servicios, proyectos y preguntas frecuentes.`,
	);
	lines.push(
		`- [Blog](${SITE_URL}/blog): artículos sobre e-commerce, SEO técnico y desarrollo web.`,
	);

	if (projects.length > 0) {
		lines.push("");
		lines.push("## Proyectos");
		for (const project of projects) {
			lines.push(
				`- [${project.title}](${SITE_URL}/projects/${projectSlug(project)}): ${project.description}`,
			);
		}
	}

	if (posts.length > 0) {
		lines.push("");
		lines.push("## Artículos del blog");
		for (const post of posts) {
			lines.push(
				`- [${post.title}](${SITE_URL}/blog/${post.slug}): ${post.excerpt}`,
			);
		}
	}

	lines.push("");
	lines.push("## Opcional");
	lines.push(
		`- [Contrato de datos completos](${SITE_URL}/llms-full.txt): versión extendida con el contenido de los artículos.`,
	);
	lines.push("");

	return new Response(lines.join("\n"), {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
			"Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
		},
	});
}
