import { sql } from "@vercel/postgres";

export type Profile = {
	id: number;
	name: string;
	role: string;
	bio: string;
	image_url: string;
	resume_url?: string;
	github_url?: string;
	linkedin_url?: string;
	email?: string;
	location?: string;
};

export type Project = {
	id: number;
	title: string;
	description: string;
	image_url: string;
	tech_stack: string[];
	live_url?: string;
	github_url?: string;
	featured: boolean;
	order_index: number;
};

export type Post = {
	id: number;
	title: string;
	slug: string;
	excerpt: string;
	content: string;
	image_url: string;
	category: string;
	published_at: string;
};

export async function initDb() {
	try {
		// Create profiles table
		await sql`
      CREATE TABLE IF NOT EXISTS profiles (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        bio TEXT,
        image_url VARCHAR(255),
        resume_url VARCHAR(255),
        github_url VARCHAR(255),
        linkedin_url VARCHAR(255),
        email VARCHAR(255),
        location VARCHAR(255)
      );
    `;

		// Create projects table
		await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        tech_stack TEXT[] DEFAULT '{}',
        live_url VARCHAR(255),
        github_url VARCHAR(255),
        featured BOOLEAN DEFAULT false,
        order_index INTEGER DEFAULT 0
      );
    `;

		// Preemptive fix: Alter columns to TEXT in case they were previously created as VARCHAR(255)
		await sql`ALTER TABLE profiles ALTER COLUMN image_url TYPE TEXT`;
		await sql`ALTER TABLE projects ALTER COLUMN image_url TYPE TEXT`;

		// Create posts table (blog)
		await sql`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        excerpt TEXT,
        content TEXT NOT NULL,
        image_url VARCHAR(255),
        category VARCHAR(100) DEFAULT 'Desarrollo Web',
        published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
		await sql`ALTER TABLE posts ALTER COLUMN image_url TYPE TEXT`;

		// Insert default profile if not exists
		const { rows } = await sql`SELECT COUNT(*) FROM profiles`;
		if (parseInt(rows[0].count) === 0) {
			await sql`
        INSERT INTO profiles (name, role, bio, image_url, location)
        VALUES ('Jhonatan Cardona Duarte', 'Full-Stack TypeScript Engineer', 'Ingeniero Físico y Desarrollador Front-End enfocado en crear interfaces modernas, experiencias intuitivas y aplicaciones web con React, Next.js y TypeScript.', '/profile.webp', '📍 Pereira, Colombia')
      `;
		}

		// Insert default projects if not exists
		const { rows: projectRows } = await sql`SELECT COUNT(*) FROM projects`;
		if (parseInt(projectRows[0].count) === 0) {
			await sql`
        INSERT INTO projects (title, description, image_url, tech_stack, github_url, featured, order_index)
        VALUES 
        ('Veloce', 'Marketplace premium de vehículos para el Eje Cafetero con enfoque moderno, minimalista y responsive.', '/projects/veloce.jpg', ARRAY['Next.js', 'TypeScript', 'Tailwind', 'shadcn/ui'], 'https://github.com/tatan22', true, 1),
        ('Sistema de Memoria de Cálculo Solar', 'Aplicación para automatizar cálculos y generación de memorias técnicas para instalaciones fotovoltaicas.', '/projects/solar-system.jpg', ARRAY['React', 'Next.js', 'Node.js', 'TypeScript'], 'https://github.com/tatan22', true, 2),
        ('Portfolio Personal', 'Portafolio moderno desarrollado con Next.js y Framer Motion enfocado en diseño premium y animaciones suaves.', '/projects/portfolio.jpg', ARRAY['Next.js', 'Tailwind', 'Framer Motion'], 'https://github.com/tatan22', false, 3)
      `;
		}

		// Asegura el proyecto destacado principal (idempotente, se puede re-ejecutar).
		const { rows: featuredRows } =
			await sql`SELECT id FROM projects WHERE title = 'Carvin Ofertas' LIMIT 1`;
		if (featuredRows.length === 0) {
			await sql`
        INSERT INTO projects (title, description, image_url, tech_stack, live_url, github_url, featured, order_index)
        VALUES (
          'Carvin Ofertas',
          'Agregador de ofertas afiliadas de Amazon, AliExpress y MercadoLibre. Verifica precios históricos y lleva al comprador directo a la tienda oficial (ruta /go). Catálogo con scraping automático cada 30 min, búsqueda, wishlist, ofertas flash en tiempo real, panel de administración, SEO completo y monetización con AdSense.',
          'https://www.carvinofertas.com/og-default.png',
          ARRAY['Next.js', 'TypeScript', 'PostgreSQL', 'Drizzle ORM', 'Neon', 'Tailwind CSS', 'Better Auth', 'Pusher', 'UploadThing', 'Sentry'],
          'https://www.carvinofertas.com/',
          NULL,
          true,
          0
        )
      `;
		} else {
			await sql`
        UPDATE projects SET featured = true, order_index = 0
        WHERE title = 'Carvin Ofertas'
      `;
		}

		// Insert seed blog posts if not exists
		const { rows: postRows } = await sql`SELECT COUNT(*) FROM posts`;
		if (parseInt(postRows[0].count) === 0) {
			await sql`
        INSERT INTO posts (title, slug, excerpt, content, image_url, category, published_at)
        VALUES
        (
          'Cómo crear una tienda online exitosa en Colombia en 2026',
          'como-crear-tienda-online-colombia',
          'Guía práctica para montar tu tienda online en Colombia: plataforma, pasarelas de pago, SEO local y los errores que matan las ventas.',
          'Crear una tienda online en Colombia es más accesible que nunca, pero la competencia también creció. En esta guía te muestro el proceso completo: elegir la plataforma adecuada, configurar pasarelas de pago como Wompi o PayU, optimizar para SEO local (Pereira, Medellín, Bogotá) y convertir visitas en ventas con copywriting y velocidad. Lo más importante no es el diseño bonito: es la velocidad de carga, la confianza que transmites y cómo te encuentran tus clientes en Google.',
          '/projects/portfolio.jpg',
          'E-commerce',
          NOW() - INTERVAL '30 days'
        ),
        (
          'Next.js 15 vs NestJS: cuál usar para tu próximo proyecto SaaS',
          'nextjs-vs-nestjs-saas',
          'Comparativa honesta entre Next.js y NestJS para construir un SaaS: frontend vs backend, rendimiento, ecosistema y cuándo combinar ambos.',
          'Muchos emprendedores me preguntan si su SaaS debe usar Next.js o NestJS. La respuesta corta: no tienen que elegir. Next.js brilla en el frontend, SSR, SEO y velocidad de desarrollo; NestJS aporta arquitectura sólida, inyección de dependencias y un backend estructurado para crecer. En este artículo exploro los trade-offs reales, costos de infraestructura en Vercel y Railway, y el patrón que uso para proyectos que necesitan lo mejor de ambos.',
          '/projects/veloce.jpg',
          'Desarrollo Web',
          NOW() - INTERVAL '20 days'
        ),
        (
          '7 señales de que tu web necesita un rediseño (y cuesta caro no hacerlo)',
          'senales-web-necesita-rediseno',
          '¿Tu web no vende? Estas son las señales técnicas y de conversión que indican que un rediseño rentable vale la pena.',
          'Una web lenta, que no aparece en Google o que no convierte no es un problema de diseño: es un problema de ingresos. En este post te doy 7 señales objetivas: tiempo de carga mayor a 3 segundos, tasa de rebote alta en mobile, mal Core Web Vitals, diseño desactualizado, sin SEO técnico, procesos manuales que se podrían automatizar y una arquitectura que no escala. Para cada señal te explico cómo diagnosticarla y qué esperar de un rediseño bien hecho.',
          '/projects/solar-system.jpg',
          'UX/UI',
          NOW() - INTERVAL '10 days'
        ),
        (
          'SEO técnico para portafolios y sitios de servicios: guía 2026',
          'seo-tecnico-portafolios',
          'Los 10 arreglos de SEO técnico que más impacto tienen en un sitio de servicios: Core Web Vitals, schema.org, sitemaps y canónicos.',
          'Si tienes un portafolio o un sitio de servicios y no aparece en Google, el problema casi nunca es el contenido: es el SEO técnico. En esta guía cubro los arreglos de mayor impacto: velocidad y Core Web Vitals (LCP bajo 2.5s), datos estructurados con schema.org (Person, ProfessionalService, FAQ), sitemap y robots.txt, canónicos, URLs limpias y enlaces internos. Todo aplicable hoy mismo sin ser experto.',
          '/projects/portfolio.jpg',
          'SEO',
          NOW() - INTERVAL '5 days'
        )
      `;
		}

		return true;
	} catch (error) {
		console.error("Error initializing database:", error);
		throw new Error(error instanceof Error ? error.message : "Error desconocido");
	}
}

