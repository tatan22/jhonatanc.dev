import { MetadataRoute } from "next";
import { getProjects, projectSlug } from "@/lib/db";

const SITE_URL = "https://jhonatanc-dev.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const projects = await getProjects().catch(() => []);

	const home: MetadataRoute.Sitemap[number] = {
		url: `${SITE_URL}/`,
		lastModified: new Date(),
		changeFrequency: "weekly",
		priority: 1,
	};

	const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
		url: `${SITE_URL}/projects/${projectSlug(project)}`,
		lastModified: new Date(),
		changeFrequency: "monthly",
		priority: 0.7,
	}));

	return [home, ...projectPages];
}
