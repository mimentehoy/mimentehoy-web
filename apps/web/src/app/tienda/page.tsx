import { SectionHeading } from "@/components/section-heading";
import { ProductCard } from "@/components/product-card";
import { productCards } from "@/data/site";

export const metadata = {
  title: "Tienda | MIMENTEHOY",
  description:
    "Libros y kits imprimibles de MIMENTEHOY para familias: autismo y TDAH. Descarga inmediata tras la compra.",
};

const topics = [
  {
    id: "autismo",
    name: "Autismo",
    intro: "Para entender y acompañar a tu hijo autista en el día a día.",
  },
  {
    id: "tdah",
    name: "TDAH",
    intro: "Para entender a tu hijo con TDAH y saber qué hacer en casa y en el colegio.",
  },
] as const;

export default function TiendaPage() {
  return (
    <main className="container-shell py-8 sm:py-14">
      <SectionHeading
        eyebrow="Tienda"
        title="Libros y kits MIMENTEHOY"
        description="Guías prácticas y plantillas imprimibles para familias. Pago seguro con tarjeta, Apple Pay o Google Pay y descarga inmediata tras la compra."
      />

      <nav className="mb-8 flex flex-wrap gap-2" aria-label="Categorías de la tienda">
        {topics.map((topic) => (
          <a key={topic.id} href={`#${topic.id}`} className="link-pill">
            {topic.name}
          </a>
        ))}
      </nav>

      <div className="space-y-12">
        {topics.map((topic) => {
          const items = productCards.filter((product) => product.topic === topic.name);
          if (items.length === 0) return null;
          return (
            <section key={topic.id} id={topic.id} className="scroll-mt-28">
              <div className="mb-4">
                <h2 className="text-xl font-semibold tracking-tight text-stone-900 sm:text-2xl">{topic.name}</h2>
                <p className="mt-1 text-sm text-stone-600">{topic.intro}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
