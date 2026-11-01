import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getProfile, getProjects } from "@/lib/db";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { profileUpdateSchema, projectUpdateSchema } from "@/lib/validation";

// Verificación independiente del middleware (defensa en profundidad)
async function isAuthenticated() {
	const session = cookies().get(ADMIN_SESSION_COOKIE);
	return await verifySessionToken(session?.value);
}

// Datos de fallback para desarrollo local sin DB
const FALLBACK_PROFILE = {
	id: 1,
	name: "Jhonatan Cardona Duarte",
	role: "Full-Stack TypeScript Engineer",
	bio: "Ingeniero Físico y Desarrollador Full-Stack especializado en crear aplicaciones web completas, escalables y productos de alta gama con React, Next.js, Node.js, Drizzle ORM y TypeScript.",
	image_url: "/profile.webp",
	resume_url: null,
	github_url: null,
	linkedin_url: null,
	email: null,
	location: "📍 Pereira, Colombia",
};

const FALLBACK_PROJECTS = [
	{
		id: 0,
		title: "Carvin Ofertas",
		description:
			"Agregador de ofertas afiliadas de Amazon, AliExpress y MercadoLibre. Verifica precios históricos y lleva al comprador directo a la tienda oficial (ruta /go). Catálogo con scraping automático cada 30 min, búsqueda, wishlist, ofertas flash en tiempo real, panel de administración, SEO completo y monetización con AdSense.",
		image_url: "https://www.carvinofertas.com/og-default.png",
		tech_stack: [
			"Next.js",
			"TypeScript",
			"PostgreSQL",
			"Drizzle ORM",
			"Neon",
			"Tailwind CSS",
			"Better Auth",
			"Pusher",
			"UploadThing",
			"Sentry",
		],
		live_url: "https://www.carvinofertas.com/",
		github_url: null,
		featured: true,
		order_index: 0,
	},
	{
		id: 1,
		title: "Meetly",
		description:
			"Plataforma SaaS full-stack premium para la creación, gestión y programación de comunidades y eventos en tiempo real, impulsada por Inteligencia Artificial y bases de datos serverless.",
		image_url: "https://utfs.io/f/cvaZwA2TqdhLtj9Z3KVK3PVOlZroyxs6RDma9zhd7L0AjftY",
		tech_stack: [
			"Next.js",
			"TypeScript",
			"Drizzle ORM",
			"Neon DB",
			"Better Auth",
			"Tailwind CSS",
			"AI SDK",
		],
		live_url: "https://meetly-sandy-delta.vercel.app/",
		github_url: "https://github.com/tatan22",
		featured: true,
		order_index: 1,
	},
	{
		id: 2,
		title: "Carvin Shop - E-commerce",
		description:
			"Tienda online demo full-stack con catálogo de ropa, carrito de compras, PayPal, panel admin, autenticación, SEO completo y búsqueda.",
		image_url: "https://utfs.io/f/cvaZwA2TqdhLu8XKEW3aKAN39RD8uWTkqjdxIsOn4GLmSCE2",
		tech_stack: [
			"Next.js",
			"TypeScript",
			"PostgreSQL",
			"Tailwind CSS",
			"Better Auth",
			"PayPal",
		],
		live_url: "https://carvin-shop-portafolio.vercel.app",
		github_url: "https://github.com/tatan22",
		featured: true,
		order_index: 2,
	},
	{
		id: 3,
		title: "Portfolio Personal",
		description:
			"Portafolio moderno desarrollado con Next.js y Framer Motion enfocado en diseño premium y animaciones suaves.",
		image_url: "/projects/portfolio.jpg",
		tech_stack: ["Next.js", "Tailwind", "Framer Motion"],
		live_url: null,
		github_url: "https://github.com/tatan22",
		featured: false,
		order_index: 3,
	},
];

export async function GET() {
	if (!(await isAuthenticated()))
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	try {
		const [profile, projects] = await Promise.all([
			getProfile().catch(() => null),
			getProjects().catch(() => []),
		]);

		// Si falla la DB, usar fallbacks
		return NextResponse.json({
			profile: profile || FALLBACK_PROFILE,
			projects: projects.length > 0 ? projects : FALLBACK_PROJECTS,
		});
	} catch {
		return NextResponse.json({
			profile: FALLBACK_PROFILE,
			projects: FALLBACK_PROJECTS,
		});
	}
}

