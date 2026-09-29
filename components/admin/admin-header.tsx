"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, LogOut } from "lucide-react";

export function AdminHeader() {
	const pathname = usePathname();
	const isDashboard = pathname === "/admin/dashboard";

	const handleLogout = async () => {
		await fetch("/api/admin/logout", { method: "POST" });
		window.location.href = "/admin";
	};

	return (
		<header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-xl">
			<div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
				<Link
					href="/admin/dashboard"
					className="font-mono text-sm font-semibold tracking-wider text-accent"
				>
					PORTAFOLIO ADMIN
				</Link>

				<div className="flex items-center gap-1.5">
					<Link
						href="/"
						className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
					>
						<ExternalLink className="h-4 w-4" aria-hidden />
						<span className="hidden sm:inline">Volver al sitio</span>
					</Link>

					{isDashboard && (
						<button
							type="button"
							onClick={handleLogout}
							className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
						>
							<LogOut className="h-4 w-4" aria-hidden />
							<span className="hidden sm:inline">Salir</span>
						</button>
					)}
				</div>
			</div>
		</header>
	);
}
