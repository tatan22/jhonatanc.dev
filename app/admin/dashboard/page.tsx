"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
	Loader2,
	Plus,
	Save,
	Trash2,
	LogOut,
	Image as ImgIcon,
	ExternalLink,
	Github,
	Check,
	Search,
	Filter,
	Copy,
	AlertTriangle,
	Settings,
	X,
} from "lucide-react";
import { UploadButton } from "@/lib/uploadthing";
import type { Profile, Project } from "@/lib/db";
import { useToast } from "@/components/ui/use-toast";

type ProfileDraft = Partial<Profile>;
type ProjectDraft = Partial<Project> & { id?: number; isNew?: boolean };

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
	"Framer Motion",
	"AI SDK",
	"shadcn/ui",
	"Vercel",
	"Docker",
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
	const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
	const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

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
			setProjects(data.projects || []);
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
		const key = project.id?.toString() || "new";
		setIsSaving((prev) => ({ ...prev, [key]: true }));
		try {
			const isNew = !project.id || project.isNew;
			const res = await fetch(`/api/admin/data?type=project`, {
				method: isNew ? "POST" : "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(project),
			});
			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.error || "Error guardando");
			}
			toast({ title: isNew ? "Proyecto creado" : "Proyecto actualizado" });
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

	const handleDeleteProject = async (id: number) => {
		setDeleteConfirmId(null);
		setIsSaving((prev) => ({ ...prev, [`delete-${id}`]: true }));
		try {
			await fetch(`/api/admin/data?type=project&id=${id}`, { method: "DELETE" });
			setProjects((prev) => prev.filter((p) => p.id !== id));
			toast({ title: "Proyecto eliminado" });
		} catch {
			toast({ title: "Error borrando proyecto", variant: "destructive" });
		} finally {
			setIsSaving((prev) => ({ ...prev, [`delete-${id}`]: false }));
		}
	};

	const handleAddProject = () => {
		const newProject: ProjectDraft = {
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
		setEditingProjectId(Date.now());
	};

	const handleImageUpload =
		(setter: (url: string) => void) => (res: { url: string }[]) => {
			if (res && res[0]) {
				setter(res[0].url);
				toast({
					title: "Imagen subida",
					description: "URL actualizada automáticamente",
				});
			}
		};

	const handleImageError = (err: Error) => {
		toast({
			title: "Error subiendo imagen",
			description: err.message,
			variant: "destructive",
		});
	};

	const copyToClipboard = (text: string, label: string) => {
		navigator.clipboard.writeText(text);
		toast({ title: `${label} copiado` });
	};

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-64">
				<Loader2 className="w-8 h-8 animate-spin text-accent" />
			</div>
		);
	}

	// Render projects list separately to avoid ternary nesting issues
	const renderProjects = () => {
		if (filteredProjects.length === 0) {
			return (
				<div className="text-center py-12 bg-card/40 border border-border/40 rounded-2xl">
					<Plus className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
					<h3 className="text-lg font-medium mb-2">No hay proyectos</h3>
					<p className="text-muted-foreground mb-4">
						{searchQuery || filterFeatured !== "all"
							? "No hay proyectos que coincidan con tu búsqueda"
							: "Crea tu primer proyecto para empezar"}
					</p>
					<button
						onClick={handleAddProject}
						className="px-6 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/80 transition-colors"
					>
						<Plus className="w-4 h-4 inline mr-2" />
						Crear proyecto
					</button>
				</div>
			);
		}

		return (
			<div className="space-y-4">
				{filteredProjects.map((project, index) => {
					const projectKey = project.id?.toString() || `new-${index}`;
					const isEditing = editingProjectId === (project.id || index);
					const projectIsSaving =
						isSaving[projectKey] || isSaving[`delete-${project.id}`];
					const isDeleting = isSaving[`delete-${project.id}`];

					return (
						<div
							key={projectKey}
							className={`bg-card/40 border border-border/40 rounded-2xl overflow-hidden transition-all ${
								isEditing ? "ring-2 ring-accent/50" : ""
							}`}
						>
							<div className="p-4 border-b border-border/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
								<div className="flex items-center gap-3 flex-1 min-w-0">
									<div
										className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0"
										style={{
											backgroundImage: project.image_url
												? `url(${project.image_url})`
												: "none",
											backgroundSize: "cover",
											backgroundPosition: "center",
										}}
									>
										{!project.image_url && (
											<ImgIcon className="w-5 h-5 text-accent" />
										)}
									</div>
									<div className="min-w-0">
										<input
											type="text"
											value={project.title || ""}
											onChange={(e) => {
												setProjects((prev) => {
													const next = [...prev];
													const i = prev.findIndex(
														(p) =>
															p.id === project.id ||
															(p.isNew &&
																prev.indexOf(p) ===
																	index),
													);
													if (i >= 0)
														next[i] = {
															...next[i],
															title: e.target.value,
														};
													return next;
												});
											}}
											className={`font-medium text-lg bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-accent rounded px-1 ${!project.title ? "text-muted-foreground placeholder:text-muted-foreground/50" : ""}`}
											placeholder="Título del proyecto..."
											disabled={!isEditing}
										/>
										<div className="flex items-center gap-2 text-xs text-muted-foreground">
											{project.id && (
												<span className="px-2 py-0.5 bg-secondary/50 rounded-full font-mono">
													ID: {project.id}
												</span>
											)}
											{project.isNew && (
												<span className="px-2 py-0.5 bg-accent/10 text-accent rounded-full">
													Nuevo
												</span>
											)}
											{project.featured && (
												<span className="px-2 py-0.5 bg-amber/10 text-amber rounded-full flex items-center gap-1">
													<span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
													Destacado
												</span>
											)}
										</div>
									</div>
								</div>
								<div className="flex items-center gap-2">
									{project.id && project.live_url && (
										<a
											href={project.live_url}
											target="_blank"
											rel="noopener noreferrer"
											className="p-2 text-muted-foreground hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
											title="Ver demo"
										>
											<ExternalLink className="w-4 h-4" />
										</a>
									)}
									{project.id && project.github_url && (
										<a
											href={project.github_url}
											target="_blank"
											rel="noopener noreferrer"
											className="p-2 text-muted-foreground hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
											title="Ver código"
										>
											<Github className="w-4 h-4" />
										</a>
									)}
									<button
										onClick={() =>
											setEditingProjectId(project.id || index)
										}
										className={`p-2 rounded-lg transition-colors ${isEditing ? "bg-accent/10 text-accent" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}`}
										title={
											isEditing ? "Terminar edición" : "Editar"
										}
									>
										{isEditing ? (
											<Check className="w-4 h-4" />
										) : (
											<Settings className="w-4 h-4" />
										)}
									</button>
									<button
										onClick={() => setDeleteConfirmId(project.id!)}
										disabled={!project.id || isDeleting}
										className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50"
										title="Eliminar"
									>
										<Trash2 className="w-4 h-4" />
									</button>
								</div>
							</div>

							{isEditing && (
								<div className="p-4 bg-secondary/30 border-t border-border/40 animate-in fade-in slide-in-from-top-2 duration-200">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
										<div>
											<label className="block text-sm mb-2 text-muted-foreground">
												URL Imagen
											</label>
											<div className="flex gap-2">
												<input
													type="text"
													value={project.image_url || ""}
													onChange={(e) => {
														setProjects((prev) => {
															const next = [...prev];
															const i = prev.findIndex(
																(p) =>
																	p.id ===
																		project.id ||
																	(p.isNew &&
																		prev.indexOf(
																			p,
																		) === index),
															);
															if (i >= 0)
																next[i] = {
																	...next[i],
																	image_url:
																		e.target.value,
																};
															return next;
														});
													}}
													className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent text-sm"
													placeholder="https://..."
												/>
												<UploadButton
													endpoint="imageUploader"
													onClientUploadComplete={(res) => {
														if (res && res[0]) {
															setProjects((prev) => {
																const next = [...prev];
																const i =
																	next.findIndex(
																		(p) =>
																			p.id ===
																				project.id ||
																			(p.isNew &&
																				prev.indexOf(
																					p,
																				) ===
																					index),
																	);
																if (i >= 0)
																	next[i] = {
																		...next[i],
																		image_url:
																			res[0].url,
																	};
																return next;
															});
															toast({
																title: "Imagen subida",
																description:
																	"URL actualizada automáticamente",
															});
														}
													}}
													onUploadError={(err) => {
														toast({
															title: "Error subiendo imagen",
															description: err.message,
															variant: "destructive",
														});
													}}
												/>
											</div>
										</div>
										<div>
											<label className="block text-sm mb-2 text-muted-foreground">
												URL Demo
											</label>
											<div className="flex gap-2">
												<input
													type="text"
													value={project.live_url || ""}
													onChange={(e) => {
														setProjects((prev) => {
															const next = [...prev];
															const i = prev.findIndex(
																(p) =>
																	p.id ===
																		project.id ||
																	(p.isNew &&
																		prev.indexOf(
																			p,
																		) === index),
															);
															if (i >= 0)
																next[i] = {
																	...next[i],
																	live_url:
																		e.target.value,
																};
															return next;
														});
													}}
													className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent text-sm"
													placeholder="https://demo.com"
												/>
												{project.live_url && (
													<button
														onClick={() =>
															navigator.clipboard
																.writeText(
																	project.live_url!,
																)
																.then(() =>
																	toast({
																		title: "Demo URL copiada",
																	}),
																)
														}
														className="p-2 text-muted-foreground hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
														title="Copiar URL"
													>
														<Copy className="w-4 h-4" />
													</button>
												)}
											</div>
										</div>
										<div className="md:col-span-2">
											<label className="block text-sm mb-2 text-muted-foreground">
												Descripción
											</label>
											<textarea
												value={project.description || ""}
												onChange={(e) => {
													setProjects((prev) => {
														const next = [...prev];
														const i = prev.findIndex(
															(p) =>
																p.id === project.id ||
																(p.isNew &&
																	prev.indexOf(p) ===
																		index),
														);
														if (i >= 0)
															next[i] = {
																...next[i],
																description:
																	e.target.value,
															};
														return next;
													});
												}}
												rows={2}
												className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent text-sm resize-none"
											/>
										</div>
										<div className="md:col-span-2">
											<label className="block text-sm mb-2 text-muted-foreground">
												Tecnologías
											</label>
											<div className="flex flex-wrap gap-2 mb-2">
												{TECH_OPTIONS.map((tech) => (
													<button
														key={tech}
														type="button"
														onClick={() => {
															setProjects((prev) => {
																const next = [...prev];
																const i =
																	prev.findIndex(
																		(p) =>
																			p.id ===
																				project.id ||
																			(p.isNew &&
																				prev.indexOf(
																					p,
																				) ===
																					index),
																	);
																if (i >= 0) {
																	const stack =
																		next[i]
																			.tech_stack ||
																		[];
																	next[i] = {
																		...next[i],
																		tech_stack:
																			stack.includes(
																				tech,
																			)
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
																	};
																}
																return next;
															});
														}}
														className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
															project.tech_stack?.includes(
																tech,
															)
																? "bg-accent text-accent-foreground border-accent"
																: "bg-background border-border hover:border-accent/50"
														}`}
													>
														{tech}
													</button>
												))}
											</div>
											<input
												type="text"
												value={
													project.tech_stack?.join(", ") || ""
												}
												onChange={(e) => {
													setProjects((prev) => {
														const next = [...prev];
														const i = prev.findIndex(
															(p) =>
																p.id === project.id ||
																(p.isNew &&
																	prev.indexOf(p) ===
																		index),
														);
														if (i >= 0) {
															next[i] = {
																...next[i],
																tech_stack:
																	e.target.value
																		.split(",")
																		.map((t) =>
																			t.trim(),
																		)
																		.filter(
																			Boolean,
																		),
															};
														}
														return next;
													});
												}}
												className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent text-sm"
												placeholder="O escribe tecnologías separadas por coma"
											/>
										</div>
										<div>
											<label className="block text-sm mb-2 text-muted-foreground">
												GitHub URL
											</label>
											<div className="flex gap-2">
												<input
													type="text"
													value={project.github_url || ""}
													onChange={(e) => {
														setProjects((prev) => {
															const next = [...prev];
															const i = prev.findIndex(
																(p) =>
																	p.id ===
																		project.id ||
																	(p.isNew &&
																		prev.indexOf(
																			p,
																		) === index),
															);
															if (i >= 0)
																next[i] = {
																	...next[i],
																	github_url:
																		e.target.value,
																};
															return next;
														});
													}}
													className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent text-sm"
													placeholder="https://github.com/..."
												/>
												{project.github_url && (
													<button
														onClick={() =>
															navigator.clipboard
																.writeText(
																	project.github_url!,
																)
																.then(() =>
																	toast({
																		title: "GitHub URL copiada",
																	}),
																)
														}
														className="p-2 text-muted-foreground hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
														title="Copiar URL"
													>
														<Copy className="w-4 h-4" />
													</button>
												)}
											</div>
										</div>
										<div>
											<label className="block text-sm mb-2 text-muted-foreground">
												Orden
											</label>
											<input
												type="number"
												value={project.order_index || 0}
												onChange={(e) => {
													setProjects((prev) => {
														const next = [...prev];
														const i = prev.findIndex(
															(p) =>
																p.id === project.id ||
																(p.isNew &&
																	prev.indexOf(p) ===
																		index),
														);
														if (i >= 0)
															next[i] = {
																...next[i],
																order_index:
																	parseInt(
																		e.target.value,
																	) || 0,
															};
														return next;
													});
												}}
												className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent text-sm"
												min="0"
											/>
										</div>
										<div className="flex items-center gap-3">
											<label className="flex items-center gap-2 cursor-pointer flex-1">
												<input
													type="checkbox"
													checked={project.featured || false}
													onChange={(e) => {
														setProjects((prev) => {
															const next = [...prev];
															const i = prev.findIndex(
																(p) =>
																	p.id ===
																		project.id ||
																	(p.isNew &&
																		prev.indexOf(
																			p,
																		) === index),
															);
															if (i >= 0)
																next[i] = {
																	...next[i],
																	featured:
																		e.target
																			.checked,
																};
															return next;
														});
													}}
													className="w-4 h-4 rounded accent-accent"
												/>
												<span className="text-sm font-medium">
													Proyecto Destacado
												</span>
											</label>
										</div>
									</div>
									<div className="flex justify-end gap-3 pt-4 border-t border-border/40">
										<button
											onClick={() => setEditingProjectId(null)}
											className="px-4 py-2 border border-border rounded-lg hover:bg-secondary/50 transition-colors text-sm"
										>
											Cancelar
										</button>
										<button
											onClick={() => handleSaveProject(project)}
											disabled={
												isSaving[projectKey] ||
												isSaving[`delete-${project.id}`]
											}
											className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors text-sm disabled:opacity-50"
										>
											<Save className="w-4 h-4" />
											{isSaving[projectKey] ||
											isSaving[`delete-${project.id}`]
												? "Guardando..."
												: project.isNew
													? "Crear proyecto"
													: "Guardar cambios"}
										</button>
									</div>
								</div>
							)}

							{deleteConfirmId === project.id && (
								<div className="p-4 bg-destructive/10 border-t border-destructive/20 animate-in fade-in slide-in-from-top-2 duration-200">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<AlertTriangle className="w-5 h-5 text-destructive" />
											<div>
												<p className="font-medium">{`¿Eliminar "${project.title || "este proyecto"}"?`}</p>
												<p className="text-sm text-muted-foreground">
													Esta acción no se puede deshacer.
												</p>
											</div>
										</div>
										<div className="flex gap-2">
											<button
												onClick={() => setDeleteConfirmId(null)}
												className="px-4 py-2 border border-border rounded-lg hover:bg-secondary/50 transition-colors text-sm"
											>
												Cancelar
											</button>
											<button
												onClick={() =>
													handleDeleteProject(project.id!)
												}
												disabled={
													isSaving[`delete-${project.id}`]
												}
												className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/80 transition-colors text-sm disabled:opacity-50"
											>
												{isSaving[`delete-${project.id}`]
													? "Eliminando..."
													: "Sí, eliminar"}
											</button>
										</div>
									</div>
								</div>
							)}
						</div>
					);
				})}
			</div>
		);
	};

	return (
		<div className="space-y-8 max-w-7xl mx-auto px-4 pb-12">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
					<p className="text-muted-foreground text-sm mt-1">
						Gestiona tu perfil y proyectos del portafolio
					</p>
				</div>
				<div className="flex items-center gap-3">
					<button
						onClick={() => router.push("/")}
						className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-secondary/50 transition-colors text-sm"
					>
						<ExternalLink className="w-4 h-4" />
						Ver sitio
					</button>
					<button
						onClick={async () => {
							await fetch("/api/admin/logout", { method: "POST" });
							router.push("/admin");
						}}
						className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors text-sm"
					>
						<LogOut className="w-4 h-4" />
						Salir
					</button>
				</div>
			</div>

			<section className="bg-card/40 border border-border/40 rounded-2xl p-6 backdrop-blur-xl">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
					<h2 className="text-xl font-semibold flex items-center gap-2">
						<span className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
							<ImgIcon className="w-4 h-4" />
						</span>
						Tu Perfil
					</h2>
					<button
						onClick={async () => {
							setIsSaving((prev) => ({ ...prev, profile: true }));
							try {
								const res = await fetch(
									"/api/admin/data?type=profile",
									{
										method: "PUT",
										headers: { "Content-Type": "application/json" },
										body: JSON.stringify(profile),
									},
								);
								if (!res.ok) {
									const errorData = await res.json();
									throw new Error(
										errorData.error || "Error guardando",
									);
								}
								toast({
									title: "Perfil guardado",
									description: "Cambios aplicados correctamente",
								});
							} catch (error) {
								toast({
									title: "Error guardando perfil",
									description:
										error instanceof Error ? error.message : "",
									variant: "destructive",
								});
							} finally {
								setIsSaving((prev) => ({ ...prev, profile: false }));
							}
						}}
						disabled={isSaving.profile}
						className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 whitespace-nowrap"
					>
						<Save className="w-4 h-4" />
						{isSaving.profile ? "Guardando..." : "Guardar Perfil"}
					</button>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<div>
						<label className="block text-sm mb-2 text-muted-foreground">
							Nombre
						</label>
						<input
							type="text"
							value={profile?.name || ""}
							onChange={(e) =>
								setProfile({ ...profile, name: e.target.value })
							}
							className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all"
						/>
					</div>
					<div>
						<label className="block text-sm mb-2 text-muted-foreground">
							Rol / Título
						</label>
						<input
							type="text"
							value={profile?.role || ""}
							onChange={(e) =>
								setProfile({ ...profile, role: e.target.value })
							}
							className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all"
						/>
					</div>
					<div className="md:col-span-2 lg:col-span-3">
						<label className="block text-sm mb-2 text-muted-foreground">
							Bio
						</label>
						<textarea
							value={profile?.bio || ""}
							rows={3}
							onChange={(e) =>
								setProfile({ ...profile, bio: e.target.value })
							}
							className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all resize-none"
						/>
					</div>
					<div className="md:col-span-2 lg:col-span-3">
						<label className="block text-sm mb-2 text-muted-foreground">
							URL Imagen
						</label>
						<div className="flex gap-4 items-start">
							<input
								type="text"
								value={profile?.image_url || ""}
								onChange={(e) =>
									setProfile({
										...profile,
										image_url: e.target.value,
									})
								}
								className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all"
								placeholder="https://..."
							/>
							<UploadButton
								endpoint="imageUploader"
								onClientUploadComplete={(res) => {
									if (res && res[0]) {
										setProfile({
											...profile,
											image_url: res[0].url,
										});
										toast({
											title: "Imagen subida",
											description:
												"URL actualizada automáticamente",
										});
									}
								}}
								onUploadError={(err) => {
									toast({
										title: "Error subiendo imagen",
										description: err.message,
										variant: "destructive",
									});
								}}
							/>
						</div>
					</div>
					<div>
						<label className="block text-sm mb-2 text-muted-foreground">
							Ubicación
						</label>
						<input
							type="text"
							value={profile?.location || ""}
							onChange={(e) =>
								setProfile({ ...profile, location: e.target.value })
							}
							className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all"
						/>
					</div>
					<div>
						<label className="block text-sm mb-2 text-muted-foreground">
							GitHub URL
						</label>
						<input
							type="text"
							value={profile?.github_url || ""}
							onChange={(e) =>
								setProfile({ ...profile, github_url: e.target.value })
							}
							className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all"
						/>
					</div>
					<div>
						<label className="block text-sm mb-2 text-muted-foreground">
							LinkedIn URL
						</label>
						<input
							type="text"
							value={profile?.linkedin_url || ""}
							onChange={(e) =>
								setProfile({ ...profile, linkedin_url: e.target.value })
							}
							className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all"
						/>
					</div>
					<div>
						<label className="block text-sm mb-2 text-muted-foreground">
							Email
						</label>
						<input
							type="email"
							value={profile?.email || ""}
							onChange={(e) =>
								setProfile({ ...profile, email: e.target.value })
							}
							className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all"
						/>
					</div>
				</div>
			</section>

			<section>
				<div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
					<div className="flex items-center gap-4 flex-1">
						<h2 className="text-xl font-semibold">Tus Proyectos</h2>
						<span className="px-2 py-1 text-xs bg-accent/10 text-accent rounded-full font-medium">
							{filteredProjects.length} / {projects.length}
						</span>
					</div>
					<div className="flex flex-wrap items-center gap-3">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
							<input
								type="text"
								placeholder="Buscar proyectos..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-64 pl-10 pr-4 py-2 rounded-xl bg-background border border-border focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all text-sm"
							/>
						</div>
						<select
							value={filterFeatured}
							onChange={(e) =>
								setFilterFeatured(
									e.target.value as typeof filterFeatured,
								)
							}
							className="px-4 py-2 rounded-xl bg-background border border-border focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all text-sm"
						>
							<option value="all">Todos</option>
							<option value="featured">Destacados</option>
							<option value="unfeatured">Normales</option>
						</select>
						<button
							onClick={() => {
								const newProject = {
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
								setEditingProjectId(Date.now());
							}}
							className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/80 transition-colors text-sm whitespace-nowrap"
						>
							<Plus className="w-4 h-4" />
							Añadir
						</button>
					</div>
				</div>

				{renderProjects()}
			</section>
		</div>
	);
}
