import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolsIndex } from "@/components/tools-index";
import { TOOL_SECTIONS, getToolSection } from "@/lib/herramientas";

export const dynamic = "force-static";
export const dynamicParams = false;
export function generateStaticParams() { return TOOL_SECTIONS.map(({ slug }) => ({ seccion: slug })); }
type Props = { params: Promise<{ seccion: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const section = getToolSection((await params).seccion);
  if (!section) return {};
  return { title: `Herramientas · ${section.label}`, description: section.description, alternates: { canonical: `/herramientas/${section.slug}` } };
}
export default async function ToolSectionPage({ params }: Props) {
  const { seccion } = await params;
  if (!getToolSection(seccion)) notFound();
  return <ToolsIndex seccion={seccion} />;
}
