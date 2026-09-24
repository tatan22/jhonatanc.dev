import { Github, Linkedin, Mail } from "lucide-react";
import Image from "next/image";
import { Profile } from "@/lib/db";
import { HeroCtas } from "@/components/hero-ctas";

const techBadges = ["Next.js", "NestJS", "React Native", "TypeScript", "Tailwind"];

const socialLinks = [
	{ icon: Github, href: "https://github.com/tatan22", label: "GitHub" },
	{
		icon: Linkedin,
		href: "https://linkedin.com/in/jhonatan-cardona-duarte-bb525199",
		label: "LinkedIn",
	},
	{ icon: Mail, href: "mailto:tatancarduar@hotmail.com", label: "Email" },
];

export function Hero({ profile }: { profile?: Profile | null }) {
	return (
		<section className="relative min-h-screen flex items-center justify-center overflow-hidden">
			{/* Fondo suave */}
			<div className="absolute inset-0">
				<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
				<div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
			</div>

			<div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 md:pt-32 pb-16 md:pb-20">
				<div className="flex flex-col-reverse lg:flex-row items-center gap-10 lg:gap-16">
					{/* Content */}
					<div className="flex-1 text-center lg:text-left mt-8 lg:mt-0 flex flex-col lg:block">
						<p
							className="animate-hero order-4 lg:order-none text-sm font-medium text-accent mb-8 mt-2 lg:mt-0"
							style={{ animationDelay: "0ms" }}
						>
							Disponible para proyectos de e-commerce
						</p>

						<h1
							className="animate-hero order-1 lg:order-none text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-8"
							style={{ animationDelay: "100ms" }}
						>
							{profile?.name || "Jhonatan Cardona Duarte"}
							<br />
							<span className="font-bold text-accent mt-2 block">
								{profile?.role || "Front-End Developer"}
							</span>
						</h1>

						<p
							className="animate-hero order-2 lg:order-none text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed"
							style={{ animationDelay: "200ms" }}
						>
							{profile?.bio ||
								`Especialista en crear tiendas online rápidas, escalables y optimizadas para SEO que ayudan a aumentar las ventas. Ingeniero Físico con experiencia en Next.js, NestJS y arquitecturas modernas para construir soluciones de alto rendimiento.`}
						</p>

						{/* Tech badges */}
						<div
							className="animate-hero order-3 lg:order-none flex flex-wrap justify-center lg:justify-start gap-3 mb-6 lg:mb-10"
							style={{ animationDelay: "300ms" }}
						>
							{techBadges.map((tech) => (
								<span
									key={tech}
									className="px-4 py-2 text-sm text-muted-foreground bg-secondary/50 rounded-lg border border-border"
								>
									{tech}
								</span>
							))}
						</div>

						{/* Info */}
						<div
							className="animate-hero order-5 lg:order-none flex flex-wrap items-center gap-3 md:gap-6 text-sm text-muted-foreground mb-10 justify-center lg:justify-start"
							style={{ animationDelay: "400ms" }}
						>
							<span>{profile?.location || "Pereira, Colombia"}</span>
							<span aria-hidden className="text-border">
								•
							</span>
							<span>React & Next.js</span>
							<span aria-hidden className="text-border">
								•
							</span>
							<span>Ingeniero Físico</span>
						</div>

						{/* CTA buttons (client: tracking GTM) */}
						<div
							className="animate-hero"
							style={{ animationDelay: "400ms" }}
						>
							<HeroCtas />
						</div>

						{/* Social links */}
						<nav
							aria-label="Redes sociales del hero"
							className="animate-fade order-7 lg:order-none flex items-center justify-center lg:justify-start gap-4 mt-12"
							style={{ animationDelay: "600ms" }}
						>
							{socialLinks.map(({ icon: Icon, href, label }) => (
								<a
									key={label}
									href={href}
									target="_blank"
									rel="noopener noreferrer"
									className="p-3 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-accent hover:bg-accent/10 transition-all duration-300"
									aria-label={label}
								>
									<Icon className="w-5 h-5" aria-hidden />
								</a>
							))}
						</nav>
					</div>

					{/* Profile image */}
					<div className="animate-scale relative">
						<div className="relative w-72 h-72 lg:w-96 lg:h-96 aspect-square">
							{/* Image container */}
							<div className="relative w-[88%] h-[88%] m-auto rounded-full overflow-hidden border border-border/50 z-10 aspect-square">
								<div className="w-full h-full bg-linear-to-br from-secondary to-muted flex items-center justify-center">
									<Image
										src={profile?.image_url || "/profile.webp"}
										alt={profile?.name || "Jhonatan Cardona Duarte"}
										fill
										priority
										quality={90}
										sizes="(max-width: 768px) 288px, 384px"
										className="object-cover object-top"
									/>
								</div>
							</div>

							{/* Floating badges */}
							<div className="animate-float absolute -top-4 -right-4 px-4 py-2 rounded-2xl border border-accent/20 bg-accent/10 text-sm font-medium text-foreground">
								React • Next.js
							</div>
							<div className="animate-float-slow absolute -bottom-4 -left-4 px-4 py-2 rounded-2xl border border-accent/20 bg-accent/10 text-sm font-medium text-foreground">
								Physics + Software
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Scroll indicator */}
			<div
				className="animate-fade absolute bottom-8 left-1/2 -translate-x-1/2"
				style={{ animationDelay: "1s" }}
			>
				<div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2">
					<div className="animate-scroll-dot w-1.5 h-1.5 bg-accent rounded-full" />
				</div>
			</div>
		</section>
	);
}