export async function getProfile(): Promise<Profile | null> {
	try {
		const { rows } = await sql<Profile>`SELECT * FROM profiles ORDER BY id LIMIT 1`;
		return rows[0] || null;
	} catch (error) {
		console.error("Error fetching profile:", error);
		return null;
	}
}

export async function getProjects(): Promise<Project[]> {
	try {
		const { rows } =
			await sql<Project>`SELECT * FROM projects ORDER BY order_index ASC, id DESC`;
		return rows;
	} catch (error) {
		console.error("Error fetching projects:", error);
		return [];
	}
}

export async function getProjectById(id: number): Promise<Project | null> {
	try {
		const { rows } =
			await sql<Project>`SELECT * FROM projects WHERE id = ${id} LIMIT 1`;
		return rows[0] || null;
	} catch (error) {
		console.error("Error fetching project:", error);
		return null;
	}
}

/** Slug legible para URLs de proyectos (sin columna nueva en la DB). */
export function projectSlug(project: Pick<Project, "id" | "title">): string {
	const base = project.title
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.slice(0, 60);
	return `${base}-${project.id}`;
}

function slugify(text: string): string {
	return text
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.slice(0, 100);
}

export async function getPosts(): Promise<Post[]> {
	try {
		const { rows } = await sql<Post>`
      SELECT * FROM posts ORDER BY published_at DESC
    `;
		return rows;
	} catch (error) {
		console.error("Error fetching posts:", error);
		return [];
	}
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
	try {
		const { rows } = await sql<Post>`
      SELECT * FROM posts WHERE slug = ${slug} LIMIT 1
    `;
		return rows[0] || null;
	} catch (error) {
		console.error("Error fetching post:", error);
		return null;
	}
}

