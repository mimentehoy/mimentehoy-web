import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { productCards } from "@/data/site";

export default function TiendaPage() {
  return (
    <main className="container-shell py-10 sm:py-14">
      <SectionHeading
        eyebrow="Tienda"
        title="Productos MIMENTEHOY"
        description="La tienda se integra visualmente con la marca y redirige al checkout de Shopify."
      />

      <div className="grid gap-5 md:grid-cols-3">
        {productCards.map((product) => (
          <article key={product.title} className="section-shell p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="soft-label">{product.tag}</span>
              <span className="text-sm font-semibold text-stone-800">{product.price}</span>
            </div>
            <h2 className="text-2xl font-semibold text-stone-900">{product.title}</h2>
            <p className="mt-3 text-sm leading-6 text-stone-600">
              Producto diseñado para apoyar familias, rutinas, educación y neurodivergencia con soluciones concretas.
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
