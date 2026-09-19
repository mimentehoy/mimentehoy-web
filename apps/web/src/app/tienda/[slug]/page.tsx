import Link from "next/link";
import { notFound } from "next/navigation";
import { productCards } from "@/data/site";
import { getShopifyProductUrl } from "@/lib/shopify";

export function generateStaticParams() {
  return productCards.map((product) => ({ slug: product.slug }));
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

  const isFreeResource = product.price === "Gratis" || product.slug === "guia-gratuita-para-empezar-con-calma";

  return (
    <main className="container-shell py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <Link href="/tienda" className="text-sm font-medium text-[#0f7290]">
          ← Volver a la tienda
        </Link>

        <div className="mt-6 section-shell p-6 sm:p-8">
          <div className="mb-4 flex items-center justify-between">
            <span className="soft-label">{product.tag}</span>
            <span className="text-sm font-semibold text-stone-800">{product.price}</span>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">{product.title}</h1>

          <p className="mt-4 text-base leading-7 text-stone-600">
            Un recurso pensado para acompañar la vida real de familias, educadores y personas que quieren más claridad,
            previsibilidad y herramientas útiles.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {isFreeResource ? (
              <Link href="/recursos/guia-gratuita-para-empezar-con-calma" className="primary-button">
                Ver recurso gratis
              </Link>
            ) : (
              <a href={getShopifyProductUrl(product.slug)} className="primary-button" target="_blank" rel="noreferrer">
                Comprar en Shopify
              </a>
            )}
            <Link href="/newsletter" className="secondary-button">
              Recibir más recursos
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
