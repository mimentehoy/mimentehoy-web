import Link from "next/link";
import { NewsletterBox } from "@/components/newsletter-box";
import { SectionHeading } from "@/components/section-heading";
import {
  categories,
  featuredArticles,
  metrics,
  productCards,
  resources,
  toolHighlights,
  weeklyHighlights,
} from "@/data/site";

export default function Home() {
  return (
    <main className="pb-20">
      <section className="container-shell pt-8 sm:pt-10">
        <div className="section-shell overflow-hidden p-5 sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <span className="soft-label">MIMENTEHOY</span>
              <h1 className="mt-5 max-w-xl text-4xl font-semibold tracking-[-0.06em] text-stone-900 sm:text-5xl lg:text-6xl">
                Entenderles cambia la forma de ayudarles.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-stone-600 sm:text-lg">
                Artículos, recursos prácticos y herramientas útiles para familias, crianza, TDAH, autismo y salud mental.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/articulos" className="primary-button">
                  Explorar artículos
                </Link>
                <Link href="/recursos" className="secondary-button">
                  Recursos gratuitos
                </Link>
              </div>
            </div>

            <div className="rounded-[28px] bg-[#201913] p-5 text-white shadow-[0_20px_60px_rgba(32,25,19,0.2)]">
              <div className="flex items-center justify-between text-sm text-stone-200">
                <span>Lo nuevo esta semana</span>
                <span>•</span>
              </div>
              <div className="mt-6 space-y-4">
                {weeklyHighlights.slice(0, 2).map((item) => (
                  <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs uppercase tracking-[0.16em] text-[#f0c1aa]">{item.category}</div>
                    <h3 className="mt-2 text-lg font-semibold leading-6">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-stone-200">{item.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell mt-10">
        <SectionHeading
          eyebrow="Métricas"
          title="Todo se entiende mejor cuando ayuda a la vida real"
          description="Una base editorial clara, útil y fácil de volver a visitar desde móvil."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="section-shell p-5 text-center">
              <div className="text-3xl font-semibold tracking-tight text-stone-900">{metric.value}</div>
              <div className="mt-2 text-sm text-stone-600">{metric.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-shell mt-12">
        <SectionHeading eyebrow="Explora" title="Temas que más ayudan a familias y educadores" />
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <Link key={category} href="/articulos" className="link-pill">
              {category}
            </Link>
          ))}
        </div>
      </section>

      <section className="container-shell mt-12">
        <SectionHeading
          eyebrow="Lo nuevo"
          title="Artículos que aportan valor y claridad"
          description="Pensados para volver, compartir y guardar como referencia útil."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {featuredArticles.map((article) => (
            <article key={article.title} className="section-shell overflow-hidden p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="soft-label">{article.category}</span>
                <span className="text-xs text-stone-500">{article.readTime}</span>
              </div>
              <h3 className="text-xl font-semibold text-stone-900">{article.title}</h3>
              <p className="mt-3 text-sm leading-6 text-stone-600">{article.description}</p>
              <Link href="/articulos" className="mt-5 inline-flex text-sm font-semibold text-[#7a4a35]">
                Leer artículo →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="container-shell mt-12">
        <SectionHeading
          eyebrow="Recursos gratuitos"
          title="Material útil para descargar y volver a usar"
        />
        <div className="grid gap-5 md:grid-cols-3">
          {resources.map((resource) => (
            <article key={resource.title} className="section-shell p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="soft-label">{resource.category}</span>
                <span className="text-xs font-medium text-stone-500">{resource.label}</span>
              </div>
              <div className="text-xs uppercase tracking-[0.18em] text-stone-500">{resource.type}</div>
              <h3 className="mt-3 text-xl font-semibold text-stone-900">{resource.title}</h3>
              <p className="mt-3 text-sm leading-6 text-stone-600">{resource.description}</p>
              <Link href="/recursos" className="mt-5 inline-flex text-sm font-semibold text-[#7a4a35]">
                Ver recurso →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="container-shell mt-12">
        <SectionHeading eyebrow="Herramientas" title="Ayudas prácticas para organizar la vida cotidiana" />
        <div className="grid gap-5 md:grid-cols-2">
          {toolHighlights.map((tool) => (
            <div key={tool.title} className="section-shell p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f0d2c1] text-xl">
                ✦
              </div>
              <h3 className="text-xl font-semibold text-stone-900">{tool.title}</h3>
              <p className="mt-3 text-sm leading-6 text-stone-600">{tool.description}</p>
              <Link href="/herramientas" className="mt-5 inline-flex text-sm font-semibold text-[#7a4a35]">
                {tool.cta} →
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="container-shell mt-12">
        <NewsletterBox />
      </section>

      <section className="container-shell mt-12">
        <SectionHeading eyebrow="Productos" title="Herramientas y recursos pensados para familias reales" />
        <div className="grid gap-5 md:grid-cols-3">
          {productCards.map((product) => (
            <article key={product.title} className="section-shell p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="soft-label">{product.tag}</span>
                <span className="text-sm font-semibold text-stone-800">{product.price}</span>
              </div>
              <h3 className="text-xl font-semibold text-stone-900">{product.title}</h3>
              <Link href="/tienda" className="mt-5 inline-flex text-sm font-semibold text-[#7a4a35]">
                Ver producto →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="container-shell mt-12">
        <div className="section-shell bg-[#1d1b1a] p-8 text-white sm:p-10">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="soft-label border-white/20 bg-white/5 text-white">Únete</span>
              <h3 className="mt-4 text-3xl font-semibold tracking-tight">Haz que tu día sea un poco más claro.</h3>
            </div>
            <Link href="/registro" className="primary-button bg-white text-[#201913] hover:bg-stone-100">
              Crear cuenta gratuita
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
