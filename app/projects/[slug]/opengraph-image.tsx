import { ImageResponse } from "@vercel/og";
import { getProjectById, projectSlug } from "@/lib/db";

export const runtime = "edge";

export default async function OGImage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const id = parseSlugId(slug);
	if (!id) {
		return new Response("Not found", { status: 404 });
	}

	const project = await getProjectById(id);
	if (!project) {
		return new Response("Not found", { status: 404 });
	}

	const techStack = project.tech_stack?.slice(0, 4).join(" · ") || "Full Stack";

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
					background: "linear-gradient(90deg, #8b5cf6, #3b82f6, #06b6d4)",
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
				{/* Tag */}
				<div
					style={{
						display: "inline-flex",
						alignItems: "center",
						gap: "8px",
						background: "rgba(139, 92, 246, 0.15)",
						border: "1px solid rgba(139, 92, 246, 0.3)",
						borderRadius: "9999px",
						padding: "8px 16px",
						marginBottom: "24px",
						fontSize: "14px",
						fontWeight: 500,
						color: "#a78bfa",
					}}
				>
					<span
						style={{
							width: "8px",
							height: "8px",
							borderRadius: "50%",
							background: "#8b5cf6",
						}}
					/>
					Proyecto Destacado
				</div>

				{/* Title */}
				<h1
					style={{
						fontSize: "56px",
						fontWeight: 800,
						lineHeight: 1.15,
						marginBottom: "16px",
						maxWidth: "850px",
						letterSpacing: "-0.02em",
					}}
				>
					{project.title}
				</h1>

				{/* Tech stack */}
				<div
					style={{
						fontSize: "18px",
						color: "rgba(255,255,255,0.6)",
						marginBottom: "32px",
						fontWeight: 400,
					}}
				>
					{techStack}
				</div>

				{/* Divider */}
				<div
					style={{
						width: "60px",
						height: "3px",
						background: "linear-gradient(90deg, #8b5cf6, #06b6d4)",
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
					<span>Jhonatan Cardona — Portafolio</span>
					<span style={{ color: "rgba(139,92,246,0.8)" }}>•</span>
					<span>Desarrollador Full-Stack & E-commerce</span>
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
					background:
						"radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
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
						"radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)",
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

function parseSlugId(slug: string): number | null {
	const match = slug.match(/-(\d+)$/);
	if (!match) return null;
	const id = Number(match[1]);
	return Number.isFinite(id) && id > 0 ? id : null;
}
