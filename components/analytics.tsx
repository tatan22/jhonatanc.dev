"use client";

import { useEffect } from "react";
import { sendGTMEvent } from "@next/third-parties/google";

/**
 * Delegación de eventos de analytics en el documento.
 * Los Server Components declaran data-gtm-event / data-gtm-value en links/botones
 * y este componente los emite al dataLayer (GA4/GTM) sin necesidad de "use client"
 * en cada sección.
 *
 * Eventos soportados (dataLayer estándar):
 * - select_item  → clic en proyecto/demo
 * - view_item    → visita a detalle de proyecto (emitido por ViewItemTracker)
 * - generate_lead→ clics en CTAs
 * - nav_click    → navegación
 */
export function AnalyticsDelegate() {
	useEffect(() => {
		const handleClick = (e: MouseEvent) => {
			const target = (e.target as HTMLElement | null)?.closest<HTMLElement>(
				"[data-gtm-event]",
			);
			if (!target) return;

			const event = target.dataset.gtmEvent;
			if (!event) return;

			sendGTMEvent({
				event,
				...(target.dataset.gtmValue ? { value: target.dataset.gtmValue } : {}),
				...(target.dataset.gtmItem ? { item_id: target.dataset.gtmItem } : {}),
			});
		};

		document.addEventListener("click", handleClick);
		return () => document.removeEventListener("click", handleClick);
	}, []);

	return null;
}

/** Emite view_item al montar la página de detalle de proyecto. */
export function ViewItemTracker({
	id,
	name,
	category,
}: {
	id: string | number;
	name: string;
	category?: string;
}) {
	useEffect(() => {
		sendGTMEvent({
			event: "view_item",
			item_id: String(id),
			item_name: name,
			...(category ? { item_category: category } : {}),
			value: 1,
		});
	}, [id, name, category]);

	return null;
}
