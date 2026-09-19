import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { getResources } from "@/lib/content";

export default function RecursosPage() {
  const resources = getResources();

  return (
    <main className="container-shell py-10 sm:py-14">
      <SectionHeading
        eyebrow="Recursos"
        title="Biblioteca de materiales prácticos"
        description="Checklist, rutinas, guías y tarjetas para descargar o imprimir."
      />

      <div className="grid gap-5 md:grid-cols-3">
        {resources.map((resource) => (
          <article key={resource.slug} className="section-shell p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="soft-label">{resource.category}</span>
              <span className="text-xs font-medium text-stone-500">{resource.label}</span>
            </div>
            <div className="text-xs uppercase tracking-[0.18em] text-stone-500">{resource.type}</div>
            <h2 className="mt-3 text-2xl font-semibold text-stone-900">{resource.title}</h2>
            <p className="mt-3 text-sm leading-6 text-stone-600">{resource.description}</p>
            <Link href={`/recursos/${resource.slug}`} className="mt-5 inline-flex text-sm font-semibold text-[#7a4a35]">
              Ver recurso →
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
