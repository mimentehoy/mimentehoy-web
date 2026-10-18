import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { productCards } from "@/data/site";

export function generateStaticParams() {
  return productCards.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = productCards.find((item) => item.slug === slug);
  if (!product) return {};
  return {
    title: `${product.title} | Tienda MIMENTEHOY`,
    description: product.summary,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = productCards.find((item) => item.slug === slug);

  if (!product) {
    notFound();
  }

  const companion = product.companionSlug
    ? productCards.find((item) => item.slug === product.companionSlug)
    : undefined;

  return (
    <main className="container-shell py-8 sm:py-14 pb-28 sm:pb-14">
      <div className="mx-auto max-w-4xl">
        <Link href="/tienda" className="text-sm font-medium text-[#0f7290]">
          ← Volver a la tienda
        </Link>

        <div className="mt-5 section-shell grid gap-6 p-5 sm:p-8 md:grid-cols-[minmax(0,320px)_1fr]">
          <div className="relative mx-auto w-full max-w-[280px] overflow-hidden rounded-2xl bg-stone-100 md:max-w-none">
            <img src={product.image} alt={`Portada de ${product.title}`} className="aspect-[3/4] w-full object-cover" />
            {product.isNew && (
              <span className="absolute left-3 top-3 rounded-full bg-[#ed4a6f] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                Nuevo
              </span>
            )}
          </div>

          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="soft-label">
                {product.tag} · {product.topic}
              </span>
              <span className="ml-auto text-2xl font-bold text-[#001733]">{product.price}</span>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">{product.title}</h1>
            <p className="mt-2 text-base text-stone-500">{product.subtitle}</p>

            <div className="mt-5 space-y-3 text-base leading-7 text-stone-600">
              {product.description.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <h2 className="mt-6 text-sm font-semibold uppercase tracking-[0.12em] text-stone-900">Qué incluye</h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-stone-700">
              {product.includes.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p className="mt-5 text-sm font-medium text-stone-700">{product.format}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a href={product.shopifyUrl} className="primary-button" target="_blank" rel="noreferrer">
                Comprar por {product.price}
              </a>
              <Link href="/newsletter" className="secondary-button">
                Recibir recursos gratis
              </Link>
            </div>
            <p className="mt-3 text-xs text-stone-500">Pago seguro en Shopify. Descarga inmediata tras la compra.</p>
          </div>
        </div>

        {companion && (
          <section className="mt-10">
            <h2 className="mb-4 text-xl font-semibold tracking-tight text-stone-900">Complemento recomendado</h2>
            <div className="max-w-md">
              <ProductCard product={companion} compact />
            </div>
          </section>
        )}
      </div>

      {/* Mobile: buy button always within thumb reach */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#dfeaf0] bg-white/95 p-3 backdrop-blur-md sm:hidden print:hidden">
        <a
          href={product.shopifyUrl}
          target="_blank"
          rel="noreferrer"
          className="primary-button w-full !py-3.5"
        >
          Comprar ahora · {product.price}
        </a>
      </div>
    </main>
  );
}
