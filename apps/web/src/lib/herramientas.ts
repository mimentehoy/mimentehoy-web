import path from "node:path";
import { cache } from "react";
import { readMarkdownEntries, type NewsArticle } from "@/lib/noticias";

export const TOOL_SECTIONS = [
  { slug: "autismo", label: "Autismo", description: "Apoyos visuales, anticipación, transiciones y regulación sensorial." },
  { slug: "tdah", label: "TDAH", description: "Rutinas, organización, deberes y pequeñas estrategias para el día a día." },
  { slug: "alzheimer", label: "Alzhéimer", description: "Comunicación, rutinas y cuidado de quien cuida." },
] as const;
export type ToolSectionSlug = (typeof TOOL_SECTIONS)[number]["slug"];
export type Tool = NewsArticle & { seccion: ToolSectionSlug };

const directory = path.join(process.cwd(), "content/herramientas");
const sectionSlugs: string[] = TOOL_SECTIONS.map((section) => section.slug);

export function getToolSection(slug: string) {
  return TOOL_SECTIONS.find((section) => section.slug === slug);
}
export function toolHref(tool: Pick<Tool, "seccion" | "slug">) {
  return `/herramientas/${tool.seccion}/${tool.slug}`;
}
export const getTools = cache((): Tool[] => readMarkdownEntries(directory).map(({ data, ...tool }) => {
  const seccion = String(data.seccion ?? "").trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  if (!sectionSlugs.includes(seccion)) throw new Error(`Herramientas: campo seccion no válido en ${tool.slug}.md (usa ${sectionSlugs.join(", ")})`);
  return { ...tool, seccion: seccion as ToolSectionSlug };
}));
export function getToolsBySection(seccion: string) {
  return getTools().filter((tool) => tool.seccion === seccion);
}
export function getRelatedTools(tool: Tool) {
  const score = (other: Tool) => Number(other.seccion === tool.seccion) * 3 + other.etiquetas.filter((tag) => tool.etiquetas.includes(tag)).length;
  return getTools().filter((other) => other.slug !== tool.slug).sort((a, b) => score(b) - score(a) || b.fecha.localeCompare(a.fecha)).slice(0, 3);
}
