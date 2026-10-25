import type { ReactNode } from "react";

export function NewsFilter({ articles }: { articles: { slug: string; category: string; card: ReactNode }[] }) {
  return <>
    <p className="news-count" role="status">{articles.length} {articles.length === 1 ? "artículo" : "artículos"}</p>
    <div className="news-grid">{articles.map((article) => <div key={article.slug}>{article.card}</div>)}</div>
    {articles.length === 0 && <p className="py-12">Pronto encontrarás aquí nuevas lecturas para acompañarte.</p>}
  </>;
}
