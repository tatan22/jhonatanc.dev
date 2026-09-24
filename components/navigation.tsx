"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { sendGTMEvent } from "@next/third-parties/google";

const navItems = [
	{ name: "Proyectos", href: "#projects" },
	{ name: "Servicios", href: "#services" },
	{ name: "Stack", href: "#stack" },
	{ name: "Sobre mí", href: "#about" },
	{ name: "Contacto", href: "#contact" },
];

export function Navigation() {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	useEffect(() => {
		let ticking = false;

		const handleScroll = () => {
			if (!ticking) {
				window.requestAnimationFrame(() => {
					setIsScrolled(window.scrollY > 50);
					ticking = false;
				});
				ticking = true;
			}
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		document.body.style.overflow = isMobileMenuOpen ? "hidden" : "auto";
		return () => {
			document.body.style.overflow = "auto";
		};
	}, [isMobileMenuOpen]);

	return (
		<>
			<header
				className={`animate-header-in fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
					isScrolled
						? "py-4 bg-background/90 border-b border-border/40"
						: "py-6 bg-transparent"
				}`}
			>
				<nav
					aria-label="Navegación principal"
					className="max-w-6xl mx-auto px-6 flex items-center justify-between"
				>
					<a href="#" className="text-3xl font-bold tracking-tight">
						JhonatanCardona
						<span className="text-accent">.Dev</span>
					</a>
					<ul className="hidden md:flex items-center gap-8">
						{navItems.map((item) => (
							<li key={item.name}>
								<a
									href={item.href}
									className="text-sm font-medium text-muted-foreground hover:text-accent transition-all duration-300"
									onClick={() =>
										sendGTMEvent({
											event: "nav_click",
											value: item.name,
										})
									}
								>
									{item.name}
								</a>
							</li>
						))}

						<li>
							<a
								href="#contact"
								className="text-sm px-5 py-2.5 bg-foreground text-background rounded-full hover:bg-accent hover:text-accent-foreground transition-all duration-300"
								onClick={() =>
									sendGTMEvent({
										event: "generate_lead",
										value: "contact_nav",
									})
								}
							>
								Hablemos
							</a>
						</li>
					</ul>

					<button
						type="button"
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						className="md:hidden p-2"
						aria-expanded={isMobileMenuOpen}
						aria-controls="mobile-menu"
						aria-label={
							isMobileMenuOpen ? "Cerrar menú" : "Abrir menú principal"
						}
					>
						{isMobileMenuOpen ? (
							<X aria-hidden="true" size={24} />
						) : (
							<Menu aria-hidden="true" size={24} />
						)}
					</button>
				</nav>
			</header>

			{/* Menú mobile: render condicional + transición CSS (sin AnimatePresence) */}
			{isMobileMenuOpen && (
				<div
					id="mobile-menu"
					className="animate-fade fixed inset-0 z-40 bg-background md:hidden"
					onClick={() => setIsMobileMenuOpen(false)}
				>
					<nav
						aria-label="Navegación móvil"
						className="flex flex-col items-center justify-center h-full gap-8"
						onClick={(e) => e.stopPropagation()}
					>
						{navItems.map((item) => (
							<a
								key={item.name}
								href={item.href}
								onClick={() => {
									setIsMobileMenuOpen(false);
									sendGTMEvent({
										event: "nav_click_mobile",
										value: item.name,
									});
								}}
								className="text-2xl font-medium"
							>
								{item.name}
							</a>
						))}

						<a
							href="#contact"
							onClick={() => {
								setIsMobileMenuOpen(false);
								sendGTMEvent({
									event: "generate_lead",
									value: "contact_nav_mobile",
								});
							}}
							className="mt-4 px-8 py-3 bg-accent rounded-full text-lg font-medium"
						>
							Get in Touch
						</a>
					</nav>
				</div>
			)}
		</>
	);
}
