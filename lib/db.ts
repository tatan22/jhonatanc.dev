import { sql } from '@vercel/postgres';

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

    // Insert default profile if not exists
    const { rows } = await sql`SELECT COUNT(*) FROM profiles`;
    if (parseInt(rows[0].count) === 0) {
      await sql`
        INSERT INTO profiles (name, role, bio, image_url, location)
        VALUES ('Jhonatan Cardona Duarte', 'Front-End Developer', 'Ingeniero Físico y Desarrollador Front-End enfocado en crear interfaces modernas, experiencias intuitivas y aplicaciones web con React, Next.js y TypeScript.', '/profile.webp', '📍 Pereira, Colombia')
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
    
    return true;
  } catch (error: any) {
    console.error('Error initializing database:', error);
    throw new Error(error.message || 'Error desconocido');
  }
}

export async function getProfile(): Promise<Profile | null> {
  try {
    const { rows } = await sql<Profile>`SELECT * FROM profiles ORDER BY id LIMIT 1`;
    return rows[0] || null;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

export async function getProjects(): Promise<Project[]> {
  try {
    const { rows } = await sql<Project>`SELECT * FROM projects ORDER BY order_index ASC, id DESC`;
    return rows;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}
