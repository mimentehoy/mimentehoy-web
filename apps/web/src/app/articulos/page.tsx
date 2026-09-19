import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { getArticles } from "@/lib/content";

export default function ArticulosPage() {
  const articles = getArticles();

  return (
    <main className="container-shell py-10 sm:py-14">
      <SectionHeading
        eyebrow="Artículos"
        title="Contenido que ayuda a comprender y acompañar"
        description="Claridad, calma y herramientas útiles para la vida diaria."
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {articles.map((article) => (
          <article key={article.slug} className="section-shell p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="soft-label">{article.category}</span>
              <span className="text-xs text-stone-500">{article.date}</span>
            </div>
            <h2 className="text-2xl font-semibold text-stone-900">{article.title}</h2>
            <p className="mt-3 text-sm leading-6 text-stone-600">{article.description}</p>
            <Link href={`/articulos/${article.slug}`} className="mt-5 inline-flex text-sm font-semibold text-[#7a4a35]">
              Leer artículo →
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
