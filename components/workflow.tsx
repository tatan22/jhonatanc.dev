import { Lightbulb, Palette, Code, Zap, Rocket } from "lucide-react";
import { Reveal } from "@/components/reveal";

const steps = [
	{
		icon: Lightbulb,
		title: "Definición del proyecto",
		description:
			"Analizo la idea, objetivos y necesidades del usuario para estructurar una base sólida del producto.",
	},
	{
		icon: Palette,
		title: "Diseño de interfaz",
		description:
			"Diseño interfaces modernas con enfoque en experiencia de usuario, claridad visual y jerarquía de contenido.",
	},
	{
		icon: Code,
		title: "Desarrollo Frontend",
		description:
			"Construyo la aplicación con React y Next.js usando TypeScript, código limpio y componentes reutilizables.",
	},
	{
		icon: Zap,
		title: "Optimización",
		description:
			"Mejoro rendimiento, SEO, accesibilidad y experiencia general para lograr una aplicación rápida y escalable.",
	},
	{
		icon: Rocket,
		title: "Despliegue",
		description:
			"Publico el proyecto en producción con buenas prácticas de deploy y monitoreo inicial.",
	},
];

export function Workflow() {
	return (
		<section id="workflow" className="py-24 md:py-32 relative">
			<div className="absolute inset-0 bg-linear-to-b from-transparent via-accent/2 to-transparent" />

			<div className="relative max-w-6xl mx-auto px-6">
				<Reveal className="text-center mb-10 md:mb-16">
					<span className="text-accent text-sm font-medium tracking-wider uppercase">
						Flujo de trabajo
					</span>
					<h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mt-4 mb-6 leading-tight">
						Proceso de
						<span className="block text-accent">desarrollo moderno</span>
					</h2>
					<p className="text-muted-foreground text-lg max-w-2xl mx-auto">
						Un flujo de trabajo enfocado en construir interfaces modernas,
						rápidas y escalables con React y Next.js.
					</p>
				</Reveal>

				{/* Timeline */}
				<div className="relative">
					{/* Line */}
					<div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-accent/30 to-transparent lg:-translate-x-px" />

					<div className="space-y-10 lg:space-y-16">
						{steps.map((step, index) => (
							<Reveal key={step.title} delay={index * 0.15} y={30}>
								<div
									className={`group relative flex items-start gap-8 ${
										index % 2 === 0
											? "lg:flex-row"
											: "lg:flex-row-reverse"
									}`}
								>
									{/* Icon */}
									<div className="relative z-10 shrink-0">
										<div className="w-16 h-16 rounded-2xl bg-card/60 border border-border/40 flex items-center justify-center shadow-lg shadow-black/10 hover:border-accent/50 transition-all duration-300">
											<step.icon className="w-7 h-7 text-accent group-hover:scale-110 transition-transform duration-300" />
										</div>
									</div>

									{/* Content */}
									<div
										className={`flex-1 pb-8 pl-1 ${index % 2 === 0 ? "lg:text-right lg:pr-16" : "lg:text-left lg:pl-16"}`}
									>
										<div className="inline-flex items-center justify-center w-9 h-9 text-sm font-semibold text-accent bg-accent/10 border border-accent/20 rounded-full mb-4">
											0{index + 1}
										</div>
										<h3 className="text-2xl font-semibold mb-3 group-hover:text-accent transition-colors duration-300">
											{step.title}
										</h3>
										<p className="text-muted-foreground leading-relaxed max-w-md lg:max-w-sm inline-block">
											{step.description}
										</p>
									</div>

									{/* Empty space for alternating layout */}
									<div className="hidden lg:block flex-1" />
								</div>
							</Reveal>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
