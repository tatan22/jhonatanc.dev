"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ_ITEMS } from "@/lib/faq";

export function Faq() {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });

	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: FAQ_ITEMS.map((item) => ({
			"@type": "Question",
			name: item.question,
			acceptedAnswer: {
				"@type": "Answer",
				text: item.answer,
			},
		})),
	};

	return (
		<section id="faq" className="relative py-16 md:py-24 lg:py-32" ref={ref}>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
			<div className="max-w-3xl mx-auto px-6">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={isInView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.9 }}
					className="text-center mb-12"
				>
					<span className="text-accent font-mono text-sm tracking-wider uppercase">
						Preguntas frecuentes
					</span>
					<h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-4 mb-6 leading-tight">
						Todo lo que necesitas
						<span className="block bg-linear-to-r from-accent to-blue-400 bg-clip-text text-transparent">
							saber antes de empezar
						</span>
					</h2>
					<p className="text-muted-foreground text-lg max-w-xl mx-auto">
						Respuestas claras sobre servicios, tiempos, tecnologías y cómo
						trabajo con mis clientes.
					</p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={isInView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.7, delay: 0.15 }}
				>
					<Accordion type="single" collapsible className="w-full">
						{FAQ_ITEMS.map((item, index) => (
							<AccordionItem
								key={item.question}
								value={`item-${index}`}
								className="border-border/40"
							>
								<AccordionTrigger className="text-left text-base font-semibold hover:text-accent hover:no-underline">
									{item.question}
								</AccordionTrigger>
								<AccordionContent className="text-muted-foreground leading-relaxed">
									{item.answer}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</motion.div>
			</div>
		</section>
	);
}
