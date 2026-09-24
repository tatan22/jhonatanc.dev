"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import * as Sentry from "@sentry/nextjs";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// Log estructurado para monitoreo (Vercel recoge console.error)
		console.error("[portfolio-error]", {
			message: error.message,
			digest: error.digest,
			timestamp: new Date().toISOString(),
		});
		Sentry.captureException(error);
	}, [error]);

	return (
		<main className="min-h-[60vh] flex items-center justify-center px-6">
			<div className="max-w-md text-center flex flex-col items-center gap-4">
				<AlertTriangle className="w-12 h-12 text-amber-500" aria-hidden />
				<h1 className="text-2xl font-bold">Algo salió mal</h1>
				<p className="text-muted-foreground leading-relaxed">
					Ocurrió un error inesperado. Puedes reintentar o volver al inicio.
					{error.digest ? (
						<span className="block mt-2 text-xs">Ref: {error.digest}</span>
					) : null}
				</p>
				<div className="flex gap-3 mt-2">
					<button
						onClick={reset}
						className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-foreground text-background font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
					>
						<RotateCcw className="w-4 h-4" aria-hidden /> Reintentar
					</button>
					<a
						href="/"
						className="inline-flex items-center px-5 py-2.5 rounded-xl border border-border font-medium hover:bg-secondary/80 transition-colors"
					>
						Inicio
					</a>
				</div>
			</div>
		</main>
	);
}
