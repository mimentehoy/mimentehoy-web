import type { Metadata } from "next";
import { getNews } from "@/lib/noticias";
import { NewsCard } from "@/components/news-card";
import { NewsFilter } from "@/components/news-filter";

export const dynamic = "force-static";
export const metadata: Metadata = {
  title: "Noticias y blog", description: "Lecturas para entender la neurodivergencia y acompañar el día a día en familia.",
  alternates: { canonical: "/noticias", types: { "application/rss+xml": "/noticias/rss.xml" } },
};
export default function NewsPage() {
  const articles = getNews();
  return <main className="news-page"><div className="container-shell py-12 sm:py-20">
    <header className="news-index-header"><span className="news-eyebrow">El blog de mimentehoy</span><h1>Miradas que ayudan<br /><em>a entender.</em></h1><p>Noticias, ideas y pequeñas herramientas para acompañar a tu familia con más calma y claridad.</p><a className="news-rss" href="/noticias/rss.xml">Seguir por RSS ↗</a></header>
    <NewsFilter articles={articles.map((article) => ({ slug: article.slug, category: article.categoria, card: <NewsCard article={article} /> }))} />
  </div></main>;
}
