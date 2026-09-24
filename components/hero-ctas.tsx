"use client";

import { sendGTMEvent } from "@next/third-parties/google";

export function HeroCtas() {
	return (
		<div className="order-6 lg:order-none flex items-center justify-center lg:justify-start">
			<a
				href="#contact"
				onClick={() =>
					sendGTMEvent({ event: "generate_lead", value: "contact_hero" })
				}
				className="px-8 py-4 bg-foreground text-background rounded-full font-medium hover:bg-accent hover:text-accent-foreground transition-all duration-300"
			>
				Hablemos de tu proyecto
			</a>
		</div>
	);
}
