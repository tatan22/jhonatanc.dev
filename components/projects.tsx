"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink } from "lucide-react";
import { Github } from "lucide-react";
import Image from "next/image";

const fallbackProjects = [
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

import { Project } from "@/lib/db";

export function Projects({ initialProjects }: { initialProjects?: Project[] }) {
	const projectsData = initialProjects && initialProjects.length > 0 ? initialProjects : fallbackProjects;
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });

	return (
		<section id="projects" className="py-32 relative" ref={ref}>
			<div className="max-w-6xl mx-auto px-6">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={isInView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.6 }}
					className="text-center mb-20"
				>
					<span className="text-accent font-mono text-sm tracking-wider uppercase">
						Proyectos
					</span>
					<h2 className="text-4xl md:text-5xl font-bold mt-4 mb-4">
						Proyectos Destacados
					</h2>
					<p className="text-muted-foreground text-lg max-w-xl mx-auto">
						Proyectos enfocados en interfaces modernas, experiencia de usuario y
						desarrollo web escalable.
					</p>
				</motion.div>

				<div className="grid gap-10">
					{projectsData.map((project, index) => (
						<motion.article
							key={project.title}
							initial={{ opacity: 0, y: 40 }}
							animate={isInView ? { opacity: 1, y: 0 } : {}}
							transition={{ duration: 0.6, delay: index * 0.15 }}
							className={`group relative rounded-3xl overflow-hidden bg-card/30 backdrop-blur-xl border border-border/50 hover:border-accent/30 hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-2 transition-all duration-500 ease-out ${
								project.featured ? "lg:grid lg:grid-cols-2" : ""
							}`}
						>
							{/* Image */}
							<div
								className={`relative overflow-hidden ${project.featured ? "lg:h-auto h-80" : "h-80"}`}
							>
								<div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent z-10 lg:bg-linear-to-r lg:from-black/70 lg:via-black/30 lg:to-transparent" />
								<Image
									src={(() => {
										const url = (project as any).image || (project as any).image_url;
										if (!url || typeof url !== 'string' || url.trim() === '') {
											return "/projects/portfolio.jpg";
										}
										return url;
									})()}
									alt={project.title}
									fill
									sizes="(max-width: 768px) 100vw, 50vw"
									className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
								/>
							</div>

							{/* Content */}
							<div
								className={`relative z-20 p-8 lg:p-10 ${project.featured ? "flex flex-col justify-center" : ""}`}
							>
								<h3 className="text-2xl font-semibold mb-3 group-hover:text-accent group-hover:tracking-wide transition-all duration-300">
									{project.title}
								</h3>
								<p className="text-muted-foreground mb-6 leading-relaxed">
									{project.description}
								</p>

								{/* Tech stack */}
								<div className="flex flex-wrap gap-2 mb-6">
									{((project as any).tech || (project as any).tech_stack || []).map((tech: string) => (
										<span
											key={tech}
											className="px-3 py-1.5 text-xs font-mono bg-secondary/50 border border-border rounded-lg text-muted-foreground"
										>
											{tech}
										</span>
									))}
								</div>

								{/* Links */}
								<div className="flex items-center gap-4">
									<a
										href={(project as any).liveUrl || (project as any).live_url || "#"}
										className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-full text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-all duration-300"
									>
										<ExternalLink className="w-4 h-4" />
										Demo
									</a>
									<a
										href={(project as any).githubUrl || (project as any).github_url || "#"}
										className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-full text-sm font-medium hover:bg-secondary/80 transition-all duration-300"
									>
										<Github className="w-4 h-4" />
										GitHub
									</a>
								</div>
							</div>
						</motion.article>
					))}
				</div>
			</div>
		</section>
	);
}
