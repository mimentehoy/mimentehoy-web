"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Resource } from "@/lib/content";

export function AdminResourcesList({ items }: { items: Resource[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`¿Eliminar "${title}"? Esta acción no se puede deshacer.`)) return;

    setError("");
    setPendingId(id);
    try {
      const res = await fetch(`/api/admin/resources/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || "No se pudo eliminar el recurso.");
        return;
      }
      router.refresh();
    } catch {
      setError("No se pudo contactar con el servidor.");
    } finally {
      setPendingId(null);
    }
  };

  if (items.length === 0) {
    return <div className="section-shell p-6 text-stone-600">Todavía no hay recursos. Crea el primero.</div>;
  }

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-red-600">{error}</p>}
      {items.map((item) => (
        <article key={item.id} className="section-shell p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-[0.14em] text-stone-500">{item.type}</div>
              <h2 className="mt-2 text-xl font-semibold text-stone-900">{item.title}</h2>
              <p className="mt-2 text-sm text-stone-600">{item.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs text-stone-700">
                {item.status === "published" ? "Publicado" : "Borrador"}
              </span>
              <button
                onClick={() => handleDelete(item.id, item.title)}
                disabled={pendingId === item.id}
                className="text-xs font-semibold text-red-600 hover:underline disabled:opacity-50"
              >
                {pendingId === item.id ? "Eliminando…" : "Eliminar"}
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
