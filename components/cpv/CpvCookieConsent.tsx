"use client";

import { useEffect, useState } from "react";
import { X, Cookie } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CONSENT_KEY = "cpv_cookie_consent";
const CONSENT_EVENT = "cpv-cookie-consent-change";

export function CpvCookieConsent() {
	const [show, setShow] = useState(false);

	useEffect(() => {
		const consent = localStorage.getItem(CONSENT_KEY);
		if (consent === null) setShow(true);
	}, []);

	const accept = () => {
		localStorage.setItem(CONSENT_KEY, "true");
		window.dispatchEvent(new Event(CONSENT_EVENT));
		setShow(false);
	};

	const reject = () => {
		localStorage.setItem(CONSENT_KEY, "false");
		window.dispatchEvent(new Event(CONSENT_EVENT));
		setShow(false);
	};

	return (
		<AnimatePresence>
			{show && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 20 }}
					transition={{ duration: 0.3 }}
					className="fixed bottom-4 right-4 left-4 md:bottom-6 md:right-6 md:left-auto md:w-96 z-50"
					role="dialog"
					aria-label="Consentimiento de cookies"
				>
					<div className="bg-card border border-border rounded-2xl shadow-xl p-6 backdrop-blur-xl">
						<div className="flex items-start gap-4">
							<div className="flex-shrink-0 w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
								<Cookie className="w-5 h-5 text-accent" />
							</div>
							<div className="flex-1 min-w-0">
								<h3 className="font-semibold text-foreground">
									Usamos cookies
								</h3>
								<p className="text-sm text-muted-foreground mt-1">
									Utilizamos cookies propias y de terceros para
									analizar el tráfico, personalizar contenido y
									mejorar tu experiencia. Puedes aceptar todas o
									rechazarlas.
								</p>
							</div>
							<button
								onClick={() => setShow(false)}
								className="flex-shrink-0 p-1 text-muted-foreground hover:text-foreground transition-colors"
								aria-label="Cerrar"
							>
								<X className="w-4 h-4" />
							</button>
						</div>
						<div className="flex flex-col sm:flex-row gap-3 mt-5">
							<button
								onClick={accept}
								className="flex-1 py-2.5 px-4 bg-foreground text-background rounded-xl font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
							>
								Aceptar todas
							</button>
							<button
								onClick={reject}
								className="flex-1 py-2.5 px-4 border border-border text-foreground rounded-xl font-medium hover:bg-secondary/50 transition-colors"
							>
								Rechazar
							</button>
						</div>
						<p className="text-xs text-muted-foreground mt-3 text-center">
							Puedes cambiar tu preferencia en cualquier momento desde la
							configuración.
						</p>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
