import type { Metadata } from "next";
import { ToolsIndex } from "@/components/tools-index";

export const dynamic = "force-static";
export const metadata: Metadata = {
  title: "Herramientas para familias",
  description: "Herramientas prácticas para acompañar en casa: autismo, TDAH y alzhéimer.",
  alternates: { canonical: "/herramientas" },
};
export default function HerramientasPage() {
  return <ToolsIndex />;
}
