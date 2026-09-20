import { NewsletterBox } from "@/components/newsletter-box";

export default function Home() {
  return (
    <main className="pb-20">
      <section className="container-shell pt-8 sm:pt-10">
        <div className="section-shell overflow-hidden p-5 sm:p-8 lg:p-10">
          <div className="max-w-2xl">
            <span className="soft-label">MIMENTEHOY</span>
            <h1 className="mt-5 max-w-xl text-4xl font-semibold tracking-[-0.06em] text-[#001733] sm:text-5xl lg:text-6xl">
              Entenderles <span className="gradient-text">cambia la forma</span> de ayudarles.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-stone-600 sm:text-lg">
              Artículos, recursos prácticos y herramientas útiles para familias, crianza, TDAH, autismo y salud mental.
            </p>
          </div>
        </div>
      </section>

      <section className="container-shell mt-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-stone-900">
            ¿Quieres recibir guías, herramientas y recursos prácticos?
          </h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Suscríbete a la newsletter y te los enviamos directamente a tu email.
          </p>
        </div>
      </section>

      <section className="container-shell mt-6">
        <NewsletterBox />
      </section>
    </main>
  );
}
