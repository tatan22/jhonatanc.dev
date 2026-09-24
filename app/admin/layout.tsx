import { ReactNode } from "react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: ReactNode }) {
	return (
		<div className="min-h-screen bg-background text-foreground">
			{/* Simple admin header */}
			<header className="border-b border-border bg-card/50 backdrop-blur-xl">
				<div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
					<div className="font-mono text-accent font-semibold tracking-wider">
						PORTAFOLIO ADMIN
					</div>
					<Link
						href="/"
						className="text-sm text-muted-foreground hover:text-accent transition-colors"
					>
						Volver al sitio
					</Link>
				</div>
			</header>

			<main className="max-w-6xl mx-auto px-6 py-12">{children}</main>
		</div>
	);
}
