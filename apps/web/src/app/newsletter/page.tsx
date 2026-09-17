import Link from "next/link";
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

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="section-shell p-6 sm:p-8">
          <span className="soft-label">Próxima edición</span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-stone-900">Rutinas que funcionan en días caóticos</h2>
          <p className="mt-4 text-sm leading-7 text-stone-600 sm:text-base">
            Una edición con una historia breve, un recurso útil, una reflexión práctica y un enlace para volver a la web.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/registro" className="primary-button">
              Suscribirme
            </Link>
            <Link href="/recursos" className="secondary-button">
              Ver recursos
            </Link>
          </div>
        </div>

        <div className="section-shell bg-[#f0d8c1] p-6 sm:p-8">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-600">Formato</div>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-stone-700">
            <li>• Introducción emocional</li>
            <li>• Contexto útil</li>
            <li>• Recurso gratuito o herramienta</li>
            <li>• Enlace a la web y a la tienda</li>
          </ul>
        </div>
      </div>

      <div className="mt-8">
        <NewsletterBox />
      </div>
    </main>
  );
}
