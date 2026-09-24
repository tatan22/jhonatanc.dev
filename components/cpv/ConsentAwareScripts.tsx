"use client";

import { useSyncExternalStore, type ReactNode } from "react";

interface Props {
	children: ReactNode;
}

const CONSENT_KEY = "cpv_cookie_consent";
const CONSENT_EVENT = "cpv-cookie-consent-change";

function subscribe(callback: () => void) {
	if (typeof window === "undefined") return () => {};
	window.addEventListener("storage", callback);
	window.addEventListener(CONSENT_EVENT, callback);
	return () => {
		window.removeEventListener("storage", callback);
		window.removeEventListener(CONSENT_EVENT, callback);
	};
}

function getSnapshot(): boolean {
	if (typeof window === "undefined") return false;
	return localStorage.getItem(CONSENT_KEY) === "true";
}

function getServerSnapshot(): boolean {
	return false;
}

/**
 * Solo monta los scripts de tracking/analytics cuando el usuario ha aceptado
 * las cookies (`localStorage.cpv_cookie_consent === "true"`). Hasta entonces
 * no se ejecuta ningún script de terceros (GA/GTM/Meta/Ads).
 */
export function ConsentAwareScripts({ children }: Props) {
	const accepted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

	if (!accepted) return null;
	return <>{children}</>;
}
