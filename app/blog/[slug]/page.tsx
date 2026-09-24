import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Calendar } from "lucide-react";
import { getPostBySlug, getPosts } from "@/lib/db";
import { absoluteUrl, SITE_URL, AUTHOR_NAME, SITE_NAME } from "@/lib/site";

export const revalidate = 300;

type Props = { params: { slug: string } };

function formatDate(iso: string): string {
	return new Date(iso).toLocaleDateString("es-CO", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

export async function generateStaticParams() {
	const posts = await getPosts();
	return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const post = await getPostBySlug(params.slug);
	if (!post) return { title: "Artículo no encontrado" };

	return {
		title: `${post.title} | Blog`,
		description: post.excerpt?.slice(0, 160),
		alternates: { canonical: `/blog/${post.slug}` },
		openGraph: {
			type: "article",
			url: `${SITE_URL}/blog/${post.slug}`,
			title: post.title,
			description: post.excerpt?.slice(0, 160),
			images: [{ url: absoluteUrl(post.image_url), alt: post.title }],
			siteName: SITE_NAME,
			authors: [AUTHOR_NAME],
			publishedTime: post.published_at,
		},
		twitter: {
			card: "summary_large_image",
			title: post.title,
			description: post.excerpt?.slice(0, 160),
			images: [absoluteUrl(post.image_url)],
		},
	};
}

export default async function PostPage({ params }: Props) {
	const post = await getPostBySlug(params.slug);
	if (!post) notFound();

	const relatedPosts = (await getPosts()).filter((p) => p.id !== post.id).slice(0, 3);

	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: post.title,
		description: post.excerpt,
		image: absoluteUrl(post.image_url),
		datePublished: post.published_at,
		dateModified: post.published_at,
		author: { "@type": "Person", name: AUTHOR_NAME, url: SITE_URL },
		publisher: {
			"@type": "ProfessionalService",
			name: SITE_NAME,
			url: SITE_URL,
		},
		mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
		keywords: post.category,
	};

	const breadcrumbLd = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{ "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
			{
				"@type": "ListItem",
				position: 2,
				name: "Blog",
				item: `${SITE_URL}/blog`,
			},
			{
				"@type": "ListItem",
				position: 3,
				name: post.title,
				item: `${SITE_URL}/blog/${post.slug}`,
			},
		],
	};

	return (
		<main id="main-content" tabIndex={-1} className="min-h-screen bg-background">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
			/>
			<article className="max-w-3xl mx-auto px-6 pt-32 pb-24">
				<Link
					href="/blog"
					className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors mb-10"
				>
					<ArrowLeft className="w-4 h-4" aria-hidden />
					Volver al blog
				</Link>

				<header>
					<div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
						<span className="text-accent font-medium uppercase tracking-wider">
							{post.category}
						</span>
						<span className="inline-flex items-center gap-1">
							<Calendar className="w-4 h-4" aria-hidden />
							<time dateTime={post.published_at}>
								{formatDate(post.published_at)}
							</time>
						</span>
					</div>
					<h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-6">
						{post.title}
					</h1>
					<p className="text-lg text-muted-foreground leading-relaxed">
						{post.excerpt}
					</p>
				</header>

				<div className="relative mt-10 rounded-3xl overflow-hidden border border-border/50 aspect-video">
					<Image
						src={post.image_url}
						alt={post.title}
						fill
						priority
						sizes="(max-width: 768px) 100vw, 768px"
						className="object-cover"
					/>
				</div>

				<div className="mt-12 prose prose-invert prose-lg max-w-none leading-relaxed whitespace-pre-wrap">
					{post.content}
				</div>

				<aside className="mt-16 rounded-3xl border border-accent/20 bg-accent/5 backdrop-blur-xl p-8 text-center">
					<h2 className="text-xl font-bold mb-3">
						¿Listo para llevar tu e-commerce al siguiente nivel?
					</h2>
					<p className="text-muted-foreground mb-6">
						Hablemos de tu proyecto y descubre cómo puedo ayudarte a vender
						más online.
					</p>
					<Link
						href="/servicios/ecommerce"
						className="inline-flex items-center gap-2 px-8 py-4 bg-foreground text-background rounded-full font-medium hover:bg-accent hover:text-accent-foreground transition-all duration-300"
					>
						Servicios de e-commerce
						<ArrowRight className="w-4 h-4" aria-hidden />
					</Link>
				</aside>

				{relatedPosts.length > 0 && (
					<section className="mt-16" aria-labelledby="related-heading">
						<h2 id="related-heading" className="text-2xl font-bold mb-6">
							Sigue leyendo
						</h2>
						<div className="grid md:grid-cols-3 gap-6">
							{relatedPosts.map((related) => (
								<Link
									key={related.id}
									href={`/blog/${related.slug}`}
									className="group rounded-2xl border border-border/50 bg-card/30 p-5 hover:border-accent/30 transition-colors"
								>
									<span className="text-xs font-medium text-accent uppercase tracking-wider">
										{related.category}
									</span>
									<h3 className="text-sm font-semibold leading-snug mt-2 group-hover:text-accent transition-colors line-clamp-2">
										{related.title}
									</h3>
								</Link>
							))}
						</div>
					</section>
				)}
			</article>
		</main>
	);
}
