"use client";

import { MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { sendGTMEvent } from "@next/third-parties/google";
import { useEffect, useState } from "react";

export function FloatingCTA() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.a
                    href="#contact"
                    onClick={() => sendGTMEvent({ event: "generate_lead", value: "floating_cta" })}
                    initial={{ scale: 0, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0, opacity: 0, y: 50 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="fixed bottom-6 right-6 z-50 p-4 bg-accent text-accent-foreground rounded-full shadow-xl shadow-accent/20 cursor-pointer"
                    aria-label="Ir a sección de contacto"
                >
                    <MessageCircle className="w-6 h-6" />
                </motion.a>
            )}
        </AnimatePresence>
    );
}
