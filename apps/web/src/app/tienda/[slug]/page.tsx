import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { productCards } from "@/data/site";
import { getShopifyProductByHandle, getShopifyProducts, getShopifyProductUrl } from "@/lib/shopify";

export async function generateStaticParams() {
  const shopifyProducts = await getShopifyProducts();
  if (shopifyProducts && shopifyProducts.length > 0) {
    return shopifyProducts.map((product) => ({ slug: product.handle }));
  }
  return productCards.map((product) => ({ slug: product.slug }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const shopifyProduct = await getShopifyProductByHandle(slug);
  const staticProduct = productCards.find((item) => item.slug === slug);

  if (!shopifyProduct && !staticProduct) {
    notFound();
  }

  const product = shopifyProduct
    ? {
        title: shopifyProduct.title,
        tag: shopifyProduct.tag,
        price: Number(shopifyProduct.price) === 0 ? "Gratis" : `${shopifyProduct.price} ${shopifyProduct.currency}`,
        description: shopifyProduct.description,
        image: shopifyProduct.image,
        checkoutUrl: shopifyProduct.productUrl,
      }
    : {
        title: staticProduct!.title,
        tag: staticProduct!.tag,
        price: staticProduct!.price,
        description:
          "Un recurso pensado para acompañar la vida real de familias, educadores y personas que quieren más claridad, previsibilidad y herramientas útiles.",
        image: null as string | null,
        checkoutUrl: getShopifyProductUrl(staticProduct!.slug),
      };

  const isFreeResource = product.price === "Gratis" || slug === "guia-gratuita-para-empezar-con-calma";

  return (
    <main className="container-shell py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <Link href="/tienda" className="text-sm font-medium text-[#0f7290]">
          ← Volver a la tienda
        </Link>

        <div className="mt-6 section-shell p-6 sm:p-8">
          {product.image && (
            <div className="relative mb-6 aspect-[16/9] overflow-hidden rounded-2xl bg-stone-100">
              <Image src={product.image} alt={product.title} fill className="object-cover" sizes="(min-width: 768px) 768px, 100vw" />
            </div>
          )}

          <div className="mb-4 flex items-center justify-between">
            <span className="soft-label">{product.tag}</span>
            <span className="text-sm font-semibold text-stone-800">{product.price}</span>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">{product.title}</h1>

          <p className="mt-4 text-base leading-7 text-stone-600">{product.description}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            {isFreeResource ? (
              <Link href="/recursos/guia-gratuita-para-empezar-con-calma" className="primary-button">
                Ver recurso gratis
              </Link>
            ) : (
              <a href={product.checkoutUrl} className="primary-button" target="_blank" rel="noreferrer">
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
