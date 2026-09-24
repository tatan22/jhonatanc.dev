import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Github, ArrowLeft } from "lucide-react";

import { getProjectById, getProjects, projectSlug } from "@/lib/db";
import { ViewItemTracker } from "@/components/analytics";

const SITE_URL = "https://jhonatanc-dev.vercel.app";

export const revalidate = 300;

type Props = { params: { slug: string } };

function parseSlugId(slug: string): number | null {
	const match = slug.match(/-(\d+)$/);
	if (!match) return null;
	const id = Number(match[1]);
	return Number.isFinite(id) && id > 0 ? id : null;
}

export async function generateStaticParams() {
	const projects = await getProjects().catch(() => []);
	return projects.map((p) => ({ slug: projectSlug(p) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const id = parseSlugId(params.slug);
	if (!id) return { title: "Proyecto no encontrado" };

	const project = await getProjectById(id);
	if (!project) return { title: "Proyecto no encontrado" };

	const canonical = `/projects/${projectSlug(project)}`;
	const imageUrl = project.image_url.startsWith("http")
		? project.image_url
		: `${SITE_URL}${project.image_url}`;

	return {
		title: `${project.title} | Proyecto`,
		description: project.description.slice(0, 160),
		alternates: { canonical },
		openGraph: {
			type: "article",
			url: `${SITE_URL}${canonical}`,
			title: project.title,
			description: project.description.slice(0, 160),
			images: [{ url: imageUrl, alt: project.title }],
			siteName: "Portafolio de Jhonatan Cardona",
		},
		twitter: {
			card: "summary_large_image",
			title: project.title,
			description: project.description.slice(0, 160),
			images: [imageUrl],
		},
	};
}

export default async function ProjectPage({ params }: Props) {
	const id = parseSlugId(params.slug);
	if (!id) notFound();

	const project = await getProjectById(id).catch(() => null);
	if (!project) notFound();

	// Canonical: el slug real puede diferir si se renombró el título
	const canonicalSlug = projectSlug(project);
	const canonicalUrl = `${SITE_URL}/projects/${canonicalSlug}`;
	const imageUrl = project.image_url.startsWith("http")
		? project.image_url
		: `${SITE_URL}${project.image_url}`;

	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "SoftwareSourceCode",
		name: project.title,
		description: project.description,
		url: canonicalUrl,
		image: imageUrl,
		programmingLanguage: project.tech_stack,
		author: {
			"@type": "Person",
			name: "Jhonatan Cardona Duarte",
			url: SITE_URL,
		},
		codeRepository: project.github_url || undefined,
	};

	return (
		<main id="main-content" tabIndex={-1} className="min-h-screen bg-background">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
			<ViewItemTracker id={project.id} name={project.title} />
			<article className="max-w-4xl mx-auto px-6 pt-32 pb-24">
				<Link
					href="/#projects"
					className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors mb-10"
				>
					<ArrowLeft className="w-4 h-4" aria-hidden />
					Volver a proyectos
				</Link>

				<header>
					<h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
						{project.title}
					</h1>
					<p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
						{project.description}
					</p>
				</header>

				<div className="relative mt-10 rounded-3xl overflow-hidden border border-border/50 aspect-video">
					<Image
						src={project.image_url}
						alt={`Captura del proyecto ${project.title}`}
						fill
						priority
						sizes="(max-width: 896px) 100vw, 896px"
						className="object-cover"
					/>
				</div>

				{project.tech_stack?.length > 0 && (
					<section className="mt-10" aria-labelledby="tech-heading">
						<h2 id="tech-heading" className="text-xl font-semibold mb-4">
							Tecnologías
						</h2>
						<ul className="flex flex-wrap gap-2" role="list">
							{project.tech_stack.map((tech) => (
								<li
									key={tech}
									className="px-4 py-2 text-sm font-medium bg-secondary/50 border border-border rounded-lg text-muted-foreground"
								>
									{tech}
								</li>
							))}
						</ul>
					</section>
				)}

				<div className="mt-12 flex flex-wrap gap-4">
					{project.live_url && (
						<a
							href={project.live_url}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-full text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-all duration-300"
						>
							<ExternalLink className="w-4 h-4" aria-hidden />
							Ver demo
						</a>
					)}
					{project.github_url && (
						<a
							href={project.github_url}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-full text-sm font-medium hover:bg-secondary/80 transition-all duration-300"
						>
							<Github className="w-4 h-4" aria-hidden />
							Código fuente
						</a>
					)}
				</div>
			</article>
		</main>
	);
}
