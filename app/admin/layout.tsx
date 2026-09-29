import { ReactNode } from "react";
import { AdminHeader } from "@/components/admin/admin-header";

export default function AdminLayout({ children }: { children: ReactNode }) {
	return (
		<div className="min-h-screen bg-background text-foreground">
			<AdminHeader />
			<main className="mx-auto max-w-6xl px-6 py-12">{children}</main>
		</div>
	);
}