export async function PUT(request: Request) {
	if (!(await isAuthenticated()))
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const { searchParams } = new URL(request.url);
	const type = searchParams.get("type");
	const data = await request.json();

	try {
		if (type === "profile") {
			const parsed = profileUpdateSchema.safeParse(data);
			if (!parsed.success)
				return NextResponse.json({ error: "URL inválida" }, { status: 400 });

			const {
				name,
				role,
				bio,
				image_url,
				location,
				email,
				github_url,
				linkedin_url,
				resume_url,
			} = data as Record<string, string | null | undefined>;
			try {
				await sql`
          UPDATE profiles 
          SET name = ${name}, role = ${role}, bio = ${bio}, image_url = ${image_url},
              location = ${location}, email = ${email}, github_url = ${github_url},
              linkedin_url = ${linkedin_url}, resume_url = ${resume_url}
          WHERE id = (SELECT id FROM profiles ORDER BY id LIMIT 1)
        `;
				revalidatePath("/");
				return NextResponse.json({ success: true });
			} catch (err) {
				console.error(err);
				return NextResponse.json(
					{ error: err instanceof Error ? err.message : "Unknown error" },
					{ status: 500 },
				);
			}
		} else if (type === "project") {
			const parsed = projectUpdateSchema.safeParse(data);
			if (!parsed.success) {
				const invalidTechStack = parsed.error.issues.some(
					(issue) => issue.path[0] === "tech_stack",
				);
				return NextResponse.json(
					{
						error: invalidTechStack
							? "tech_stack inválido"
							: "URL inválida",
					},
					{ status: 400 },
				);
			}

			const {
				id,
				title,
				description,
				image_url,
				tech_stack,
				live_url,
				github_url,
				featured,
				order_index,
			} = data as {
				id: number;
				title: string;
				description: string;
				image_url: string;
				tech_stack: string[];
				live_url: string;
				github_url: string;
				featured: boolean;
				order_index: number;
			};
			await sql`
        UPDATE projects 
        SET title = ${title}, description = ${description}, image_url = ${image_url}, 
            tech_stack = ${`{${tech_stack.join(",")}}`}, live_url = ${live_url}, github_url = ${github_url}, 
            featured = ${featured}, order_index = ${order_index}
        WHERE id = ${id}
      `;
			revalidatePath("/");
			return NextResponse.json({ success: true });
		}
		return NextResponse.json({ error: "Invalid type" }, { status: 400 });
	} catch (error) {
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			{ status: 500 },
		);
	}
}

export async function POST(request: Request) {
	if (!(await isAuthenticated()))
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const { searchParams } = new URL(request.url);
	const type = searchParams.get("type");
	const data = await request.json();

	try {
		if (type === "project") {
			const parsed = projectUpdateSchema.safeParse(data);
			if (!parsed.success) {
				const invalidTechStack = parsed.error.issues.some(
					(issue) => issue.path[0] === "tech_stack",
				);
				return NextResponse.json(
					{
						error: invalidTechStack
							? "tech_stack inválido"
							: "URL inválida",
					},
					{ status: 400 },
				);
			}

			const {
				title,
				description,
				image_url,
				tech_stack,
				live_url,
				github_url,
				featured,
				order_index,
			} = data as {
				title: string;
				description: string;
				image_url: string;
				tech_stack: string[];
				live_url: string;
				github_url: string;
				featured: boolean;
				order_index: number;
			};
			await sql`
        INSERT INTO projects (title, description, image_url, tech_stack, live_url, github_url, featured, order_index)
        VALUES (${title}, ${description}, ${image_url}, ${`{${tech_stack.join(",")}}`}, ${live_url}, ${github_url}, ${featured}, ${order_index})
      `;
			revalidatePath("/");
			return NextResponse.json({ success: true });
		}
		return NextResponse.json({ error: "Invalid type" }, { status: 400 });
	} catch (error) {
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			{ status: 500 },
		);
	}
}

export async function DELETE(request: Request) {
	if (!(await isAuthenticated()))
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const { searchParams } = new URL(request.url);
	const type = searchParams.get("type");
	const id = searchParams.get("id");

	try {
		if (type === "project" && id) {
			await sql`DELETE FROM projects WHERE id = ${id}`;
			revalidatePath("/");
			return NextResponse.json({ success: true });
		}
		return NextResponse.json(
			{ error: "Invalid type or missing id" },
			{ status: 400 },
		);
	} catch (error) {
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			{ status: 500 },
		);
	}
}
