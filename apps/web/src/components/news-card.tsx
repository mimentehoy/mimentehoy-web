import Link from "next/link";
import { categoryTheme, formatNewsDate, type NewsArticle } from "@/lib/noticias";

export function NewsCard({ article, href, cta = "Leer artículo" }: { article: NewsArticle; href?: string; cta?: string }) {
  return <article className={`news-card news-theme-${categoryTheme(article.categoria)}`}>
    <Link href={href ?? `/noticias/${article.slug}`} className="news-card-link">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={article.imagen} alt="" width={1200} height={630} loading="lazy" className="news-card-cover" />
      <div className="news-card-body">
        <span className="news-category">{article.categoria}</span>
        <h3>{article.titulo}</h3>
        <p>{article.descripcion}</p>
        <div className="news-meta"><time dateTime={article.fecha}>{formatNewsDate(article.fecha)}</time><span>{article.tiempo_lectura} de lectura</span></div>
        <span className="news-read">{cta} <span aria-hidden="true">↗</span></span>
      </div>
    </Link>
  </article>;
}
