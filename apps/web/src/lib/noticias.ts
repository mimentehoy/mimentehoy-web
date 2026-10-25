import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { cache } from "react";

export const NEWS_URL = "https://mimentehoy.com";
export type NewsArticle = {
  titulo: string; slug: string; fecha: string; descripcion: string;
  categoria: string; etiquetas: string[]; tiempo_lectura: string; imagen: string;
  contenido: string;
};
const directory = path.join(process.cwd(), "content/noticias");
export function categoryTheme(category: string) {
  const key = category.toLocaleLowerCase("es");
  if (["tdah", "rutinas", "colegio"].includes(key)) return "teal";
  if (["autismo", "emociones", "sueño"].includes(key)) return "sage";
  return "terracotta";
}
export function formatNewsDate(date: string) {
  return new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}
export const getNews = cache((): NewsArticle[] => {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory).filter((file) => file.endsWith(".md")).map((file) => {
    const source = fs.readFileSync(path.join(directory, file), "utf8");
    // Strip editorial notes before parsing: they never reach HTML, RSS or client props.
    const publicSource = source.split(/^\s*(?:#{1,6}\s+)?(?:\*\*)?CONTROL DE CALIDAD\b.*$/im)[0];
    const { data, content } = matter(publicSource);
    const fail = (field: string): never => { throw new Error(`Noticias: campo ${field} no válido en ${file}`); };
    for (const field of ["titulo", "slug", "descripcion", "categoria", "prompt_imagen"]) {
      if (typeof data[field] !== "string" || !data[field].trim()) fail(field);
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug) || file !== `${data.slug}.md`) fail("slug");
    const fecha = data.fecha instanceof Date ? data.fecha.toISOString().slice(0, 10) : String(data.fecha);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha) || !Number.isFinite(Date.parse(fecha)) || new Date(fecha).toISOString().slice(0, 10) !== fecha) fail("fecha");
    if (!Array.isArray(data.etiquetas) || !data.etiquetas.every((tag: unknown) => typeof tag === "string")) fail("etiquetas");
    if (!["string", "number"].includes(typeof data.tiempo_lectura) || !String(data.tiempo_lectura).trim()) fail("tiempo_lectura");
    let imagen = `/noticias/portada-${categoryTheme(data.categoria)}.png`;
    if (data.imagen !== undefined) {
      if (typeof data.imagen !== "string") fail("imagen");
      const candidate = data.imagen.replace(/^\/public\//, "/");
      if (!/^\/noticias\/[a-zA-Z0-9/_-]+\.(png|jpe?g|webp|avif)$/i.test(candidate) || !fs.existsSync(path.join(process.cwd(), "public", candidate))) fail("imagen");
      imagen = candidate;
    }
    const reading = String(data.tiempo_lectura);
    return { titulo: data.titulo, slug: data.slug, fecha, descripcion: data.descripcion, categoria: data.categoria,
      etiquetas: data.etiquetas, tiempo_lectura: /^\d+$/.test(reading) ? `${reading} min` : reading, imagen, contenido: content.trim() };
  }).sort((a, b) => b.fecha.localeCompare(a.fecha) || a.slug.localeCompare(b.slug));
});
export function getRelatedNews(article: NewsArticle) {
  const score = (other: NewsArticle) => Number(other.categoria === article.categoria) * 3 + other.etiquetas.filter((tag) => article.etiquetas.includes(tag)).length;
  return getNews().filter((other) => other.slug !== article.slug).sort((a, b) => score(b) - score(a) || b.fecha.localeCompare(a.fecha)).slice(0, 3);
}
