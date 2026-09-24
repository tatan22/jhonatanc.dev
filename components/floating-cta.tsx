"use client";

import { MessageCircle } from "lucide-react";
import { sendGTMEvent } from "@next/third-parties/google";
import { useEffect, useState } from "react";

export function FloatingCTA() {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsVisible(window.scrollY > 300);
		};
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	if (!isVisible) return null;

	return (
		<a
			href="#contact"
			onClick={() =>
				sendGTMEvent({ event: "generate_lead", value: "floating_cta" })
			}
			className="animate-scale fixed bottom-6 right-6 z-50 p-4 bg-accent text-accent-foreground rounded-full shadow-xl shadow-accent/20 cursor-pointer hover:scale-110 active:scale-95 transition-transform"
			aria-label="Ir a sección de contacto"
		>
			<MessageCircle className="w-6 h-6" aria-hidden />
		</a>
	);
}
