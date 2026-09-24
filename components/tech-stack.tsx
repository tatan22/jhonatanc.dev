import { Reveal } from "@/components/reveal";

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
	return (
		<section id="stack" className="relative overflow-hidden py-24 md:py-32">
			<div className="absolute inset-0 bg-linear-to-b from-transparent via-accent/5 to-transparent" />
			<div className="max-w-6xl mx-auto px-6">
				<Reveal className="text-center mb-10 md:mb-16">
					<span className="text-accent text-sm font-medium tracking-wider uppercase">
						Tecnologías
					</span>
					<h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mt-4 mb-6 leading-tight">
						Tecnologías y
						<span className="block text-accent">
							herramientas principales
						</span>
					</h2>
					<p className="text-muted-foreground text-lg max-w-lg mx-auto">
						Herramientas y tecnologías que utilizo para construir
						aplicaciones modernas y escalables.
					</p>
				</Reveal>

				<div className="grid md:grid-cols-3 gap-8">
					{techCategories.map((group, groupIndex) => (
						<Reveal key={group.category} delay={groupIndex * 0.1} y={20}>
							<div className="group h-full rounded-3xl border border-border/40 bg-background/40 p-8 hover:border-accent/30 hover:bg-background/60 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/5 transition-all duration-300">
								<h3 className="text-xl font-semibold text-accent mb-6">
									{group.category}
								</h3>
								<div className="flex flex-wrap gap-3">
									{group.items.map((tech) => (
										<span
											key={tech}
											className="px-4 py-2.5 text-sm font-medium rounded-xl border border-border/40 bg-secondary/40 hover:border-accent/40 hover:bg-accent/15 hover:text-accent hover:-translate-y-1 transition-all duration-300 ease-out cursor-default"
										>
											{tech}
										</span>
									))}
								</div>
							</div>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	);
}
