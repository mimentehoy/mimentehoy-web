import { RoutineBuilder } from "@/components/routine-builder";
import { SectionHeading } from "@/components/section-heading";

export default function RutinaVisualPage() {
  return (
    <main className="container-shell py-10 sm:py-14 print:p-0">
      <div className="print:hidden">
        <SectionHeading
          eyebrow="Herramienta"
          title="Generador de rutinas visuales"
          description="Crea una rutina sencilla de pasos para la mañana o la tarde, personalízala y prepárala para imprimir."
        />
      </div>

      <RoutineBuilder />
    </main>
  );
}
