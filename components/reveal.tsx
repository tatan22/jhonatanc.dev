"use client";

import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { useState } from "react";

type RevealState = "ssr" | "hidden" | "shown";

/**
 * Wrapper de revelado al hacer scroll.
 * - SSR renderiza contenido visible (sin opacidad 0 en HTML → SEO/No-JS safe).
 * - Solo oculta tras hidratar si el elemento está fuera del viewport.
 * - Respeta prefers-reduced-motion.
 * - Usa IntersectionObserver (no framer-motion → JS mucho más ligero).
 */
export function Reveal({
	children,
	delay = 0,
	y = 24,
	className,
}: {
	children: ReactNode;
	delay?: number;
	y?: number;
	className?: string;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const [state, setState] = useState<RevealState>("ssr");

	useLayoutEffect(() => {
		const el = ref.current;
		if (!el) return;

		const reduce =
			typeof window !== "undefined" &&
			window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (reduce) {
			setState("shown");
			return;
		}

		const rect = el.getBoundingClientRect();
		const inView = rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
		if (inView) {
			setState("shown");
			return;
		}

		setState("hidden");
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						setState("shown");
						observer.disconnect();
					}
				}
			},
			{ rootMargin: "0px 0px -80px 0px" },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	// Fallback si useLayoutEffect no corre (SSR sin hidratación)
	useEffect(() => {
		if (state === "ssr") setState("shown");
	}, [state]);

	const style: React.CSSProperties = {
		transition: `opacity 600ms cubic-bezier(0.25, 0.1, 0.25, 1) ${delay}s, transform 600ms cubic-bezier(0.25, 0.1, 0.25, 1) ${delay}s`,
		...(state === "hidden"
			? { opacity: 0, transform: `translateY(${y}px)` }
			: state === "shown"
				? { opacity: 1, transform: "none" }
				: {}),
	};

	return (
		<div ref={ref} className={className} style={style}>
			{children}
		</div>
	);
}
