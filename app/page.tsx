import { getProfile, getProjects } from "@/lib/db";

import { Navigation } from "@/components/navigation";
import { Hero } from "@/components/hero";
import { Projects } from "@/components/projects";
import { Services } from "@/components/services";
import { About } from "@/components/about";
import { Workflow } from "@/components/workflow";
import { TechStack } from "@/components/tech-stack";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
	// Intentamos obtener datos de la base de datos. Si falla, pasamos null/[] para usar los fallbacks.
	const profile = await getProfile().catch(() => null);
	const projects = await getProjects().catch(() => []);

	return (
		<main className="min-h-screen bg-background overflow-x-hidden">
			<Navigation />
			<Hero profile={profile} />
			<Projects initialProjects={projects && projects.length > 0 ? projects : undefined} />
			<Services />
			<About />
			<Workflow />
			<TechStack />
			<Contact />
			<Footer />
		</main>
	);
}