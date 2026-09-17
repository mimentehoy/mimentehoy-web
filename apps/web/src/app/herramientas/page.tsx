import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { toolHighlights } from "@/data/site";

export default function HerramientasPage() {
  return (
    <main className="container-shell py-10 sm:py-14">
      <SectionHeading
        eyebrow="Herramientas"
        title="Soluciones de organización sencillas y útiles"
        description="La primera herramienta se centra en rutinas visuales para la vida cotidiana."
      />

      <div className="section-shell p-6 sm:p-8">
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div>
            <span className="soft-label">Primera herramienta</span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-stone-900">
              Generador de rutinas visuales
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-stone-600 sm:text-base">
              Selecciona tareas, ordénalas, modifica nombres, añade pasos y guarda una rutina lista para imprimir o compartir.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/herramientas/rutina-visual" className="primary-button">
                Probar herramienta
              </Link>
              <Link href="/recursos" className="secondary-button">
                Ver recursos relacionados
              </Link>
            </div>
          </div>

          <div className="rounded-[24px] border border-stone-200 bg-[#f3e8df] p-5">
            <div className="grid gap-3 text-sm text-stone-700">
              {[
                "Levantarse",
                "Vestirse",
                "Desayunar",
                "Ceñir mochila",
                "Colegio",
                "Deberes",
                "Cena",
                "Dormir",
              ].map((task, index) => (
                <div key={task} className="flex items-center justify-between rounded-2xl bg-white px-3 py-2 shadow-sm">
                  <span>{index + 1}. {task}</span>
                  <span>✓</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {toolHighlights.map((tool) => (
          <div key={tool.title} className="section-shell p-5">
            <h3 className="text-2xl font-semibold text-stone-900">{tool.title}</h3>
            <p className="mt-3 text-sm leading-6 text-stone-600">{tool.description}</p>
            <Link href="/herramientas" className="mt-5 inline-flex text-sm font-semibold text-[#7a4a35]">
              {tool.cta} →
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
