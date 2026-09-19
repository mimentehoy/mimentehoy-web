import Link from "next/link";
import { cookies } from "next/headers";
import { AdminAccessGate } from "@/components/auth-shell";
import { AdminArticlesList } from "@/components/admin-articles-list";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";
import { getArticles } from "@/lib/content";

export default async function AdminArticulosPage() {
  // Drafts aren't public yet — don't read them into the server payload
  // unless the request carries a valid admin session (see admin/newsletter
  // for why this matters even though AdminAccessGate also gates rendering).
  const cookieStore = await cookies();
  const session = verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
  const articles = session?.role === "ADMIN" ? await getArticles({ includeDrafts: true }) : [];

  return (
    <AdminAccessGate>
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

        <div className="mt-8">
          <AdminArticlesList articles={articles} />
        </div>
      </main>
    </AdminAccessGate>
  );
}
