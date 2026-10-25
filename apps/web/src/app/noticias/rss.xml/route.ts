import { getNews, NEWS_URL } from "@/lib/noticias";
export const dynamic = "force-static";
const xml = (value: string) => value.replace(/[<>&"']/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[character]!);
export function GET() {
  const items = getNews().map((article) => {
    const url = `${NEWS_URL}/noticias/${article.slug}`;
    return `<item><title>${xml(article.titulo)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><description>${xml(article.descripcion)}</description><pubDate>${new Date(`${article.fecha}T00:00:00Z`).toUTCString()}</pubDate><category>${xml(article.categoria)}</category></item>`;
  }).join("");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Noticias · MIMENTEHOY</title><link>${NEWS_URL}/noticias</link><description>Ideas y recursos para acompañar en familia.</description><language>es-ES</language><atom:link href="${NEWS_URL}/noticias/rss.xml" rel="self" type="application/rss+xml"/>${items}</channel></rss>`, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "X-Content-Type-Options": "nosniff" } });
}
