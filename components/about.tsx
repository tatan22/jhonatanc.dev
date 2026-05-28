"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
	{ value: "10+", label: "Proyectos desarrollados" },
	{ value: "React / Next", label: "Stack principal" },
	{ value: "Frontend", label: "Especialización actual" },
	{ value: "Full Stack", label: "En formación continua" },
];

export function About() {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });

	return (
		<section id="about" className="py-32 relative" ref={ref}>
			<div className="max-w-6xl mx-auto px-6">
				<div className="grid lg:grid-cols-2 gap-16 items-center">
					{/* Content */}
					<motion.div
						initial={{ opacity: 0, x: -30 }}
						animate={isInView ? { opacity: 1, x: 0 } : {}}
						transition={{ duration: 0.6 }}
					>
						<span className="text-accent font-mono text-sm tracking-wider uppercase">
							Sobre mi
						</span>

						<h2 className="text-4xl md:text-4xl lg:text-5xl font-bold tracking-tight mt-4 mb-8 leading-tight">
							Creando interfaces
							<span className="block bg-linear-to-r from-accent to-blue-400 bg-clip-text text-transparent">
								modernas y escalables
							</span>
						</h2>

						<div className="space-y-6 text-muted-foreground leading-relaxed">
							<p>
								Soy Ingeniero Físico con enfoque en desarrollo Frontend moderno,
								especializado en React, Next.js y TypeScript. Me enfoco en
								construir interfaces limpias, rápidas y escalables.
							</p>

							<p>
								<p>
									He desarrollado proyectos personales enfocados en SaaS,
									dashboards y landing pages, aplicando buenas prácticas de
									UI/UX, rendimiento y arquitectura de componentes.
								</p>
							</p>

							<p>
								Actualmente estoy enfocado en fortalecer mi perfil como
								desarrollador Full Stack y crear proyectos que puedan escalar a
								productos reales o startups.
							</p>
						</div>

						<motion.a
							href="#contact"
							initial={{ opacity: 0 }}
							animate={isInView ? { opacity: 1 } : {}}
							transition={{ delay: 0.3 }}
							className="inline-flex items-center mt-8 px-8 py-4 bg-foreground text-background rounded-full font-medium hover:bg-accent hover:text-accent-foreground hover:scale-[1.02] transition-all duration-300"
						>
							Hablemos de tu proyecto
						</motion.a>
					</motion.div>

					{/* Stats */}
					<motion.div
						initial={{ opacity: 0, x: 30 }}
						animate={isInView ? { opacity: 1, x: 0 } : {}}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="grid grid-cols-2 gap-6"
					>
						{stats.map((stat, index) => (
							<motion.div
								key={stat.label}
								initial={{ opacity: 0, scale: 0.9 }}
								animate={isInView ? { opacity: 1, scale: 1 } : {}}
								transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
								className="min-h-55 p-8 rounded-2xl border border-border/40 bg-background/40 backdrop-blur-xl text-center overflow-hidden hover:border-accent/60 hover:bg-background/60 hover:shadow-lg hover:shadow-accent/10 hover:-translate-y-1 transition-all duration-300 ease-out group flex flex-col justify-center"
							>
								<div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-accent to-blue-300 bg-clip-text text-transparent mb-3">
									{stat.value}
								</div>
								<div className="text-sm text-muted-foreground">
									{stat.label}
								</div>
							</motion.div>
						))}
					</motion.div>
				</div>
			</div>
		</section>
	);
}
