import fs from "fs";
import path from "path";
import Link from "next/link";

const readArticles = () => {
  const file = path.join(process.cwd(), "data", "articles.json");
  if (!fs.existsSync(file)) return [];
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return [];
  }
};

export default function AdminArticulosPage() {
  const articles = readArticles();

  return (
    <main className="container-shell py-10 sm:py-14">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="soft-label">Admin / Artículos</span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-900">CMS básico</h1>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/articulos/nuevo" className="primary-button">Nuevo artículo</Link>
          <Link href="/admin" className="secondary-button">Volver</Link>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {articles.length === 0 ? (
          <div className="section-shell p-6 text-stone-600">Todavía no hay artículos. Crea el primero.</div>
        ) : (
          articles.map((article: any) => (
            <article key={article.id} className="section-shell p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="soft-label">{article.category}</span>
                    <span className="text-xs uppercase tracking-[0.14em] text-stone-500">{article.status}</span>
                  </div>
                  <h2 className="mt-3 text-xl font-semibold text-stone-900">{article.title}</h2>
                  <p className="mt-2 text-sm text-stone-600">{article.description}</p>
                </div>
                <div className="text-sm text-stone-500">{article.date}</div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {article.tags?.map((tag: string) => (
                  <span key={tag} className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs text-stone-600">{tag}</span>
                ))}
              </div>
            </article>
          ))
        )}
      </div>
    </main>
  );
}
