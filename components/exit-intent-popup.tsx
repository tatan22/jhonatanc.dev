"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { sendGTMEvent } from "@next/third-parties/google";

export function ExitIntentPopup() {
	const [isOpen, setIsOpen] = useState(false);
	const [hasTriggered, setHasTriggered] = useState(false);

	useEffect(() => {
		const handleMouseOut = (e: MouseEvent) => {
			if (!hasTriggered && e.clientY < 10 && e.relatedTarget === null) {
				setIsOpen(true);
				setHasTriggered(true);
				sendGTMEvent({ event: "exit_intent_show" });
			}
		};

		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") setIsOpen(false);
		};

		document.addEventListener("mouseout", handleMouseOut);
		document.addEventListener("keydown", handleEscape);
		return () => {
			document.removeEventListener("mouseout", handleMouseOut);
			document.removeEventListener("keydown", handleEscape);
		};
	}, [hasTriggered]);

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 z-[100] flex items-center justify-center px-4"
			role="dialog"
			aria-modal="true"
			aria-label="Agenda una charla"
		>
			<div
				className="animate-fade absolute inset-0 bg-background/80 backdrop-blur-sm"
				onClick={() => setIsOpen(false)}
			/>
			<div className="animate-scale relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-background p-8 shadow-2xl">
				<button
					type="button"
					onClick={() => setIsOpen(false)}
					className="absolute right-4 top-4 rounded-full p-1 hover:bg-secondary transition-colors"
					aria-label="Cerrar popup"
				>
					<X className="w-5 h-5" aria-hidden />
				</button>

				<div className="text-center">
					<h2 className="mb-4 text-2xl font-bold tracking-tight">
						¿Te vas tan pronto?
					</h2>
					<p className="mb-8 text-muted-foreground leading-relaxed">
						No dejes pasar la oportunidad de tener una web de alto impacto.
						Agendemos una charla rápida y evaluemos tu proyecto sin ningún
						compromiso.
					</p>
					<a
						href="#contact"
						onClick={() => {
							setIsOpen(false);
							sendGTMEvent({
								event: "generate_lead",
								value: "exit_intent_click",
							});
						}}
						className="inline-block w-full rounded-full bg-foreground px-8 py-4 font-medium text-background transition-transform hover:scale-[1.02]"
					>
						Hablemos ahora
					</a>
				</div>
			</div>
		</div>
	);
}
