import type { MetadataRoute } from "next";
import { getPosts, getProjects, projectSlug } from "@/lib/db";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const now = new Date();

	const staticRoutes: MetadataRoute.Sitemap = [
		{
			url: `${SITE_URL}/`,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 1,
		},
		{
			url: `${SITE_URL}/blog`,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 0.8,
		},
	];

	const routes: MetadataRoute.Sitemap = [...staticRoutes];

	try {
		const posts = await getPosts();
		for (const post of posts) {
			routes.push({
				url: `${SITE_URL}/blog/${post.slug}`,
				lastModified: post.published_at ? new Date(post.published_at) : now,
				changeFrequency: "monthly",
				priority: 0.7,
			});
		}
	} catch {
		// Si la BD no responde, conservamos las rutas estáticas.
	}

	try {
		const projects = await getProjects();
		for (const project of projects) {
			routes.push({
				url: `${SITE_URL}/projects/${projectSlug(project)}`,
				lastModified: now,
				changeFrequency: "monthly",
				priority: 0.6,
			});
		}
	} catch {
		// Si la BD no responde, conservamos las rutas estáticas.
	}

	return routes;
}
