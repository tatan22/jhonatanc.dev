import { Github, Linkedin, Mail } from "lucide-react";
import { ScrollTopButton } from "@/components/scroll-top-button";

export function Footer() {
	return (
		<footer className="py-12 border-t border-border/40 relative">
			<div className="max-w-6xl mx-auto px-6">
				<div className="flex flex-col md:flex-row items-center justify-between gap-8">
					{/* Logo & Copyright */}
					<div className="text-center md:text-left">
						<a href="#" className="text-2xl font-bold tracking-tight">
							JhonatanCardona
							<span className="text-accent">.Dev</span>
						</a>

						<p className="text-sm text-muted-foreground mt-2">
							© {new Date().getFullYear()} Todos los derechos reservados.
						</p>
					</div>

					{/* Social links */}
					<nav
						aria-label="Redes sociales"
						className="flex items-center gap-4"
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
								href: "mailto:tatancarduar@gmail.com",
								label: "Email",
							},
						].map(({ icon: Icon, href, label }) => (
							<a
								key={label}
								href={href}
								target="_blank"
								rel="noopener noreferrer"
								className="p-3 rounded-2xl border border-border/40 bg-background/40 text-muted-foreground hover:text-accent hover:border-accent/40 hover:bg-accent/10 hover:-translate-y-1 transition-all duration-300"
								aria-label={label}
							>
								<Icon className="w-5 h-5" aria-hidden />
							</a>
						))}
					</nav>

					{/* Back to top */}
					<ScrollTopButton />
				</div>
			</div>
		</footer>
	);
}
