import { getPosts, getProjects, projectSlug } from "@/lib/db";
import { FAQ_ITEMS } from "@/lib/faq";
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
 * llms-full.txt — versión extendida de llms.txt con el contenido completo de
 * los artículos, proyectos y FAQs, para ingestión directa por motores de IA.
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
		`Sitio oficial: ${SITE_URL}. ${AUTHOR_NAME} es ${AUTHOR_ROLE.toLowerCase()} e Ingeniero Físico en ${CONTACT.city}, ${CONTACT.region} (Colombia).`,
	);
	lines.push("");

	lines.push("## Perfil");
	lines.push(
		`- Nombre: ${AUTHOR_NAME}\n- Rol: ${AUTHOR_ROLE}\n- Email: ${CONTACT.email}\n- Ubicación: ${CONTACT.city}, ${CONTACT.region}, Colombia\n- GitHub: ${SOCIAL_LIST[0].url}\n- LinkedIn: ${SOCIAL_LIST[1].url}`,
	);
	lines.push("");

	if (projects.length > 0) {
		lines.push("## Proyectos");
		for (const project of projects) {
			lines.push("");
			lines.push(`### ${project.title}`);
			lines.push(`URL: ${SITE_URL}/projects/${projectSlug(project)}`);
			lines.push(`Descripción: ${project.description}`);
			if (project.tech_stack?.length) {
				lines.push(`Tecnologías: ${project.tech_stack.join(", ")}`);
			}
			if (project.live_url) lines.push(`Demo: ${project.live_url}`);
			if (project.github_url) lines.push(`Código fuente: ${project.github_url}`);
		}
		lines.push("");
	}

	if (posts.length > 0) {
		lines.push("## Artículos del blog");
		for (const post of posts) {
			lines.push("");
			lines.push(`### ${post.title}`);
			lines.push(`URL: ${SITE_URL}/blog/${post.slug}`);
			lines.push(`Categoría: ${post.category}`);
			lines.push(`Publicado: ${post.published_at}`);
			if (post.excerpt) lines.push(`Resumen: ${post.excerpt}`);
			lines.push("");
			lines.push(post.content);
		}
		lines.push("");
	}

	lines.push("## Preguntas frecuentes");
	for (const item of FAQ_ITEMS) {
		lines.push("");
		lines.push(`### ${item.question}`);
		lines.push(item.answer);
	}
	lines.push("");

	return new Response(lines.join("\n"), {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
			"Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
		},
	});
}
