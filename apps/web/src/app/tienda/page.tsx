import Link from "next/link";
import Image from "next/image";
import { SectionHeading } from "@/components/section-heading";
import { productCards } from "@/data/site";
import { getShopifyProducts } from "@/lib/shopify";

export const revalidate = 300;

export default async function TiendaPage() {
  const shopifyProducts = await getShopifyProducts();

  // Falls back to the static placeholder list until SHOPIFY_STORE_DOMAIN +
  // SHOPIFY_STOREFRONT_ACCESS_TOKEN are set — same pattern as the rest of
  // the app's optional integrations.
  const products =
    shopifyProducts && shopifyProducts.length > 0
      ? shopifyProducts.map((product) => ({
          title: product.title,
          slug: product.handle,
          price: Number(product.price) === 0 ? "Gratis" : `${product.price} ${product.currency}`,
          tag: product.tag,
          description: product.description,
          image: product.image,
        }))
      : productCards.map((product) => ({ ...product, description: null }));

  return (
    <main className="container-shell py-10 sm:py-14">
      <SectionHeading
        eyebrow="Tienda"
        title="Productos MIMENTEHOY"
        description="La tienda se integra visualmente con la marca y redirige al checkout de Shopify."
      />

      <div className="grid gap-5 md:grid-cols-3">
        {products.map((product) => (
          <article key={product.slug} className="section-shell p-5">
            {product.image && (
              <div className="relative mb-4 aspect-[3/4] overflow-hidden rounded-2xl bg-stone-100">
                <Image src={product.image} alt={product.title} fill className="object-contain" sizes="(min-width: 768px) 33vw, 100vw" />
              </div>
            )}
            <div className="mb-4 flex items-center justify-between">
              <span className="soft-label">{product.tag}</span>
              <span className="text-sm font-semibold text-stone-800">{product.price}</span>
            </div>
            <h2 className="text-2xl font-semibold text-stone-900">{product.title}</h2>
            <p className="mt-3 text-sm leading-6 text-stone-600">
              {product.description ||
                "Producto diseñado para apoyar familias, rutinas, educación y neurodivergencia con soluciones concretas."}
            </p>
            <Link href={`/tienda/${product.slug}`} className="mt-5 inline-flex text-sm font-semibold text-[#7a4a35]">
              Ver producto →
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
