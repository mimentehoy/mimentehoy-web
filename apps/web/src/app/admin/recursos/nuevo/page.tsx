'use client';

import Link from "next/link";
import { FormEvent, useState } from "react";
import { AdminAccessGate } from "@/components/auth-shell";

const initialForm = {
  title: "",
  category: "Rutinas",
  type: "PDF",
  label: "Gratis",
  description: "",
  status: "published",
  downloadUrl: "/downloads/default.pdf",
  featured: true,
};

export default function NewResourcePage() {
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
      const res = await fetch("/api/admin/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.message || "No se pudo guardar el recurso");
        return;
      }

      setStatus("success");
      setMessage("Recurso guardado correctamente.");
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
            <span className="soft-label">Admin / Nuevo recurso</span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-900">Crear recurso</h1>
          </div>
          <Link href="/admin/recursos" className="secondary-button">Volver</Link>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 section-shell p-6 sm:p-8">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-medium text-stone-700">
              Título
              <input value={form.title} onChange={(e) => handleChange("title", e.target.value)} className="rounded-xl border border-stone-300 bg-white px-3 py-2" required />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-stone-700">
              Categoría
              <select value={form.category} onChange={(e) => handleChange("category", e.target.value)} className="rounded-xl border border-stone-300 bg-white px-3 py-2">
                <option>Rutinas</option>
                <option>Sueño</option>
                <option>Emociones</option>
                <option>Crianza</option>
                <option>TDAH</option>
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-stone-700">
              Tipo
              <select value={form.type} onChange={(e) => handleChange("type", e.target.value)} className="rounded-xl border border-stone-300 bg-white px-3 py-2">
                <option>PDF</option>
                <option>Imprimible</option>
                <option>Visual</option>
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-stone-700">
              Etiqueta
              <select value={form.label} onChange={(e) => handleChange("label", e.target.value)} className="rounded-xl border border-stone-300 bg-white px-3 py-2">
                <option>Gratis</option>
                <option>Premium</option>
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-stone-700 md:col-span-2">
              Descripción
              <textarea value={form.description} onChange={(e) => handleChange("description", e.target.value)} className="min-h-[100px] rounded-xl border border-stone-300 bg-white px-3 py-2" required />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-stone-700 md:col-span-2">
              URL de descarga
              <input value={form.downloadUrl} onChange={(e) => handleChange("downloadUrl", e.target.value)} className="rounded-xl border border-stone-300 bg-white px-3 py-2" />
            </label>
          </div>

          <label className="mt-5 inline-flex items-center gap-2 text-sm text-stone-700">
            <input type="checkbox" checked={form.featured} onChange={(e) => handleChange("featured", e.target.checked)} />
            Destacado
          </label>

          <div className="mt-6 flex gap-3">
            <button type="submit" className="primary-button" disabled={status === "loading"}>
              {status === "loading" ? "Guardando..." : "Guardar recurso"}
            </button>
            <Link href="/admin/recursos" className="secondary-button">Cancelar</Link>
          </div>

          {message && (
            <div className={`mt-4 text-sm ${status === "success" ? "text-green-700" : "text-red-700"}`}>{message}</div>
          )}
        </form>
      </main>
    </AdminAccessGate>
  );
}
