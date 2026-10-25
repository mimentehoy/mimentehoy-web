import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { categoryTheme, formatNewsDate, getNews, getRelatedNews, NEWS_URL } from "@/lib/noticias";
import { NewsCard } from "@/components/news-card";
import { NewsShare } from "@/components/news-share";
import { NewsletterBox } from "@/components/newsletter-box";

export const dynamic = "force-static";
export const dynamicParams = false;
export function generateStaticParams() { return getNews().map(({ slug }) => ({ slug })); }
type Props = { params: Promise<{ slug: string }> };
async function findArticle(params: Props["params"]) {
  const { slug } = await params;
  const article = getNews().find((item) => item.slug === slug);
  if (!article) notFound();
  return article;
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await findArticle(params);
  const url = `${NEWS_URL}/noticias/${article.slug}`;
  const images = [{ url: `${NEWS_URL}${article.imagen}`, alt: article.titulo }];
  return { title: article.titulo, description: article.descripcion, keywords: article.etiquetas,
    alternates: { canonical: url, types: { "application/rss+xml": "/noticias/rss.xml" } },
    openGraph: { type: "article", title: article.titulo, description: article.descripcion, url, images, locale: "es_ES", siteName: "MIMENTEHOY", publishedTime: article.fecha, modifiedTime: article.fecha, section: article.categoria, tags: article.etiquetas },
    twitter: { card: "summary_large_image", title: article.titulo, description: article.descripcion, images, creator: "@mimentehoy_" },
  };
}
export default async function ArticlePage({ params }: Props) {
  const article = await findArticle(params);
  const related = getRelatedNews(article);
  const url = `${NEWS_URL}/noticias/${article.slug}`;
  const schema = { "@context": "https://schema.org", "@type": "Article", headline: article.titulo, description: article.descripcion,
    image: [`${NEWS_URL}${article.imagen}`], datePublished: `${article.fecha}T00:00:00Z`, dateModified: `${article.fecha}T00:00:00Z`,
    author: { "@type": "Organization", name: "MIMENTEHOY", url: NEWS_URL }, publisher: { "@type": "Organization", name: "MIMENTEHOY", url: NEWS_URL, logo: { "@type": "ImageObject", url: `${NEWS_URL}/logo.png` } },
    mainEntityOfPage: { "@type": "WebPage", "@id": url }, articleSection: article.categoria, keywords: article.etiquetas.join(", "), inLanguage: "es-ES" };
  const share = <NewsShare title={article.titulo} description={article.descripcion} url={url} />;
  return <main className={`news-page news-theme-${categoryTheme(article.categoria)}`}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <article className="news-article container-shell py-10 sm:py-16">
      <div className="news-reading"><Link className="news-back" href="/noticias">← Todas las noticias</Link>
        <header className="news-article-header"><span className="news-category">{article.categoria}</span><h1>{article.titulo}</h1><p className="news-intro">{article.descripcion}</p><div className="news-meta"><time dateTime={article.fecha}>Actualizado el {formatNewsDate(article.fecha)}</time><span>{article.tiempo_lectura} de lectura</span></div>{share}</header>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="news-article-cover" src={article.imagen} alt={`Portada: ${article.titulo}`} width={1200} height={630} fetchPriority="high" />
      <div className="news-reading"><div className="news-prose"><ReactMarkdown remarkPlugins={[remarkGfm]}>{article.contenido}</ReactMarkdown></div>
        <ul className="news-tags" aria-label="Etiquetas">{article.etiquetas.map((tag) => <li key={tag}>{tag}</li>)}</ul>{share}
      </div>
    </article>
    <section className="container-shell pb-14" aria-label="Suscribirse a la newsletter"><NewsletterBox /></section>
    {related.length > 0 && <section className="container-shell pb-20" aria-labelledby="related-title"><div className="news-section-heading"><span className="news-eyebrow">Sigue leyendo</span><h2 id="related-title">También te puede interesar</h2></div><div className="news-grid">{related.map((item) => <NewsCard key={item.slug} article={item} />)}</div></section>}
  </main>;
}
