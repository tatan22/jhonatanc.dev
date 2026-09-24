"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Project, projectSlug } from "@/lib/db";

type FallbackProject = {
	title: string;
	description: string;
	image: string;
	tech: string[];
	liveUrl: string;
	githubUrl: string;
	featured: boolean;
};

const fallbackProjects: FallbackProject[] = [
	{
		title: "Veloce",
		description:
			"Marketplace premium de vehículos para el Eje Cafetero con enfoque moderno, minimalista y responsive.",
		image: "/projects/veloce.jpg",
		tech: ["Next.js", "TypeScript", "Tailwind", "shadcn/ui"],
		liveUrl: "#",
		githubUrl: "https://github.com/tatan22",
		featured: true,
	},
	{
		title: "Sistema de Memoria de Cálculo Solar",
		description:
			"Aplicación para automatizar cálculos y generación de memorias técnicas para instalaciones fotovoltaicas.",
		image: "/projects/solar-system.jpg",
		tech: ["React", "Next.js", "Node.js", "TypeScript"],
		liveUrl: "#",
		githubUrl: "https://github.com/tatan22",
		featured: true,
	},
	{
		title: "Portfolio Personal",
		description:
			"Portafolio moderno desarrollado con Next.js y Framer Motion enfocado en diseño premium y animaciones suaves.",
		image: "/projects/portfolio.jpg",
		tech: ["Next.js", "Tailwind", "Framer Motion"],
		liveUrl: "#",
		githubUrl: "https://github.com/tatan22",
		featured: false,
	},
];

type ProjectLike = Partial<Project> &
	Pick<FallbackProject, "title" | "description" | "featured"> & {
		image?: string;
		image_url?: string;
		tech?: string[];
		tech_stack?: string[];
		liveUrl?: string;
		live_url?: string;
		githubUrl?: string;
		github_url?: string;
	};

export function Projects({ initialProjects }: { initialProjects?: Project[] }) {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });

	const projectsData: ProjectLike[] =
		initialProjects && initialProjects.length > 0
			? initialProjects
			: fallbackProjects;

	return (
		<section id="projects" className="py-32 relative" ref={ref}>
			<div className="max-w-6xl mx-auto px-6">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={isInView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.9 }}
					className="text-center mb-20"
				>
					<span className="text-accent font-mono text-sm tracking-wider uppercase">
						Proyectos
					</span>
					<h2 className="text-4xl md:text-5xl font-bold mt-4 mb-4">
						Proyectos Destacados
					</h2>
					<p className="text-muted-foreground text-lg max-w-xl mx-auto">
						Proyectos enfocados en interfaces modernas, experiencia de
						usuario y desarrollo web escalable.
					</p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={isInView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.9, delay: 0.15 }}
					className="grid gap-8"
				>
					{projectsData.map((project, index) => {
						const liveUrl = project.liveUrl || project.live_url || "#";
						const githubUrl =
							project.githubUrl || project.github_url || "#";
						const image =
							project.image ||
							project.image_url ||
							"/projects/portfolio.jpg";
						const tech = project.tech || project.tech_stack || [];
						const hasId =
							typeof (project as { id?: number }).id === "number";
						const detailHref = hasId
							? `/projects/${projectSlug(project as Project)}`
							: null;

						return (
							<motion.article
								key={project.title}
								initial={{ opacity: 0, scale: 0.95, y: 20 }}
								animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
								transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
								whileHover={{ y: -8, transition: { duration: 0.3 } }}
								className={`group relative rounded-3xl overflow-hidden bg-card/40 border border-border/50 hover:border-accent/30 hover:shadow-2xl hover:shadow-black/20 transition-all duration-500 ease-out ${
									project.featured ? "lg:grid lg:grid-cols-2" : ""
								}`}
							>
								{/* Image */}
								<a
									href={detailHref || liveUrl}
									target={detailHref ? undefined : "_blank"}
									rel={detailHref ? undefined : "noopener noreferrer"}
									className={`relative overflow-hidden block cursor-pointer ${project.featured ? "lg:h-auto h-80" : "h-80"}`}
									aria-label={
										detailHref
											? `Ver detalle de ${project.title}`
											: `Ver demo de ${project.title}`
									}
								>
									<div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent z-10 lg:bg-linear-to-r lg:from-black/70 lg:via-black/30 lg:to-transparent" />
									<Image
										src={image}
										alt={project.title}
										fill
										sizes="(max-width: 768px) 100vw, 50vw"
										className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
									/>
								</a>

								{/* Content */}
								<div
									className={`relative z-20 p-8 lg:p-10 ${project.featured ? "flex flex-col justify-center" : ""}`}
								>
									{detailHref ? (
										<Link
											href={detailHref}
											className="inline-block"
										>
											<h3 className="text-2xl font-semibold mb-3 group-hover:text-accent group-hover:tracking-wide transition-all duration-300">
												{project.title}
											</h3>
										</Link>
									) : (
										<a
											href={liveUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-block"
										>
											<h3 className="text-2xl font-semibold mb-3 group-hover:text-accent group-hover:tracking-wide transition-all duration-300">
												{project.title}
											</h3>
										</a>
									)}
									<p className="text-muted-foreground mb-6 leading-relaxed">
										{project.description}
									</p>

									{/* Tech stack */}
									<div className="flex flex-wrap gap-2 mb-6">
										{tech.map((t: string) => (
											<span
												key={t}
												className="px-3 py-1.5 text-xs font-medium bg-secondary/50 border border-border rounded-lg text-muted-foreground"
											>
												{t}
											</span>
										))}
									</div>

									{/* Links */}
									<div className="flex items-center gap-4">
										<a
											href={liveUrl}
											target="_blank"
											rel="noopener noreferrer"
											data-gtm-event="select_item"
											data-gtm-value={project.title}
											className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-full text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-all duration-300"
										>
											<ExternalLink
												className="w-4 h-4"
												aria-hidden
											/>
											Demo
										</a>
										<a
											href={githubUrl}
											target="_blank"
											rel="noopener noreferrer"
											data-gtm-event="select_item"
											data-gtm-value={`${project.title} (github)`}
											className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-full text-sm font-medium hover:bg-secondary/80 transition-all duration-300"
										>
											<Github className="w-4 h-4" aria-hidden />
											GitHub
										</a>
									</div>
								</div>
							</motion.article>
						);
					})}
				</motion.div>
			</div>
		</section>
	);
}
