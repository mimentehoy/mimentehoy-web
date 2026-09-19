'use client';

import { FormEvent, useState } from "react";
import Link from "next/link";
import { AdminAccessGate } from "@/components/auth-shell";

const initialForm = {
  title: "",
  description: "",
  category: "TDAH",
  author: "MIMENTEHOY",
  status: "DRAFT",
  featured: false,
  tags: "",
  seoTitle: "",
  metaDescription: "",
  content: "",
  date: new Date().toISOString().slice(0, 10),
};

export default function NewArticlePage() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const payload = {
        ...form,
        tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      };

      const res = await fetch("/api/admin/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.message || "No se pudo guardar el artículo");
        return;
      }

      setStatus("success");
      setMessage("Artículo guardado correctamente.");
      setForm(initialForm);
    } catch {
      setStatus("error");
      setMessage("Error de red. Inténtalo otra vez.");
    }
  };

  return (
    <AdminAccessGate>
      <main className="container-shell py-10 sm:py-14">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="soft-label">Admin / Nuevo artículo</span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-900">Crear artículo</h1>
          </div>
          <Link href="/admin/articulos" className="secondary-button">Volver</Link>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 section-shell p-6 sm:p-8">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-medium text-stone-700">
              Título
              <input value={form.title} onChange={(e) => handleChange("title", e.target.value)} className="rounded-xl border border-stone-300 bg-white px-3 py-2" required />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-stone-700">
              Slug
              <input value={form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")} readOnly className="rounded-xl border border-stone-300 bg-stone-50 px-3 py-2 text-stone-500" />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-stone-700">
              Autor
              <input value={form.author} onChange={(e) => handleChange("author", e.target.value)} className="rounded-xl border border-stone-300 bg-white px-3 py-2" />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-stone-700">
              Categoría
              <select value={form.category} onChange={(e) => handleChange("category", e.target.value)} className="rounded-xl border border-stone-300 bg-white px-3 py-2">
                <option>TDAH</option>
                <option>Autismo</option>
                <option>Crianza</option>
                <option>Sueño</option>
                <option>Estrés</option>
                <option>Hábitos</option>
                <option>Emociones</option>
                <option>Colegio</option>
                <option>Psicología</option>
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-stone-700">
              Estado
              <select value={form.status} onChange={(e) => handleChange("status", e.target.value)} className="rounded-xl border border-stone-300 bg-white px-3 py-2">
                <option value="DRAFT">Borrador</option>
                <option value="PUBLISHED">Publicado</option>
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-stone-700">
              Fecha
              <input type="date" value={form.date} onChange={(e) => handleChange("date", e.target.value)} className="rounded-xl border border-stone-300 bg-white px-3 py-2" />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-stone-700 md:col-span-2">
              Descripción corta
              <textarea value={form.description} onChange={(e) => handleChange("description", e.target.value)} className="min-h-[90px] rounded-xl border border-stone-300 bg-white px-3 py-2" required />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-stone-700 md:col-span-2">
              Etiquetas (separadas por comas)
              <input value={form.tags} onChange={(e) => handleChange("tags", e.target.value)} className="rounded-xl border border-stone-300 bg-white px-3 py-2" />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-stone-700 md:col-span-2">
              SEO title
              <input value={form.seoTitle} onChange={(e) => handleChange("seoTitle", e.target.value)} className="rounded-xl border border-stone-300 bg-white px-3 py-2" />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-stone-700 md:col-span-2">
              Meta description
              <textarea value={form.metaDescription} onChange={(e) => handleChange("metaDescription", e.target.value)} className="min-h-[80px] rounded-xl border border-stone-300 bg-white px-3 py-2" />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-stone-700 md:col-span-2">
              Contenido
              <textarea value={form.content} onChange={(e) => handleChange("content", e.target.value)} className="min-h-[180px] rounded-xl border border-stone-300 bg-white px-3 py-2" required />
            </label>
          </div>

          <label className="mt-5 inline-flex items-center gap-2 text-sm text-stone-700">
            <input type="checkbox" checked={form.featured} onChange={(e) => handleChange("featured", e.target.checked)} />
            Destacado
          </label>

          <div className="mt-6 flex gap-3">
            <button type="submit" className="primary-button" disabled={status === "loading"}>
              {status === "loading" ? "Guardando..." : "Guardar artículo"}
            </button>
            <Link href="/admin/articulos" className="secondary-button">Cancelar</Link>
          </div>

          {message && (
            <div className={`mt-4 text-sm ${status === "success" ? "text-green-700" : "text-red-700"}`}>{message}</div>
          )}
        </form>
      </main>
    </AdminAccessGate>
  );
}
