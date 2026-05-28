import dynamic from "next/dynamic";

const Navigation = dynamic(
	() => import("@/components/navigation").then((mod) => mod.Navigation),
	{ ssr: false }
);

const Hero = dynamic(
	() => import("@/components/hero").then((mod) => mod.Hero),
	{ ssr: false }
);

const Projects = dynamic(
	() => import("@/components/projects").then((mod) => mod.Projects),
	{ ssr: false }
);

const Services = dynamic(
	() => import("@/components/services").then((mod) => mod.Services),
	{ ssr: false }
);

const About = dynamic(
	() => import("@/components/about").then((mod) => mod.About),
	{ ssr: false }
);

const Workflow = dynamic(
	() => import("@/components/workflow").then((mod) => mod.Workflow),
	{ ssr: false }
);

const TechStack = dynamic(
	() => import("@/components/tech-stack").then((mod) => mod.TechStack),
	{ ssr: false }
);

const Contact = dynamic(
	() => import("@/components/contact").then((mod) => mod.Contact),
	{ ssr: false }
);

const Footer = dynamic(
	() => import("@/components/footer").then((mod) => mod.Footer),
	{ ssr: false }
);

export default function Home() {
	return (
		<main className="min-h-screen bg-background overflow-x-hidden">
			<Navigation />
			<Hero />
			<Projects />
			<Services />
			<About />
			<Workflow />
			<TechStack />
			<Contact />
			<Footer />
		</main>
	);
}