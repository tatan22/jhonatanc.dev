"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const techCategories = [
	{
		category: "Frontend",
		items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
	},
	{
		category: "Full Stack",
		items: ["Node.js", "NestJS", "PostgreSQL", "Prisma"],
	},
	{
		category: "Herramientas",
		items: ["Git", "GitHub", "Vercel", "Figma"],
	},
];

export function TechStack() {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });

	return (
		<section
  id="stack"
  className="relative overflow-hidden py-32"
  ref={ref}
>
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-accent/5 to-transparent" />
			<div className="max-w-6xl mx-auto px-6">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={isInView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.6 }}
					className="text-center mb-16"
				>
					<span className="text-accent font-mono text-sm tracking-wider uppercase">
						Tecnologías
					</span>
					<h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mt-4 mb-6 leading-tight">
						Tecnologías y
						<span className="block bg-linear-to-r from-accent to-blue-400 bg-clip-text text-transparent">
							herramientas principales
						</span>
					</h2>
					<p className="text-muted-foreground text-lg max-w-lg mx-auto">
						Herramientas y tecnologías que utilizo para construir aplicaciones
						modernas y escalables.
					</p>
				</motion.div>

				<div className="grid md:grid-cols-3 gap-8">
					{techCategories.map((group, groupIndex) => (
						<motion.div
							key={group.category}
							initial={{ opacity: 0, y: 20 }}
							animate={isInView ? { opacity: 1, y: 0 } : {}}
							transition={{ duration: 0.5, delay: groupIndex * 0.1 }}
							className="group h-full rounded-3xl border border-border/40 bg-background/40 backdrop-blur-xl p-8 hover:border-accent/30 hover:bg-background/60 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/5 transition-all duration-300"
						>
							<h3 className="text-xl font-semibold text-accent mb-6">
								{group.category}
							</h3>
							<div className="flex flex-wrap gap-3">
								{group.items.map((tech, index) => (
									<motion.span
										key={tech}
										initial={{ opacity: 0, scale: 0.9 }}
										animate={isInView ? { opacity: 1, scale: 1 } : {}}
										transition={{
											duration: 0.3,
											delay: groupIndex * 0.1 + index * 0.05,
										}}
										className="px-4 py-2.5 text-sm font-medium rounded-xl border border-border/40 bg-secondary/40 backdrop-blur-sm hover:border-accent/40 hover:bg-accent/15 hover:text-accent hover:-translate-y-1 transition-all duration-300 ease-out cursor-default"
									>
										{tech}
									</motion.span>
								))}
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
