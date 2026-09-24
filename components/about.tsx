import { Reveal } from "@/components/reveal";

const stats = [
	{ value: "10+", label: "Proyectos desarrollados" },
	{ value: "React / Next", label: "Stack principal" },
	{ value: "Frontend", label: "Especialización actual" },
	{ value: "Full Stack", label: "En formación continua" },
];

export function About() {
	return (
		<section id="about" className="py-24 md:py-32 relative">
			<div className="max-w-6xl mx-auto px-6">
				<div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center">
					{/* Content */}
					<Reveal>
						<span className="text-accent text-sm font-medium tracking-wider uppercase">
							Sobre mi
						</span>

						<h2 className="text-4xl md:text-4xl lg:text-5xl font-bold tracking-tight mt-4 mb-8 leading-tight">
							Creando interfaces
							<span className="block text-accent">
								modernas y escalables
							</span>
						</h2>

						<div className="space-y-6 text-muted-foreground leading-relaxed">
							<p>
								Soy Ingeniero Físico con enfoque en desarrollo Frontend
								moderno, especializado en React, Next.js y TypeScript.
								Me enfoco en construir interfaces limpias, rápidas y
								escalables.
							</p>

							<p>
								He desarrollado proyectos personales enfocados en SaaS,
								dashboards y landing pages, aplicando buenas prácticas
								de UI/UX, rendimiento y arquitectura de componentes.
							</p>

							<p>
								Actualmente estoy enfocado en fortalecer mi perfil como
								desarrollador Full Stack y crear proyectos que puedan
								escalar a productos reales o startups.
							</p>
						</div>

						<a
							href="#contact"
							className="inline-flex items-center mt-8 px-8 py-4 bg-foreground text-background rounded-full font-medium hover:bg-accent hover:text-accent-foreground hover:scale-[1.02] transition-all duration-300"
						>
							Hablemos de tu proyecto
						</a>
					</Reveal>

					{/* Stats */}
					<div className="grid grid-cols-2 gap-6">
						{stats.map((stat, index) => (
							<Reveal key={stat.label} delay={0.2 + index * 0.1} y={16}>
								<div className="h-full min-h-55 p-8 rounded-2xl border border-border/40 bg-background/40 text-center overflow-hidden hover:border-accent/60 hover:bg-background/60 hover:shadow-lg hover:shadow-accent/10 hover:-translate-y-1 transition-all duration-300 ease-out group flex flex-col justify-center">
									<div className="text-3xl md:text-4xl font-bold text-accent mb-3">
										{stat.value}
									</div>
									<div className="text-sm text-muted-foreground">
										{stat.label}
									</div>
								</div>
							</Reveal>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
