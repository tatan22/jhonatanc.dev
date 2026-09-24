import { ImageResponse } from "@vercel/og";
import { getPostBySlug } from "@/lib/db";

export const runtime = "edge";

export default async function OGImage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const post = await getPostBySlug(slug);
	if (!post) {
		return new Response("Not found", { status: 404 });
	}

	const categoryColor = getCategoryColor(post.category);

	const html = (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				height: "100%",
				width: "100%",
				background: "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)",
				padding: "80px",
				fontFamily: "system-ui, sans-serif",
				color: "white",
				position: "relative",
			}}
		>
			{/* Accent bar top */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					height: "6px",
					background: `linear-gradient(90deg, ${categoryColor}, #06b6d4)`,
				}}
			/>

			{/* Main content */}
			<div
				style={{
					flex: 1,
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "flex-start",
					maxWidth: "900px",
					zIndex: 1,
				}}
			>
				{/* Category badge */}
				<div
					style={{
						display: "inline-flex",
						alignItems: "center",
						gap: "8px",
						background: `rgba(${hexToRgba(categoryColor, 0.15)})`,
						border: `1px solid ${hexToRgba(categoryColor, 0.3)}`,
						borderRadius: "9999px",
						padding: "8px 16px",
						marginBottom: "24px",
						fontSize: "14px",
						fontWeight: 500,
						color: hexToRgba(categoryColor, 1),
					}}
				>
					<span
						style={{
							width: "8px",
							height: "8px",
							borderRadius: "50%",
							background: categoryColor,
						}}
					/>
					{post.category}
				</div>

				{/* Title */}
				<h1
					style={{
						fontSize: "52px",
						fontWeight: 800,
						lineHeight: 1.15,
						marginBottom: "16px",
						maxWidth: "850px",
						letterSpacing: "-0.02em",
					}}
				>
					{post.title}
				</h1>

				{/* Excerpt */}
				{post.excerpt && (
					<p
						style={{
							fontSize: "20px",
							color: "rgba(255,255,255,0.65)",
							marginBottom: "32px",
							fontWeight: 400,
							lineHeight: 1.5,
							maxWidth: "800px",
						}}
					>
						{post.excerpt}
					</p>
				)}

				{/* Divider */}
				<div
					style={{
						width: "60px",
						height: "3px",
						background: `linear-gradient(90deg, ${categoryColor}, #06b6d4)`,
						borderRadius: "2px",
						marginBottom: "24px",
					}}
				/>

				{/* Footer */}
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: "24px",
						fontSize: "14px",
						color: "rgba(255,255,255,0.4)",
					}}
				>
					<span>Jhonatan Cardona — Blog</span>
					<span style={{ color: `rgba(${hexToRgba(categoryColor, 0.8)})` }}>
						•
					</span>
					<span>E-commerce & Desarrollo Web</span>
				</div>
			</div>

			{/* Decorative elements */}
			<div
				style={{
					position: "absolute",
					bottom: "80px",
					right: "80px",
					width: "200px",
					height: "200px",
					borderRadius: "50%",
					background: `radial-gradient(circle, ${hexToRgba(categoryColor, 0.15)} 0%, transparent 70%)`,
					pointerEvents: "none",
				}}
			/>
			<div
				style={{
					position: "absolute",
					top: "120px",
					right: "100px",
					width: "300px",
					height: "300px",
					borderRadius: "50%",
					background:
						"radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)",
					pointerEvents: "none",
				}}
			/>
		</div>
	);

	return new ImageResponse(html, {
		width: 1200,
		height: 630,
	});
}

function getCategoryColor(category: string): string {
	const colors: Record<string, string> = {
		Ecommerce: "#8b5cf6",
		"Desarrollo Web": "#3b82f6",
		"UX/UI": "#06b6d4",
		SEO: "#f59e0b",
		Articulos: "#ec4899",
	};
	return colors[category] || "#8b5cf6";
}

function hexToRgba(hex: string, alpha: number): string {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
	return `${r}, ${g}, ${b}, ${alpha}`;
}
