import Link from "next/link";
import { getNews } from "@/lib/noticias";
import { NewsCard } from "@/components/news-card";
import { NewsletterBox } from "@/components/newsletter-box";
import { ProductCard } from "@/components/product-card";
import { productCards } from "@/data/site";

export default function Home() {
  const latestNews = getNews().slice(0, 3);
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
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/tienda" className="primary-button">
                Ver libros y kits
              </Link>
              <a href="#newsletter" className="secondary-button">
                Recursos gratis por email
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell mt-10" aria-labelledby="tienda-home">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <span className="soft-label">Tienda</span>
            <h2 id="tienda-home" className="mt-3 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
              Libros y kits para familias
            </h2>
            <p className="mt-1 text-sm text-stone-600">Autismo y TDAH. Descarga inmediata tras la compra.</p>
          </div>
          <Link href="/tienda" className="hidden shrink-0 text-sm font-semibold text-[#0f7290] sm:inline-flex">
            Ver toda la tienda →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {productCards.map((product) => (
            <ProductCard key={product.slug} product={product} compact />
          ))}
        </div>
        <div className="mt-5 sm:hidden">
          <Link href="/tienda" className="secondary-button w-full">
            Ver toda la tienda →
          </Link>
        </div>
      </section>

      {latestNews.length > 0 && <section className="container-shell mt-14" aria-labelledby="latest-news-title">
        <div className="news-home px-5 sm:px-8">
          <div className="news-section-heading"><span className="news-eyebrow">Para leer con calma</span><h2 id="latest-news-title">Últimas noticias</h2></div>
          <div className="news-grid">{latestNews.map((article) => <NewsCard key={article.slug} article={article} />)}</div>
          <Link href="/noticias" className="news-rss">Ver todas las noticias →</Link>
        </div>
      </section>}

      <section id="newsletter" className="container-shell mt-14 scroll-mt-32">
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
