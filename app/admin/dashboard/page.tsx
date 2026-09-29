"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
	Loader2,
	Plus,
	Save,
	Trash2,
	Image as ImgIcon,
	ExternalLink,
	Github,
	Search,
	AlertTriangle,
	Pencil,
	X,
	Star,
} from "lucide-react";
import { UploadButton } from "@/lib/uploadthing";
import type { Profile, Project } from "@/lib/db";
import { useToast } from "@/components/ui/use-toast";

type ProfileDraft = Partial<Profile>;
type ProjectDraft = Partial<Project> & {
	id?: number;
	isNew?: boolean;
	_key: string;
};

const TECH_OPTIONS = [
	"Next.js",
	"React",
	"TypeScript",
	"Tailwind CSS",
	"Node.js",
	"NestJS",
	"PostgreSQL",
	"Drizzle ORM",
	"Prisma",
	"Better Auth",
	"Pusher",
	"Framer Motion",
	"AI SDK",
	"shadcn/ui",
	"Vercel",
	"Docker",
];

const PROFILE_FIELDS: Array<{
	key: keyof Profile;
	label: string;
	placeholder?: string;
	type?: string;
	span?: boolean;
}> = [
	{ key: "name", label: "Nombre" },
	{ key: "role", label: "Rol / Título" },
	{ key: "location", label: "Ubicación", placeholder: "Pereira, Colombia" },
	{ key: "email", label: "Email", placeholder: "tucorreo@dominio.com" },
	{ key: "github_url", label: "GitHub URL", placeholder: "https://github.com/..." },
	{
		key: "linkedin_url",
		label: "LinkedIn URL",
		placeholder: "https://linkedin.com/in/...",
	},
];

