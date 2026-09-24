"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error("[portfolio-global-error]", {
			message: error.message,
			digest: error.digest,
			stack: error.stack,
			timestamp: new Date().toISOString(),
		});
		Sentry.captureException(error);
	}, [error]);

	return (
		<html lang="es">
			<body
				style={{
					margin: 0,
					minHeight: "100vh",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					background: "#0a0a0f",
					color: "#fafafa",
					fontFamily: "system-ui, -apple-system, sans-serif",
					padding: 24,
				}}
			>
				<main style={{ maxWidth: 480, textAlign: "center" }}>
					<h1 style={{ fontSize: 24 }}>Error fatal</h1>
					<p style={{ color: "#a1a1aa", lineHeight: 1.6 }}>
						La aplicación encontró un error irrecuperable.
					</p>
					<button
						onClick={reset}
						style={{
							marginTop: 16,
							padding: "10px 20px",
							borderRadius: 12,
							border: "none",
							background: "#fafafa",
							color: "#0a0a0f",
							fontWeight: 600,
							cursor: "pointer",
						}}
					>
						Reintentar
					</button>
				</main>
			</body>
		</html>
	);
}
