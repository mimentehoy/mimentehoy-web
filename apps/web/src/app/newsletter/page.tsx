import { NewsletterBox } from "@/components/newsletter-box";
import { SectionHeading } from "@/components/section-heading";

export default function NewsletterPage() {
  return (
    <main className="container-shell py-10 sm:py-14">
      <SectionHeading
        eyebrow="Newsletter"
        title="Contenido claro, útil y fácil de volver a visitar"
        description="La newsletter será la conexión entre la audiencia social y la plataforma propia."
      />

      <div className="mx-auto max-w-2xl section-shell bg-[#f0d8c1] p-6 sm:p-8">
        <div className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-600">Formato</div>
        <ul className="mt-5 space-y-3 text-sm leading-6 text-stone-700">
          <li>• Introducción emocional</li>
          <li>• Contexto útil</li>
          <li>• Recurso gratuito o herramienta</li>
          <li>• Enlace a la web y a la tienda</li>
        </ul>
      </div>

      <div className="mt-8">
        <NewsletterBox />
      </div>
    </main>
  );
}
