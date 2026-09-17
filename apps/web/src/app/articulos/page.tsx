import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { featuredArticles } from "@/data/site";

export default function ArticulosPage() {
  return (
    <main className="container-shell py-10 sm:py-14">
      <SectionHeading
        eyebrow="Artículos"
        title="Contenido que ayuda a comprender y acompañar"
        description="Claridad, calma y herramientas útiles para la vida diaria."
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {featuredArticles.map((article) => (
          <article key={article.title} className="section-shell p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="soft-label">{article.category}</span>
              <span className="text-xs text-stone-500">{article.readTime}</span>
            </div>
            <h2 className="text-2xl font-semibold text-stone-900">{article.title}</h2>
            <p className="mt-3 text-sm leading-6 text-stone-600">{article.description}</p>
            <Link href="/articulos/slug-demo" className="mt-5 inline-flex text-sm font-semibold text-[#7a4a35]">
              Leer artículo →
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
