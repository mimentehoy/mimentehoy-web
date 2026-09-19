import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug, getArticles } from "@/lib/content";

export function generateStaticParams() {
  return getArticles().map((article) => ({ slug: article.slug }));
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const sections = article.content.split("\n\n").filter(Boolean);

  return (
    <main className="container-shell py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <Link href="/articulos" className="text-sm font-medium text-[#0f7290]">
          ← Volver a artículos
        </Link>

        <div className="mt-6 section-shell p-6 sm:p-8">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="soft-label">{article.category}</span>
            <span className="text-xs uppercase tracking-[0.18em] text-stone-500">{article.date}</span>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
            {article.title}
          </h1>

          <p className="mt-4 text-base leading-7 text-stone-600">{article.description}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs text-stone-700">
                #{tag}
              </span>
            ))}
          </div>

          <div className="mt-8 space-y-6 text-[1.02rem] leading-8 text-stone-700">
            {sections.map((section, index) => {
              const heading = section.startsWith("## ") ? "h2" : "p";
              const content = heading === "h2" ? section.replace(/^##\s*/, "") : section;

              if (heading === "h2") {
                return (
                  <h2 key={`${section}-${index}`} className="mt-8 text-2xl font-semibold text-stone-900">
                    {content}
                  </h2>
                );
              }

              return <p key={`${section}-${index}`}>{content}</p>;
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
