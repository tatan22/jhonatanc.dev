"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

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
	}, [isMobileMenuOpen]);

	return (
		<>
			<motion.header
				initial={{ y: -100 }}
				animate={{ y: 0 }}
				transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
				className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
					isScrolled
						? "py-4 backdrop-blur-xl bg-background/70 border-b border-border/40"
						: "py-6 bg-transparent"
				}`}
			>
				<nav className="max-w-6xl mx-auto px-6 flex items-center justify-between">
					{/* <a href="#" className="text-3xl font-semibold tracking-tight">
            Tatán
						<span className="text-accent">.</span>dev
					</a> */}
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
								>
									{item.name}
								</a>
							</li>
						))}

						<li>
							<a
								href="#contact"
								className="text-sm px-5 py-2.5 bg-foreground text-background rounded-full hover:bg-accent hover:text-accent-foreground transition-all duration-300"
							>
								Hablemos
							</a>
						</li>
					</ul>

					<button
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						className="md:hidden p-2"
					>
						{isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
					</button>
				</nav>
			</motion.header>

			<AnimatePresence>
				{isMobileMenuOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-40 bg-background/90 backdrop-blur-xl md:hidden"
						onClick={() => setIsMobileMenuOpen(false)}
					>
						<nav
							className="flex flex-col items-center justify-center h-full gap-8"
							onClick={(e) => e.stopPropagation()}
						>
							{navItems.map((item) => (
								<a
									key={item.name}
									href={item.href}
									onClick={() => setIsMobileMenuOpen(false)}
									className="text-2xl font-medium"
								>
									{item.name}
								</a>
							))}

							<a
								href="#contact"
								onClick={() => setIsMobileMenuOpen(false)}
								className="mt-4 px-8 py-3 bg-accent rounded-full text-lg font-medium"
							>
								Get in Touch
							</a>
						</nav>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
