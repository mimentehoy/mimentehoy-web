import Link from "next/link";
import { NewsCard } from "@/components/news-card";
import { TOOL_SECTIONS, getToolSection, getTools, getToolsBySection, toolHref } from "@/lib/herramientas";

export function ToolsIndex({ seccion }: { seccion?: string }) {
  const section = seccion ? getToolSection(seccion) : undefined;
  const tools = section ? getToolsBySection(section.slug) : getTools();
  return <main className="news-page"><div className="container-shell py-12 sm:py-20">
    <header className="news-index-header">
      <span className="news-eyebrow">Herramientas para familias{section ? ` · ${section.label}` : ""}</span>
      <h1>{section ? <>Herramientas<br /><em>{section.label}.</em></> : <>Pequeñas herramientas<br /><em>para cada día.</em></>}</h1>
      <p>{section ? section.description : "Ideas prácticas y basadas en fuentes fiables para acompañar en casa: autismo, TDAH y alzhéimer."}</p>
    </header>
    <nav className="tool-tabs" aria-label="Herramientas por tema">
      <Link href="/herramientas" aria-current={!section ? "page" : undefined}>Todas</Link>
      {TOOL_SECTIONS.map((item) => <Link key={item.slug} href={`/herramientas/${item.slug}`} aria-current={section?.slug === item.slug ? "page" : undefined}>{item.label}</Link>)}
    </nav>
    <p className="news-count" role="status">{tools.length} {tools.length === 1 ? "herramienta" : "herramientas"}</p>
    <div className="news-grid">{tools.map((tool) => <div key={tool.slug}><NewsCard article={tool} href={toolHref(tool)} cta="Ver herramienta" /></div>)}</div>
    {tools.length === 0 && <p className="py-12">Muy pronto encontrarás aquí nuevas herramientas.</p>}
  </div></main>;
}
