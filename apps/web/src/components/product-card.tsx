import Link from "next/link";
import type { ProductCard as ProductCardData } from "@/data/site";

type ProductCardProps = {
  product: ProductCardData;
  compact?: boolean;
};

// Store card used on the home page and on /tienda. On mobile the card is a
// horizontal row (cover on the left) so several products fit on screen
// without endless scrolling; from `sm` up it becomes a vertical card.
export function ProductCard({ product, compact = false }: ProductCardProps) {
  return (
    <article className="section-shell flex gap-4 p-3 sm:flex-col sm:gap-0 sm:p-5">
      <Link
        href={`/tienda/${product.slug}`}
        className="relative block w-28 shrink-0 overflow-hidden rounded-2xl bg-stone-100 sm:mb-4 sm:w-full"
        aria-label={`Ver ${product.title}`}
      >
        <img
          src={product.image}
          alt={`Portada de ${product.title}`}
          className="aspect-[3/4] w-full object-cover"
          loading="lazy"
        />
        {product.isNew && (
          <span className="absolute left-2 top-2 rounded-full bg-[#ed4a6f] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
            Nuevo
          </span>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="soft-label !px-2 !py-0.5 !text-[10px]">
            {product.tag} · {product.topic}
          </span>
          <span className="ml-auto text-base font-bold text-[#001733]">{product.price}</span>
        </div>

        <h3 className="text-lg font-semibold leading-snug text-stone-900 sm:text-xl">
          <Link href={`/tienda/${product.slug}`}>{product.title}</Link>
        </h3>
        <p className="mt-1 text-sm leading-5 text-stone-500">{product.subtitle}</p>

        {!compact && (
          <p className="mt-3 hidden text-sm leading-6 text-stone-600 sm:block">{product.summary}</p>
        )}

        <div className="mt-3 flex flex-wrap gap-2 sm:mt-auto sm:pt-5">
          <a
            href={product.shopifyUrl}
            target="_blank"
            rel="noreferrer"
            className="primary-button !px-4 !py-2"
          >
            Comprar
          </a>
          <Link href={`/tienda/${product.slug}`} className="secondary-button !px-4 !py-2">
            Ver más
          </Link>
        </div>
      </div>
    </article>
  );
}
