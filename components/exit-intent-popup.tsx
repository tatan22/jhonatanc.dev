"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { sendGTMEvent } from "@next/third-parties/google";

export function ExitIntentPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [hasTriggered, setHasTriggered] = useState(false);

    useEffect(() => {
        const mouseEvent = (e: MouseEvent) => {
            if (!hasTriggered && e.clientY < 10) {
                setIsOpen(true);
                setHasTriggered(true);
                sendGTMEvent({ event: "exit_intent_show" });
            }
        };

        document.addEventListener("mouseout", mouseEvent);
        return () => document.removeEventListener("mouseout", mouseEvent);
    }, [hasTriggered]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-background p-8 shadow-2xl"
                    >
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute right-4 top-4 rounded-full p-1 hover:bg-secondary transition-colors"
                            aria-label="Cerrar popup"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        
                        <div className="text-center">
                            <h2 className="mb-4 text-2xl font-bold tracking-tight">¿Te vas tan pronto?</h2>
                            <p className="mb-8 text-muted-foreground leading-relaxed">
                                No dejes pasar la oportunidad de tener una web de alto impacto. Agendemos una charla rápida y evaluemos tu proyecto sin ningún compromiso.
                            </p>
                            <a
                                href="#contact"
                                onClick={() => {
                                    setIsOpen(false);
                                    sendGTMEvent({ event: "generate_lead", value: "exit_intent_click" });
                                }}
                                className="inline-block w-full rounded-full bg-foreground px-8 py-4 font-medium text-background transition-transform hover:scale-[1.02]"
                            >
                                Hablemos ahora
                            </a>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
