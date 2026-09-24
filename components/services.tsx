import { Layout, BarChart3, Monitor, Code2, Search } from "lucide-react";
import { Reveal } from "@/components/reveal";

const capabilities = [
	{
		icon: Layout,
		title: "Interfaces Modernas",
		description:
			"Diseños limpios, atractivos y enfocados en experiencia de usuario.",
	},
	{
		icon: Code2,
		title: "Aplicaciones Escalables",
		description:
			"Arquitecturas frontend organizadas con React, Next.js y TypeScript.",
	},
	{
		icon: BarChart3,
		title: "Dashboards Interactivos",
		description: "Paneles visuales con métricas, gráficas y datos dinámicos.",
	},
	{
		icon: Monitor,
		title: "Experiencias Responsive",
		description:
			"Interfaces adaptadas perfectamente a móviles, tablets y escritorio.",
	},
	{
		icon: Search,
		title: "Optimización Web",
		description: "Mejoras en rendimiento, velocidad y posicionamiento SEO.",
	},
];

export function Services() {
	return (
		<section id="services" className="py-24 md:py-32 relative">
			<div className="relative max-w-6xl mx-auto px-6">
				<Reveal className="text-center mb-12 md:mb-20">
					<span className="text-accent text-sm font-medium tracking-wider uppercase">
						Servicios
					</span>
					<h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mt-4 mb-6 leading-tight">
						Desarrollo
						<span className="block text-accent">Frontend Moderno</span>
					</h2>
					<p className="text-muted-foreground text-lg max-w-lg mx-auto">
						Desarrollo interfaces modernas, rápidas y escalables con React,
						Next.js y TypeScript, enfocadas en rendimiento y experiencia de
						usuario.
					</p>
				</Reveal>

				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
					{capabilities.map((item, index) => (
						<Reveal key={item.title} delay={index * 0.08} y={20}>
							<div className="group relative h-full p-6 rounded-2xl border border-border/40 bg-background/40 overflow-hidden hover:border-accent/30 hover:bg-card/60 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/5 transition-all duration-300 ease-out">
								<div className="relative z-10">
									<div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-5 text-accent group-hover:scale-110 transition-all duration-300">
										<item.icon className="w-5 h-5 text-accent" />
									</div>

									<h3 className="text-lg font-semibold mb-1.5 group-hover:text-accent transition-colors duration-300">
										{item.title}
									</h3>

									<p className="text-sm text-muted-foreground leading-relaxed">
										{item.description}
									</p>
								</div>
							</div>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	);
}
