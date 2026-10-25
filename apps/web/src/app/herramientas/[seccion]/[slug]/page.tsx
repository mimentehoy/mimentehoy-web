import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { categoryTheme, formatNewsDate, NEWS_URL } from "@/lib/noticias";
import { getRelatedTools, getToolSection, getTools, toolHref } from "@/lib/herramientas";
import { NewsCard } from "@/components/news-card";
import { NewsShare } from "@/components/news-share";
import { NewsletterBox } from "@/components/newsletter-box";

export const dynamic = "force-static";
export const dynamicParams = false;
export function generateStaticParams() { return getTools().map(({ seccion, slug }) => ({ seccion, slug })); }
type Props = { params: Promise<{ seccion: string; slug: string }> };
async function findTool(params: Props["params"]) {
  const { seccion, slug } = await params;
  const tool = getTools().find((item) => item.slug === slug && item.seccion === seccion);
  if (!tool) notFound();
  return tool;
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tool = await findTool(params);
  const url = `${NEWS_URL}${toolHref(tool)}`;
  const images = [{ url: `${NEWS_URL}${tool.imagen}`, alt: tool.titulo }];
  return { title: tool.titulo, description: tool.descripcion, keywords: tool.etiquetas,
    alternates: { canonical: url },
    openGraph: { type: "article", title: tool.titulo, description: tool.descripcion, url, images, locale: "es_ES", siteName: "MIMENTEHOY", publishedTime: tool.fecha, modifiedTime: tool.fecha, section: tool.categoria, tags: tool.etiquetas },
    twitter: { card: "summary_large_image", title: tool.titulo, description: tool.descripcion, images, creator: "@mimentehoy_" },
  };
}
export default async function ToolPage({ params }: Props) {
  const tool = await findTool(params);
  const section = getToolSection(tool.seccion)!;
  const related = getRelatedTools(tool);
  const url = `${NEWS_URL}${toolHref(tool)}`;
  const schema = { "@context": "https://schema.org", "@type": "Article", headline: tool.titulo, description: tool.descripcion,
    image: [`${NEWS_URL}${tool.imagen}`], datePublished: `${tool.fecha}T00:00:00Z`, dateModified: `${tool.fecha}T00:00:00Z`,
    author: { "@type": "Organization", name: "MIMENTEHOY", url: NEWS_URL }, publisher: { "@type": "Organization", name: "MIMENTEHOY", url: NEWS_URL, logo: { "@type": "ImageObject", url: `${NEWS_URL}/logo.png` } },
    mainEntityOfPage: { "@type": "WebPage", "@id": url }, articleSection: section.label, keywords: tool.etiquetas.join(", "), inLanguage: "es-ES" };
  const share = <NewsShare title={tool.titulo} description={tool.descripcion} url={url} />;
  return <main className={`news-page news-theme-${categoryTheme(tool.categoria)}`}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <article className="news-article container-shell py-10 sm:py-16">
      <div className="news-reading"><Link className="news-back" href={`/herramientas/${section.slug}`}>← Herramientas · {section.label}</Link>
        <header className="news-article-header"><span className="news-category">{section.label} · {tool.categoria}</span><h1>{tool.titulo}</h1><p className="news-intro">{tool.descripcion}</p><div className="news-meta"><time dateTime={tool.fecha}>Actualizado el {formatNewsDate(tool.fecha)}</time><span>{tool.tiempo_lectura} de lectura</span></div>{share}</header>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="news-article-cover" src={tool.imagen} alt={`Portada: ${tool.titulo}`} width={1200} height={630} fetchPriority="high" />
      <div className="news-reading"><div className="news-prose"><ReactMarkdown remarkPlugins={[remarkGfm]}>{tool.contenido}</ReactMarkdown></div>
        <ul className="news-tags" aria-label="Etiquetas">{tool.etiquetas.map((tag) => <li key={tag}>{tag}</li>)}</ul>{share}
      </div>
    </article>
    <section className="container-shell pb-14" aria-label="Suscribirse a la newsletter"><NewsletterBox /></section>
    {related.length > 0 && <section className="container-shell pb-20" aria-labelledby="related-title"><div className="news-section-heading"><span className="news-eyebrow">Sigue leyendo</span><h2 id="related-title">Más herramientas</h2></div><div className="news-grid">{related.map((item) => <NewsCard key={item.slug} article={item} href={toolHref(item)} cta="Ver herramienta" />)}</div></section>}
  </main>;
}