export async function getPostById(id: number): Promise<Post | null> {
	try {
		const { rows } = await sql<Post>`
      SELECT * FROM posts WHERE id = ${id} LIMIT 1
    `;
		return rows[0] || null;
	} catch (error) {
		console.error("Error fetching post by id:", error);
		return null;
	}
}

export async function createPost(input: {
	title: string;
	excerpt?: string;
	content: string;
	image_url?: string;
	category?: string;
}): Promise<Post | null> {
	try {
		const slug = slugify(input.title);
		const { rows } = await sql<Post>`
      INSERT INTO posts (title, slug, excerpt, content, image_url, category)
      VALUES (
        ${input.title},
        ${slug},
        ${input.excerpt || ""},
        ${input.content},
        ${input.image_url || "/projects/portfolio.jpg"},
        ${input.category || "Desarrollo Web"}
      )
      RETURNING *
    `;
		return rows[0] || null;
	} catch (error) {
		console.error("Error creating post:", error);
		return null;
	}
}

export async function updatePost(
	id: number,
	input: {
		title?: string;
		excerpt?: string;
		content?: string;
		image_url?: string;
		category?: string;
	},
): Promise<Post | null> {
	try {
		const current = await getPostById(id);
		if (!current) return null;
		const { rows } = await sql<Post>`
      UPDATE posts
      SET
        title = ${input.title ?? current.title},
        slug = ${input.title ? slugify(input.title) : current.slug},
        excerpt = ${input.excerpt ?? current.excerpt},
        content = ${input.content ?? current.content},
        image_url = ${input.image_url ?? current.image_url},
        category = ${input.category ?? current.category}
      WHERE id = ${id}
      RETURNING *
    `;
		return rows[0] || null;
	} catch (error) {
		console.error("Error updating post:", error);
		return null;
	}
}

export async function deletePost(id: number): Promise<boolean> {
	try {
		await sql`DELETE FROM posts WHERE id = ${id}`;
		return true;
	} catch (error) {
		console.error("Error deleting post:", error);
		return false;
	}
}
