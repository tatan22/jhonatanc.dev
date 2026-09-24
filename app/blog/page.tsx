import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar } from "lucide-react";
import { getPosts } from "@/lib/db";
import { absoluteUrl, SITE_URL, AUTHOR_NAME } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
	title: "Blog de E-commerce y Desarrollo Web",
	description:
		"Artículos sobre e-commerce, tiendas online en Colombia, SEO técnico, Next.js y desarrollo web: guías prácticas para vender más.",
	alternates: { canonical: "/blog" },
	openGraph: {
		type: "website",
		url: `${SITE_URL}/blog`,
		title: "Blog de E-commerce y Desarrollo Web | Jhonatan Cardona",
		description:
			"Guías prácticas sobre e-commerce, tiendas online, SEO técnico y desarrollo web para vender más.",
	},
};

function formatDate(iso: string): string {
	return new Date(iso).toLocaleDateString("es-CO", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

export default async function BlogPage() {
	const posts = await getPosts();

	return (
		<main id="main-content" tabIndex={-1} className="min-h-screen bg-background">
			<section className="max-w-6xl mx-auto px-6 pt-32 pb-20">
				<header className="max-w-2xl mb-14">
					<span className="text-accent text-sm font-medium tracking-wider uppercase">
						Blog
					</span>
					<h1 className="text-4xl md:text-5xl font-bold tracking-tight mt-4 mb-4">
						E-commerce y Desarrollo Web
					</h1>
					<p className="text-lg text-muted-foreground leading-relaxed">
						Guías prácticas sobre tiendas online, SEO técnico y desarrollo
						web, escritas para emprendedores que quieren vender más.
					</p>
				</header>

				{posts.length === 0 ? (
					<p className="text-muted-foreground">
						Aún no hay artículos publicados. Vuelve pronto.
					</p>
				) : (
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						{posts.map((post, index) => (
							<article
								key={post.id}
								className={`group rounded-3xl overflow-hidden bg-card/30 backdrop-blur-xl border border-border/50 hover:border-accent/30 hover:shadow-2xl hover:shadow-black/20 transition-all duration-500 ease-out ${
									index === 0 ? "md:col-span-2 lg:col-span-1" : ""
								}`}
							>
								<Link
									href={`/blog/${post.slug}`}
									className="block h-full"
								>
									<div className="relative h-48 overflow-hidden">
										<Image
											src={post.image_url}
											alt={post.title}
											fill
											sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
											className="object-cover group-hover:scale-105 transition-transform duration-500"
										/>
									</div>
									<div className="p-6 flex flex-col flex-1">
										<div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
											<span className="text-accent font-medium uppercase tracking-wider">
												{post.category}
											</span>
											<span className="inline-flex items-center gap-1">
												<Calendar
													className="w-3.5 h-3.5"
													aria-hidden
												/>
												{formatDate(post.published_at)}
											</span>
										</div>
										<h2 className="text-xl font-bold leading-snug mb-3 group-hover:text-accent transition-colors">
											{post.title}
										</h2>
										<p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
											{post.excerpt}
										</p>
										<span className="inline-flex items-center gap-2 text-sm font-medium text-accent">
											Leer artículo
											<ArrowRight
												className="w-4 h-4 group-hover:translate-x-1 transition-transform"
												aria-hidden
											/>
										</span>
									</div>
								</Link>
							</article>
						))}
					</div>
				)}

				<aside className="mt-20 rounded-3xl border border-accent/20 bg-accent/5 backdrop-blur-xl p-8 md:p-12 text-center">
					<h2 className="text-2xl md:text-3xl font-bold mb-3">
						¿Necesitas una tienda online que venda?
					</h2>
					<p className="text-muted-foreground max-w-xl mx-auto mb-6">
						Como {AUTHOR_NAME}, especialista en e-commerce, ayudo a
						emprendedores a montar y escalar tiendas online en Colombia.
					</p>
					<Link
						href="/servicios/ecommerce"
						className="inline-flex items-center gap-2 px-8 py-4 bg-foreground text-background rounded-full font-medium hover:bg-accent hover:text-accent-foreground transition-all duration-300"
					>
						Ver servicios de e-commerce
						<ArrowRight className="w-4 h-4" aria-hidden />
					</Link>
				</aside>
			</section>
		</main>
	);
}
