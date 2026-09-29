import { getPosts } from "@/lib/db";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, AUTHOR_NAME } from "@/lib/site";

export const revalidate = 3600;

function escapeXml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");
}

export async function GET() {
	const posts = await getPosts().catch(() => []);
	const now = new Date().toUTCString();

	const items = posts
		.map((post) => {
			const url = `${SITE_URL}/blog/${post.slug}`;
			const pubDate = post.published_at
				? new Date(post.published_at).toUTCString()
				: now;
			return [
				"    <item>",
				`      <title>${escapeXml(post.title)}</title>`,
				`      <link>${url}</link>`,
				`      <guid isPermaLink="true">${url}</guid>`,
				`      <pubDate>${pubDate}</pubDate>`,
				`      <category>${escapeXml(post.category)}</category>`,
				`      <description>${escapeXml(post.excerpt || "")}</description>`,
				"    </item>",
			].join("\n");
		})
		.join("\n");

	const xml = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
		"  <channel>",
		`    <title>${escapeXml(SITE_NAME)}</title>`,
		`    <link>${SITE_URL}/blog</link>`,
		`    <description>${escapeXml(SITE_DESCRIPTION)}</description>`,
		"    <language>es-CO</language>",
		`    <lastBuildDate>${now}</lastBuildDate>`,
		`    <managingEditor>${escapeXml(AUTHOR_NAME)}</managingEditor>`,
		`    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />`,
		items,
		"  </channel>",
		"</rss>",
	]
		.filter(Boolean)
		.join("\n");

	return new Response(xml, {
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
			"Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
		},
	});
}
