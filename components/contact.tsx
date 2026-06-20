"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Send, Github, Linkedin, Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function Contact() {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);
		
		const formData = new FormData(e.currentTarget);
		const data = {
			name: formData.get("name"),
			email: formData.get("email"),
			message: formData.get("message"),
		};

		try {
			const res = await fetch("/api/contact", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (!res.ok) throw new Error("Error al enviar el mensaje");
			
			setIsSubmitted(true);
			toast.success("Mensaje enviado correctamente");
		} catch (error) {
			toast.error("Hubo un problema al enviar el mensaje. Intenta nuevamente.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<section id="contact" className="py-32 relative" ref={ref}>
			<div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/2 to-transparent" />

			<div className="relative max-w-6xl mx-auto px-6">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={isInView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.6 }}
					className="text-center mb-16"
				>
					<span className="text-accent font-mono text-sm tracking-wider uppercase">
						Contacto
					</span>

					<h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mt-4 mb-6 leading-tight">
						Trabajemos en algo
						<span className="block bg-linear-to-r from-accent to-blue-400 bg-clip-text text-transparent">
							increíble juntos
						</span>
					</h2>

					<p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
						¿Tienes una idea o proyecto en mente? Estoy abierto a colaborar en
						interfaces modernas, dashboards, landing pages y aplicaciones web.
					</p>
				</motion.div>

				<div className="grid lg:grid-cols-2 gap-16">
					{/* Contact form */}
					<motion.div
						initial={{ opacity: 0, x: -30 }}
						animate={isInView ? { opacity: 1, x: 0 } : {}}
						transition={{ duration: 0.6, delay: 0.2 }}
					>
						{isSubmitted ? (
							<div className="h-full flex items-center justify-center">
								<div className="text-center">
									<div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
										<Send className="w-8 h-8 text-accent" />
									</div>
									<h3 className="text-2xl font-bold mb-2">¡Mensaje enviado!</h3>

									<p className="text-muted-foreground">
										Gracias por contactarme. Te responderé lo antes posible.
									</p>
								</div>
							</div>
						) : (
							<form
								onSubmit={handleSubmit}
								className="space-y-6 rounded-3xl border border-border/40 bg-background/40 backdrop-blur-xl p-8"
							>
								<div>
									<label
										htmlFor="name"
										className="block text-sm font-medium mb-2"
									>
										Nombre
									</label>
									<input
										type="text"
										id="name"
										name="name"
										required
										className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all"
										placeholder="Tu Nombre"
									/>
								</div>
								<div>
									<label
										htmlFor="email"
										className="block text-sm font-medium mb-2"
									>
										Email
									</label>
									<input
										type="email"
										id="email"
										name="email"
										required
										className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all"
										placeholder="Tu Email"
									/>
								</div>
								<div>
									<label
										htmlFor="message"
										className="block text-sm font-medium mb-2"
									>
										Mensaje
									</label>
									<textarea
										id="message"
										name="message"
										required
										rows={5}
										className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all resize-none"
										placeholder="Cuéntame sobre tu proyecto..."
									/>
								</div>
								<button
									type="submit"
									disabled={isSubmitting}
									className="w-full py-4 px-8 bg-foreground text-background rounded-full font-medium hover:bg-accent hover:text-accent-foreground transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
								>
									{isSubmitting ? (
										<>
											<Loader2 className="w-5 h-5 animate-spin" />
											Enviando...
										</>
									) : (
										<>
											<Send className="w-5 h-5" />
											Enviar mensaje
										</>
									)}
								</button>
							</form>
						)}
					</motion.div>

					{/* Contact info */}
					<motion.div
						initial={{ opacity: 0, x: 30 }}
						animate={isInView ? { opacity: 1, x: 0 } : {}}
						transition={{ duration: 0.6, delay: 0.3 }}
						className="space-y-8"
					>
						<div>
							<h3 className="text-xl font-semibold mb-4">Conecta conmigo</h3>
							<p className="text-muted-foreground leading-relaxed mb-8">
								Si tienes una idea, proyecto o simplemente quieres conversar
								sobre desarrollo web, puedes escribirme directamente o conectar
								conmigo en redes profesionales.
							</p>
						</div>

						<div className="space-y-4">
							{[
								{
									icon: Mail,
									label: "Email",
									value: "tatancarduar@gmail.com",
									href: "mailto:tatancarduar@gmail.com",
								},
								{
									icon: Github,
									label: "GitHub",
									value: "github.com/tatan22",
									href: "https://github.com/tatan22",
								},
								{
									icon: Linkedin,
									label: "LinkedIn",
									value: "linkedin.com/in/jhonatan-cardona",
									href: "https://www.linkedin.com/in/jhonatan-cardona-duarte-bb525199/",
								},
							].map((item) => (
								<a
									key={item.label}
									href={item.href}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-4 p-4 rounded-2xl border border-border/40 bg-background/40 backdrop-blur-sm hover:border-accent/50 hover:bg-accent/5 hover:-translate-y-1 transition-all duration-300 group"
								>
									<div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
										<item.icon className="w-5 h-5 text-accent" />
									</div>
									<div>
										<div className="text-sm text-muted-foreground">
											{item.label}
										</div>
										<div className="font-medium group-hover:text-accent transition-colors">
											{item.value}
										</div>
									</div>
								</a>
							))}
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