export default function AdminDashboard() {
	const router = useRouter();
	const { toast } = useToast();

	const [profile, setProfile] = useState<ProfileDraft | null>(null);
	const [projects, setProjects] = useState<ProjectDraft[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState<Record<string, boolean>>({});
	const [searchQuery, setSearchQuery] = useState("");
	const [filterFeatured, setFilterFeatured] = useState<
		"all" | "featured" | "unfeatured"
	>("all");
	const [editingKey, setEditingKey] = useState<string | null>(null);
	const [deleteKey, setDeleteKey] = useState<string | null>(null);

	const fetchData = useCallback(async () => {
		try {
			const res = await fetch("/api/admin/data");
			if (res.status === 401) {
				router.push("/admin");
				return;
			}
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.error || "Error desconocido");
			}
			const data = await res.json();
			setProfile(data.profile || {});
			setProjects(
				(data.projects || []).map((p: Project): ProjectDraft => ({
					...p,
					_key: `p-${p.id}`,
				})),
			);
		} catch (error) {
			console.error("Error fetching data:", error);
			toast({
				title: "Error cargando datos",
				description:
					error instanceof Error ? error.message : "Error desconocido",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	}, [router, toast]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const filteredProjects = useMemo(() => {
		return projects
			.filter((p) => {
				if (filterFeatured === "featured") return p.featured;
				if (filterFeatured === "unfeatured") return !p.featured;
				return true;
			})
			.filter(
				(p) =>
					p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
					p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
					p.tech_stack?.some((t) =>
						t.toLowerCase().includes(searchQuery.toLowerCase()),
					),
			)
			.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
	}, [projects, searchQuery, filterFeatured]);

	const patchProject = useCallback((key: string, patch: Partial<ProjectDraft>) => {
		setProjects((prev) =>
			prev.map((p) => (p._key === key ? { ...p, ...patch } : p)),
		);
	}, []);

	const handleSaveProfile = async () => {
		setIsSaving((prev) => ({ ...prev, profile: true }));
		try {
			const res = await fetch("/api/admin/data?type=profile", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(profile),
			});
			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.error || "Error guardando");
			}
			toast({
				title: "Perfil guardado",
				description: "Cambios aplicados correctamente",
			});
		} catch (error) {
			toast({
				title: "Error guardando perfil",
				description: error instanceof Error ? error.message : "",
				variant: "destructive",
			});
		} finally {
			setIsSaving((prev) => ({ ...prev, profile: false }));
		}
	};

	const handleSaveProject = async (project: ProjectDraft) => {
		const key = project._key;
		setIsSaving((prev) => ({ ...prev, [key]: true }));
		try {
			const isNew = !project.id || project.isNew;
			const payload = {
				id: project.id,
				title: project.title || "",
				description: project.description || "",
				image_url: project.image_url || "",
				tech_stack: project.tech_stack || [],
				live_url: project.live_url || "",
				github_url: project.github_url || "",
				featured: project.featured || false,
				order_index: project.order_index || 0,
			};
			const res = await fetch(`/api/admin/data?type=project`, {
				method: isNew ? "POST" : "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.error || "Error guardando");
			}
			toast({ title: isNew ? "Proyecto creado" : "Proyecto actualizado" });
			setEditingKey(null);
			fetchData();
		} catch (error) {
			toast({
				title: "Error guardando proyecto",
				description: error instanceof Error ? error.message : "",
				variant: "destructive",
			});
		} finally {
			setIsSaving((prev) => ({ ...prev, [key]: false }));
		}
	};

	const handleDeleteProject = async (project: ProjectDraft) => {
		setDeleteKey(null);
		setIsSaving((prev) => ({ ...prev, [`delete-${project._key}`]: true }));
		try {
			const res = await fetch(`/api/admin/data?type=project&id=${project.id}`, {
				method: "DELETE",
			});
			if (!res.ok) throw new Error("Error eliminando");
			setProjects((prev) => prev.filter((p) => p._key !== project._key));
			toast({ title: "Proyecto eliminado" });
		} catch {
			toast({ title: "Error borrando proyecto", variant: "destructive" });
		} finally {
			setIsSaving((prev) => ({ ...prev, [`delete-${project._key}`]: false }));
		}
	};

	const handleAddProject = () => {
		const key = `new-${Date.now()}`;
		const newProject: ProjectDraft = {
			_key: key,
			title: "",
			description: "",
			image_url: "",
			tech_stack: [],
			live_url: "",
			github_url: "",
			featured: false,
			order_index: projects.length,
			isNew: true,
		};
		setProjects((prev) => [newProject, ...prev]);
		setEditingKey(key);
	};

	const handleCancelEdit = (project: ProjectDraft) => {
		if (project.isNew && !project.id) {
			setProjects((prev) => prev.filter((p) => p._key !== project._key));
		}
		setEditingKey(null);
	};

	const handleUploaded =
		(key: string) => (res: { url: string; ufsUrl?: string }[]) => {
			if (res && res[0]) {
				patchProject(key, { image_url: res[0].ufsUrl || res[0].url });
				toast({ title: "Imagen subida", description: "URL actualizada" });
			}
		};

	const uploadError = (err: Error) => {
		toast({
			title: "Error subiendo imagen",
			description: err.message,
			variant: "destructive",
		});
	};

	if (isLoading) {
		return (
			<div className="pb-16">
				<div className="mb-8 h-8 w-40 animate-pulse rounded-lg bg-secondary/40" />
				<div className="h-72 animate-pulse rounded-2xl bg-secondary/30" />
			</div>
		);
	}

	return (
		<div className="pb-4">
			<div className="mb-8">
				<h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
				<p className="text-sm text-muted-foreground">
					Gestiona tu perfil y proyectos del portafolio
				</p>
			</div>

			{/* Perfil */}
			<section className="mb-12">
				<div className="mb-5 flex items-center gap-3">
					<h2 className="text-lg font-semibold">Tu perfil</h2>
					<span className="text-sm text-muted-foreground">
						Datos que se muestran en la portada
					</span>
				</div>

				<div className="grid gap-6 rounded-2xl border border-border/40 bg-card/40 p-6 lg:grid-cols-[220px_1fr]">
					{/* Avatar */}
					<div className="flex flex-col gap-3">
						<div
							role="img"
							aria-label="Vista previa de la foto de perfil"
							className="aspect-square w-full max-w-[220px] rounded-2xl border border-border/40 bg-secondary/40 bg-cover bg-center"
							style={{
								backgroundImage: profile?.image_url
									? `url(${profile.image_url})`
									: "none",
							}}
						>
							{!profile?.image_url && (
								<div className="flex h-full items-center justify-center text-muted-foreground">
									<ImgIcon className="h-8 w-8" />
								</div>
							)}
						</div>
						<UploadButton
							endpoint="imageUploader"
							content={{
								button: "Subir foto",
								allowedContent: "JPG, PNG · máx. 4MB",
							}}
							onClientUploadComplete={(res) => {
								if (res && res[0]) {
									setProfile((prev) => ({
										...prev,
										image_url: res[0].ufsUrl || res[0].url,
									}));
									toast({
										title: "Imagen subida",
										description: "No olvides guardar",
									});
								}
							}}
							onUploadError={uploadError}
						/>
					</div>

					{/* Campos */}
					<div className="grid content-start gap-4 sm:grid-cols-2">
						{PROFILE_FIELDS.map((field) => (
							<div key={field.key}>
								<label
									htmlFor={`profile-${field.key}`}
									className="mb-1.5 block text-sm text-muted-foreground"
								>
									{field.label}
								</label>
								<input
									id={`profile-${field.key}`}
									type={field.type || "text"}
									value={(profile?.[field.key] as string) || ""}
									placeholder={field.placeholder}
									onChange={(e) =>
										setProfile((prev) => ({
											...prev,
											[field.key]: e.target.value,
										}))
									}
									className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
								/>
							</div>
						))}
						<div className="sm:col-span-2">
							<label
								htmlFor="profile-bio"
								className="mb-1.5 block text-sm text-muted-foreground"
							>
								Bio
							</label>
							<textarea
								id="profile-bio"
								rows={3}
								value={profile?.bio || ""}
								placeholder="Una o dos frases sobre lo que haces y para quién."
								onChange={(e) =>
									setProfile((prev) => ({
										...prev,
										bio: e.target.value,
									}))
								}
								className="w-full resize-none rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
							/>
						</div>
					</div>

					{/* Barra de acciones del perfil */}
					<div className="flex flex-col-reverse items-stretch gap-3 border-t border-border/40 pt-5 sm:flex-row sm:items-center sm:justify-between lg:col-span-2">
						<p className="text-xs text-muted-foreground">
							Los cambios se publican al guardar.
						</p>
						<button
							onClick={handleSaveProfile}
							disabled={isSaving.profile}
							className="inline-flex items-center justify-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:opacity-50"
						>
							{isSaving.profile ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<Save className="h-4 w-4" />
							)}
							{isSaving.profile ? "Guardando..." : "Guardar cambios"}
						</button>
					</div>
				</div>
			</section>

			{/* Proyectos */}
			<section>
				<div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
					<div className="flex items-center gap-3">
						<h2 className="text-lg font-semibold">Proyectos</h2>
						<span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
							{filteredProjects.length} / {projects.length}
						</span>
					</div>
					<div className="flex flex-wrap items-center gap-2">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<input
								type="text"
								placeholder="Buscar proyectos..."
								aria-label="Buscar proyectos"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent sm:w-60"
							/>
						</div>
						<select
							aria-label="Filtrar por destacados"
							value={filterFeatured}
							onChange={(e) =>
								setFilterFeatured(
									e.target.value as typeof filterFeatured,
								)
							}
							className="rounded-lg border border-border bg-background px-3 py-2 text-sm transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
						>
							<option value="all">Todos</option>
							<option value="featured">Destacados</option>
							<option value="unfeatured">Normales</option>
						</select>
						<button
							onClick={handleAddProject}
							className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
						>
							<Plus className="h-4 w-4" aria-hidden />
							Añadir
						</button>
					</div>
				</div>

				{filteredProjects.length === 0 ? (
					<div className="rounded-2xl border border-dashed border-border/60 py-16 text-center">
						<ImgIcon className="mx-auto mb-4 h-10 w-10 text-muted-foreground/50" />
						<h3 className="mb-1 font-medium">
							{searchQuery || filterFeatured !== "all"
								? "Sin resultados"
								: "Aún no hay proyectos"}
						</h3>
						<p className="mb-5 text-sm text-muted-foreground">
							{searchQuery || filterFeatured !== "all"
								? "Prueba con otro término o cambia el filtro."
								: "Crea tu primer proyecto para mostrarlo en el portafolio."}
						</p>
						<button
							onClick={handleAddProject}
							className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm transition-colors hover:bg-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
						>
							<Plus className="h-4 w-4" aria-hidden />
							Añadir proyecto
						</button>
					</div>
				) : (
					<div className="space-y-3">
						{filteredProjects.map((project) => {
							const isEditing = editingKey === project._key;
							const isSavingProject = isSaving[project._key];
							const isDeleting = isSaving[`delete-${project._key}`];

							return (
								<article
									key={project._key}
									className={`overflow-hidden rounded-2xl border bg-card/40 transition-colors ${
										isEditing
											? "border-accent/50"
											: "border-border/40"
									}`}
								>
									{/* Fila resumen */}
									<div className="flex items-center gap-4 p-4">
										<div
											role="img"
											aria-label={`Miniatura de ${project.title || "proyecto"}`}
											className="h-12 w-12 shrink-0 rounded-xl border border-border/40 bg-secondary/40 bg-cover bg-center"
											style={{
												backgroundImage: project.image_url
													? `url(${project.image_url})`
													: "none",
											}}
										>
											{!project.image_url && (
												<div className="flex h-full items-center justify-center text-muted-foreground">
													<ImgIcon className="h-4 w-4" />
												</div>
											)}
										</div>

										<div className="min-w-0 flex-1">
											<div className="flex items-center gap-2">
												<h3 className="truncate font-medium">
													{project.title ||
														"Proyecto sin título"}
												</h3>
												{project.isNew && (
													<span className="shrink-0 rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">
														Nuevo
													</span>
												)}
												{project.featured && (
													<span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs text-amber-500">
														<Star className="h-3 w-3 fill-current" />
														Destacado
													</span>
												)}
											</div>
											{project.description && (
												<p className="mt-0.5 truncate text-sm text-muted-foreground">
													{project.description}
												</p>
											)}
										</div>

										<div className="flex shrink-0 items-center gap-1">
											{project.live_url && (
												<a
													href={project.live_url}
													target="_blank"
													rel="noopener noreferrer"
													aria-label={`Ver demo de ${project.title || "este proyecto"}`}
													className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
												>
													<ExternalLink
														className="h-4 w-4"
														aria-hidden
													/>
												</a>
											)}
											{project.github_url && (
												<a
													href={project.github_url}
													target="_blank"
													rel="noopener noreferrer"
													aria-label={`Ver código de ${project.title || "este proyecto"}`}
													className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
												>
													<Github
														className="h-4 w-4"
														aria-hidden
													/>
												</a>
											)}
											<button
												onClick={() =>
													setEditingKey(
														isEditing ? null : project._key,
													)
												}
												aria-label={
													isEditing
														? "Cerrar editor"
														: `Editar ${project.title || "proyecto"}`
												}
												title={
													isEditing
														? "Cerrar editor"
														: "Editar"
												}
												className={`rounded-lg p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 ${
													isEditing
														? "bg-accent/10 text-accent"
														: "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
												}`}
											>
												{isEditing ? (
													<X
														className="h-4 w-4"
														aria-hidden
													/>
												) : (
													<Pencil
														className="h-4 w-4"
														aria-hidden
													/>
												)}
											</button>
											<button
												onClick={() =>
													setDeleteKey(project._key)
												}
												disabled={!project.id || isDeleting}
												aria-label={`Eliminar ${project.title || "proyecto"}`}
												title="Eliminar"
												className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:opacity-40"
											>
												<Trash2
													className="h-4 w-4"
													aria-hidden
												/>
											</button>
										</div>
									</div>

									{/* Editor */}
									{isEditing && (
										<div className="border-t border-border/40 bg-secondary/20 p-5 sm:p-6">
											<div className="grid gap-6 lg:grid-cols-[260px_1fr]">
												{/* Columna de imagen */}
												<div className="flex flex-col gap-3">
													<div
														role="img"
														aria-label="Vista previa de la imagen del proyecto"
														className="aspect-video w-full rounded-xl border border-border/40 bg-background bg-cover bg-center"
														style={{
															backgroundImage:
																project.image_url
																	? `url(${project.image_url})`
																	: "none",
														}}
													>
														{!project.image_url && (
															<div className="flex h-full items-center justify-center text-muted-foreground">
																<ImgIcon className="h-6 w-6" />
															</div>
														)}
													</div>
													<UploadButton
														endpoint="imageUploader"
														content={{
															button: "Subir imagen",
															allowedContent:
																"JPG, PNG · máx. 4MB",
														}}
														onClientUploadComplete={handleUploaded(
															project._key,
														)}
														onUploadError={uploadError}
													/>
													<input
														type="text"
														aria-label="URL de la imagen"
														value={project.image_url || ""}
														placeholder="o pega una URL..."
														onChange={(e) =>
															patchProject(project._key, {
																image_url:
																	e.target.value,
															})
														}
														className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
													/>
												</div>

												{/* Columna de campos */}
												<div className="grid content-start gap-4 sm:grid-cols-2">
													<div className="sm:col-span-2">
														<label className="mb-1.5 block text-sm text-muted-foreground">
															Título
														</label>
														<input
															type="text"
															aria-label="Título del proyecto"
															value={project.title || ""}
															placeholder="Nombre del proyecto"
															onChange={(e) =>
																patchProject(
																	project._key,
																	{
																		title: e.target
																			.value,
																	},
																)
															}
															className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
														/>
													</div>

													<div className="sm:col-span-2">
														<label className="mb-1.5 block text-sm text-muted-foreground">
															Descripción
														</label>
														<textarea
															rows={3}
															aria-label="Descripción del proyecto"
															value={
																project.description ||
																""
															}
															placeholder="Qué es, para quién y qué resuelve."
															onChange={(e) =>
																patchProject(
																	project._key,
																	{
																		description:
																			e.target
																				.value,
																	},
																)
															}
															className="w-full resize-none rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
														/>
													</div>

													<div>
														<label className="mb-1.5 block text-sm text-muted-foreground">
															Demo URL
														</label>
														<input
															type="text"
															aria-label="URL de la demo"
															value={
																project.live_url || ""
															}
															placeholder="https://..."
															onChange={(e) =>
																patchProject(
																	project._key,
																	{
																		live_url:
																			e.target
																				.value,
																	},
																)
															}
															className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
														/>
													</div>

													<div>
														<label className="mb-1.5 block text-sm text-muted-foreground">
															GitHub URL
														</label>
														<input
															type="text"
															aria-label="URL del repositorio en GitHub"
															value={
																project.github_url || ""
															}
															placeholder="https://github.com/..."
															onChange={(e) =>
																patchProject(
																	project._key,
																	{
																		github_url:
																			e.target
																				.value,
																	},
																)
															}
															className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
														/>
													</div>

													<div>
														<label className="mb-1.5 block text-sm text-muted-foreground">
															Orden
														</label>
														<input
															type="number"
															min={0}
															aria-label="Orden del proyecto"
															value={
																project.order_index || 0
															}
															onChange={(e) =>
																patchProject(
																	project._key,
																	{
																		order_index:
																			parseInt(
																				e.target
																					.value,
																				10,
																			) || 0,
																	},
																)
															}
															className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
														/>
													</div>

													<div className="flex items-end">
														<label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm">
															<input
																type="checkbox"
																checked={
																	project.featured ||
																	false
																}
																onChange={(e) =>
																	patchProject(
																		project._key,
																		{
																			featured:
																				e.target
																					.checked,
																		},
																	)
																}
																className="h-4 w-4 accent-accent"
															/>
															Destacado
														</label>
													</div>

													<div className="sm:col-span-2">
														<label className="mb-1.5 block text-sm text-muted-foreground">
															Tecnologías
														</label>
														<div className="mb-2 flex flex-wrap gap-2">
															{TECH_OPTIONS.map(
																(tech) => {
																	const active =
																		project.tech_stack?.includes(
																			tech,
																		);
																	return (
																		<button
																			key={tech}
																			type="button"
																			aria-pressed={
																				!!active
																			}
																			onClick={() => {
																				const stack =
																					project.tech_stack ||
																					[];
																				patchProject(
																					project._key,
																					{
																						tech_stack:
																							active
																								? stack.filter(
																										(
																											t,
																										) =>
																											t !==
																											tech,
																									)
																								: [
																										...stack,
																										tech,
																									],
																					},
																				);
																			}}
																			className={`rounded-full border px-3 py-1 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 ${
																				active
																					? "border-accent bg-accent text-accent-foreground"
																					: "border-border bg-background hover:border-accent/50"
																			}`}
																		>
																			{tech}
																		</button>
																	);
																},
															)}
														</div>
														<input
															type="text"
															aria-label="Tecnologías separadas por coma"
															value={
																project.tech_stack?.join(
																	", ",
																) || ""
															}
															placeholder="O escríbelas separadas por coma"
															onChange={(e) =>
																patchProject(
																	project._key,
																	{
																		tech_stack:
																			e.target.value
																				.split(
																					",",
																				)
																				.map(
																					(
																						t,
																					) =>
																						t.trim(),
																				)
																				.filter(
																					Boolean,
																				),
																	},
																)
															}
															className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
														/>
													</div>
												</div>
											</div>

											{/* Acciones del editor */}
											<div className="mt-6 flex items-center justify-end gap-3 border-t border-border/40 pt-5">
												<button
													onClick={() =>
														handleCancelEdit(project)
													}
													className="rounded-lg border border-border px-4 py-2 text-sm transition-colors hover:bg-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
												>
													Cancelar
												</button>
												<button
													onClick={() =>
														handleSaveProject(project)
													}
													disabled={isSavingProject}
													className="inline-flex items-center gap-2 rounded-lg bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:opacity-50"
												>
													{isSavingProject ? (
														<Loader2 className="h-4 w-4 animate-spin" />
													) : (
														<Save className="h-4 w-4" />
													)}
													{isSavingProject
														? "Guardando..."
														: project.isNew
															? "Crear proyecto"
															: "Guardar cambios"}
												</button>
											</div>
										</div>
									)}

									{/* Confirmación de borrado */}
									{deleteKey === project._key && (
										<div className="flex flex-col gap-3 border-t border-destructive/20 bg-destructive/10 p-4 sm:flex-row sm:items-center sm:justify-between">
											<div className="flex items-center gap-3">
												<AlertTriangle className="h-5 w-5 shrink-0 text-destructive" />
												<div>
													<p className="text-sm font-medium">
														{`¿Eliminar "${project.title || "este proyecto"}"?`}
													</p>
													<p className="text-xs text-muted-foreground">
														Esta acción no se puede
														deshacer.
													</p>
												</div>
											</div>
											<div className="flex justify-end gap-2">
												<button
													onClick={() => setDeleteKey(null)}
													className="rounded-lg border border-border px-4 py-2 text-sm transition-colors hover:bg-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
												>
													Cancelar
												</button>
												<button
													onClick={() =>
														handleDeleteProject(project)
													}
													disabled={isDeleting}
													className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:opacity-50"
												>
													{isDeleting
														? "Eliminando..."
														: "Sí, eliminar"}
												</button>
											</div>
										</div>
									)}
								</article>
							);
						})}
					</div>
				)}
			</section>
		</div>
	);
}
