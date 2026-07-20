"use client";

import { motion } from "framer-motion";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import Image from "next/image";

const techBadges = ["React", "Next.js", "TypeScript", "Tailwind", "NestJS"];

import { Profile } from "@/lib/db";

export function Hero({ profile }: { profile?: Profile | null }) {
	return (
		<section className="relative min-h-screen flex items-center justify-center overflow-hidden">
			{/* Animated background */}
			<div className="absolute inset-0">
				<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" />
				<div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000" />
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-gradient-radial from-accent/5 to-transparent rounded-full" />
			</div>

			{/* Grid pattern */}
			<div
				className="absolute inset-0 opacity-[0.02]"
				style={{
					backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
					backgroundSize: "60px 60px",
				}}
			/>

			<div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-20">
				<div className="flex flex-col-reverse lg:flex-row items-center gap-16">
					{/* Content */}
					<div className="flex-1 text-center lg:text-left mt-8 lg:mt-0 flex flex-col lg:block">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
							className="order-4 lg:order-none inline-flex items-center self-center lg:self-auto gap-2 px-4 py-2 rounded-full border border-accent/20 bg-accent/10 backdrop-blur-xl text-sm text-foreground/80 shadow-lg shadow-accent/10 mb-8 mt-2 lg:mt-0"
						>
							<span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
							Disponible para oportunidades Front-End
						</motion.div>

						<motion.h1
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.1 }}
							className="order-1 lg:order-none text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-8"
						>
							{profile?.name || "Jhonatan Cardona Duarte"}
							<br />
							<span className="font-bold bg-linear-to-l from-accent to-blue-400 bg-clip-text text-transparent mt-2 block">
								{profile?.role || "Front-End Developer"}
							</span>
						</motion.h1>

						<motion.p
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className="order-2 lg:order-none text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed"
						>
							{profile?.bio || `Ingeniero Físico y Desarrollador Front-End enfocado en crear
							interfaces modernas, tiendas en línea (E-commerce) y aplicaciones web escalables
							con React, Next.js y TypeScript.`}
						</motion.p>

						{/* Tech badges */}
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.3 }}
							className="order-3 lg:order-none flex flex-wrap justify-center lg:justify-start gap-3 mb-6 lg:mb-10"
						>
							{techBadges.map((tech, index) => (
								<motion.span
									key={tech}
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ delay: 0.4 + index * 0.1 }}
									className="px-4 py-2 text-sm font-mono text-muted-foreground bg-secondary/50 rounded-lg border border-border"
								>
									{tech}
								</motion.span>
							))}
						</motion.div>

						{/* Info */}
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.4 }}
							className="order-5 lg:order-none flex flex-wrap items-center gap-3 md:gap-6 text-sm text-muted-foreground mb-10 justify-center lg:justify-start"
						>
							<span>{profile?.location || "📍 Pereira, Colombia"}</span>
							<span>⚡ React & Next.js</span>
							<span>🎓 Ingeniero Físico</span>
						</motion.div>

						{/* CTA buttons */}
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.4 }}
							className="order-6 lg:order-none flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
						>
							<a
								href="#projects"
								className="group px-8 py-4 bg-foreground text-background rounded-full font-medium hover:bg-accent hover:text-accent-foreground transition-all duration-300 flex items-center gap-2"
							>
								Ver Proyectos
								<ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
							</a>
							<a
								href="#contact"
								className="px-8 py-4 border border-border rounded-full font-medium text-foreground hover:bg-secondary transition-all duration-300"
							>
								Contáctame
							</a>
						</motion.div>

						{/* Social links */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.6, delay: 0.6 }}
							className="order-7 lg:order-none flex items-center justify-center lg:justify-start gap-4 mt-12"
						>
							{[
								{
									icon: Github,
									href: "https://github.com/tatan22",
									label: "GitHub",
								},
								{
									icon: Linkedin,
									href: "https://linkedin.com/in/jhonatan-cardona-duarte-bb525199",
									label: "LinkedIn",
								},
								{
									icon: Mail,
									href: "mailto:tatancarduar@hotmail.com",
									label: "Email",
								},
							].map(({ icon: Icon, href, label }) => (
								<a
									key={label}
									href={href}
									target="_blank"
									rel="noopener noreferrer"
									className="p-3 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-accent hover:bg-accent/10 transition-all duration-300"
									aria-label={label}
								>
									<Icon className="w-5 h-5" />
								</a>
							))}
						</motion.div>
					</div>

					{/* Profile image placeholder */}
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.8, delay: 0.3 }}
						className="relative"
					>
						<div className="relative w-72 h-72 lg:w-96 lg:h-96">
							{/* Glow effect */}
							<div className="absolute inset-0 rounded-full bg-accent/20 blur-2xl scale-110 lg:bg-accent/40 lg:blur-3xl lg:scale-150 animate-pulse z-0" />

							{/* Image container */}
							<div className="relative w-[88%] h-[88%] m-auto rounded-full overflow-hidden border border-border/50 glass z-10">
								<div className="w-full h-full bg-linear-to-br from-secondary to-muted flex items-center justify-center">
									<Image
										src={profile?.image_url || "/profile.webp"}
										alt={profile?.name || "Jhonatan Cardona Duarte"}
										fill
										priority
										quality={100}
										sizes="(max-width: 768px) 288px, 384px"
										className="object-cover scale-105 object-[50%_0%] -translate-x-1"
									/>
									{/* <span className="text-6xl lg:text-7xl font-bold text-accent/50">AR</span> */}
								</div>
							</div>

							{/* Floating badges */}
							<motion.div
								animate={{ y: [0, -10, 0] }}
								transition={{
									duration: 3,
									repeat: Infinity,
									ease: "easeInOut",
								}}
								className="absolute -top-4 -right-4 px-4 py-2 rounded-2xl border border-accent/20 bg-accent/10 backdrop-blur-xl text-sm font-medium text-foreground shadow-lg shadow-accent/10"
							>
								React • Next.js
							</motion.div>
							<motion.div
								animate={{ y: [0, 10, 0] }}
								transition={{
									duration: 3.5,
									repeat: Infinity,
									ease: "easeInOut",
								}}
								className="absolute -bottom-4 -left-4 px-4 py-2 rounded-2xl border border-accent/20 bg-accent/10 backdrop-blur-xl text-sm font-medium text-foreground shadow-lg shadow-accent/10"
							>
								Physics + Software
							</motion.div>
						</div>
					</motion.div>
				</div>
			</div>

			{/* Scroll indicator */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 1 }}
				className="absolute bottom-8 left-1/2 -translate-x-1/2"
			>
				<motion.div
					animate={{ y: [0, 8, 0] }}
					transition={{ duration: 1.5, repeat: Infinity }}
					className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2"
				>
					<motion.div className="w-1.5 h-1.5 bg-accent rounded-full" />
				</motion.div>
			</motion.div>
		</section>
	);
}
