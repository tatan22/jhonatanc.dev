"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Save, Trash2, LogOut } from "lucide-react";

export default function AdminDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/data");
      if (res.status === 401) {
        router.push("/admin");
        return;
      }
      const data = await res.json();
      setProfile(data.profile || {});
      setProjects(data.projects || []);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await fetch("/api/admin/data?type=profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      alert("Perfil guardado con éxito");
    } catch (error) {
      alert("Error guardando perfil");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveProject = async (project: any) => {
    setIsSaving(true);
    try {
      await fetch("/api/admin/data?type=project", {
        method: project.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      });
      alert("Proyecto guardado");
      fetchData(); // Refresh to get the new ID if it was created
    } catch (error) {
      alert("Error guardando proyecto");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm("¿Seguro que quieres borrar este proyecto?")) return;
    setIsSaving(true);
    try {
      await fetch(`/api/admin/data?type=project&id=${id}`, {
        method: "DELETE",
      });
      setProjects(projects.filter(p => p.id !== id));
    } catch (error) {
      alert("Error borrando proyecto");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddProject = () => {
    setProjects([{ title: "", description: "", image_url: "", tech_stack: [], featured: false, order_index: projects.length }, ...projects]);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>;
  }

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <button 
          onClick={async () => {
            await fetch("/api/admin/logout", { method: "POST" });
            router.push("/admin");
          }}
          className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Salir
        </button>
      </div>

      {/* Profile Section */}
      <section className="bg-card/40 border border-border/40 rounded-3xl p-8 backdrop-blur-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Tu Perfil</h2>
          <button 
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Save className="w-4 h-4" />
            Guardar Perfil
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm mb-2 text-muted-foreground">Nombre</label>
            <input 
              type="text" 
              value={profile?.name || ""} 
              onChange={e => setProfile({...profile, name: e.target.value})}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-accent focus:outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm mb-2 text-muted-foreground">Rol</label>
            <input 
              type="text" 
              value={profile?.role || ""} 
              onChange={e => setProfile({...profile, role: e.target.value})}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-accent focus:outline-none" 
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-2 text-muted-foreground">Bio</label>
            <textarea 
              value={profile?.bio || ""} 
              rows={3}
              onChange={e => setProfile({...profile, bio: e.target.value})}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-accent focus:outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm mb-2 text-muted-foreground">URL Imagen (ej: /profile.webp)</label>
            <input 
              type="text" 
              value={profile?.image_url || ""} 
              onChange={e => setProfile({...profile, image_url: e.target.value})}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-accent focus:outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm mb-2 text-muted-foreground">Ubicación</label>
            <input 
              type="text" 
              value={profile?.location || ""} 
              onChange={e => setProfile({...profile, location: e.target.value})}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-accent focus:outline-none" 
            />
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Tus Proyectos</h2>
          <button 
            onClick={handleAddProject}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/80 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Añadir Proyecto
          </button>
        </div>

        <div className="space-y-6">
          {projects.map((project, index) => (
            <div key={project.id || index} className="bg-card/40 border border-border/40 rounded-3xl p-8 backdrop-blur-xl relative">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm mb-2 text-muted-foreground">Título</label>
                  <input 
                    type="text" 
                    value={project.title || ""} 
                    onChange={e => {
                      const newProjects = [...projects];
                      newProjects[index].title = e.target.value;
                      setProjects(newProjects);
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-accent focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-muted-foreground">URL Imagen (ej: /projects/veloce.jpg)</label>
                  <input 
                    type="text" 
                    value={project.image_url || ""} 
                    onChange={e => {
                      const newProjects = [...projects];
                      newProjects[index].image_url = e.target.value;
                      setProjects(newProjects);
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-accent focus:outline-none" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm mb-2 text-muted-foreground">Descripción</label>
                  <textarea 
                    value={project.description || ""} 
                    rows={2}
                    onChange={e => {
                      const newProjects = [...projects];
                      newProjects[index].description = e.target.value;
                      setProjects(newProjects);
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-accent focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-muted-foreground">Tecnologías (separadas por coma)</label>
                  <input 
                    type="text" 
                    value={(project.tech_stack || []).join(", ")} 
                    onChange={e => {
                      const newProjects = [...projects];
                      newProjects[index].tech_stack = e.target.value.split(",").map(t => t.trim());
                      setProjects(newProjects);
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-accent focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-muted-foreground">URL Demo / Repo Github</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Demo URL"
                      value={project.live_url || ""} 
                      onChange={e => {
                        const newProjects = [...projects];
                        newProjects[index].live_url = e.target.value;
                        setProjects(newProjects);
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-accent focus:outline-none" 
                    />
                    <input 
                      type="text" 
                      placeholder="Github URL"
                      value={project.github_url || ""} 
                      onChange={e => {
                        const newProjects = [...projects];
                        newProjects[index].github_url = e.target.value;
                        setProjects(newProjects);
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-accent focus:outline-none" 
                    />
                  </div>
                </div>
                <div className="md:col-span-2 flex justify-between items-center mt-4 pt-6 border-t border-border/50">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={project.featured || false}
                      onChange={e => {
                        const newProjects = [...projects];
                        newProjects[index].featured = e.target.checked;
                        setProjects(newProjects);
                      }}
                      className="w-5 h-5 rounded accent-accent"
                    />
                    <span className="text-sm font-medium">Proyecto Destacado (se ve más grande)</span>
                  </label>
                  
                  <div className="flex gap-3">
                    {project.id && (
                      <button 
                        onClick={() => handleDeleteProject(project.id)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Borrar Proyecto"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                    <button 
                      onClick={() => handleSaveProject(project)}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-foreground hover:text-background transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Guardar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
