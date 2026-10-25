"use client";
import { useState } from "react";
import type { ReactNode } from "react";

export function NewsFilter({ articles }: { articles: { slug: string; category: string; card: ReactNode }[] }) {
  const [category, setCategory] = useState<string | null>(null);
  const categories = [...new Set(articles.map((article) => article.category))];
  const filtered = articles.filter((article) => !category || article.category === category);
  return <>
    <div className="news-filters" role="group" aria-label="Filtrar noticias por categoría">
      <button type="button" aria-pressed={category === null} onClick={() => setCategory(null)}>Todas</button>
      {categories.map((item) => <button type="button" key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}
    </div>
    <p className="news-count" role="status">{filtered.length} {filtered.length === 1 ? "artículo" : "artículos"}</p>
    <div className="news-grid">{filtered.map((article) => <div key={article.slug}>{article.card}</div>)}</div>
    {filtered.length === 0 && <p className="py-12">Pronto encontrarás aquí nuevas lecturas para acompañarte.</p>}
  </>;
}
