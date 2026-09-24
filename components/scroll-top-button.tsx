"use client";

import { ArrowUp } from "lucide-react";

export function ScrollTopButton() {
	return (
		<button
			onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
			className="p-3 rounded-2xl border border-border/40 bg-background/40 text-muted-foreground hover:text-accent hover:border-accent/40 hover:bg-accent/10 hover:scale-105 active:scale-95 transition-all duration-300"
			aria-label="Volver arriba"
		>
			<ArrowUp className="w-5 h-5" aria-hidden />
		</button>
	);
}
