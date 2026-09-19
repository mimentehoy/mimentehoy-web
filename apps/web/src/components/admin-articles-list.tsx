"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Article } from "@/lib/content";

export function AdminArticlesList({ articles }: { articles: Article[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`¿Eliminar "${title}"? Esta acción no se puede deshacer.`)) return;

    setError("");
    setPendingId(id);
    try {
      const res = await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || "No se pudo eliminar el artículo.");
        return;
      }
      router.refresh();
    } catch {
      setError("No se pudo contactar con el servidor.");
    } finally {
      setPendingId(null);
    }
  };

  if (articles.length === 0) {
    return <div className="section-shell p-6 text-stone-600">Todavía no hay artículos. Crea el primero.</div>;
  }

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-red-600">{error}</p>}
      {articles.map((article) => (
        <article key={article.id} className="section-shell p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="soft-label">{article.category}</span>
                <span className="text-xs uppercase tracking-[0.14em] text-stone-500">
                  {article.status === "PUBLISHED" ? "Publicado" : "Borrador"}
                </span>
              </div>
              <h2 className="mt-3 text-xl font-semibold text-stone-900">{article.title}</h2>
              <p className="mt-2 text-sm text-stone-600">{article.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-stone-500">{article.date}</div>
              <button
                onClick={() => handleDelete(article.id, article.title)}
                disabled={pendingId === article.id}
                className="text-xs font-semibold text-red-600 hover:underline disabled:opacity-50"
              >
                {pendingId === article.id ? "Eliminando…" : "Eliminar"}
              </button>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs text-stone-600">{tag}</span>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
