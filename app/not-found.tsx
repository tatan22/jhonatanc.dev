import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
	return (
		<main className="min-h-[60vh] flex items-center justify-center px-6">
			<div className="max-w-md text-center flex flex-col items-center gap-4">
				<FileQuestion className="w-12 h-12 text-muted-foreground" aria-hidden />
				<h1 className="text-5xl font-bold">404</h1>
				<p className="text-muted-foreground leading-relaxed">
					La página que buscas no existe o fue movida.
				</p>
				<Link
					href="/"
					className="mt-2 inline-flex items-center px-5 py-2.5 rounded-xl bg-foreground text-background font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
				>
					Volver al inicio
				</Link>
			</div>
		</main>
	);
}
