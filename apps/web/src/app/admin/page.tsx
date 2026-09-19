import fs from "fs";
import path from "path";
import Link from "next/link";
import { cookies } from "next/headers";
import { AdminAccessGate } from "@/components/auth-shell";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";
import { prisma } from "@/lib/db";

const readJsonCount = (fileName: string) => {
  const file = path.join(process.cwd(), "data", fileName);
  if (!fs.existsSync(file)) return 0;
  try {
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    return Array.isArray(data) ? data.length : 0;
  } catch {
    return 0;
  }
};

export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
  const isAdmin = session?.role === "ADMIN";

  let userCount = "—";
  if (isAdmin && process.env.DATABASE_URL) {
    try {
      userCount = String(await prisma.user.count());
    } catch {
      userCount = "—";
    }
  }

  const stats = isAdmin
    ? [
        { label: "Artículos", value: String(readJsonCount("articles.json")) },
        { label: "Recursos", value: String(readJsonCount("resources.json")) },
        { label: "Newsletter", value: String(readJsonCount("newsletter-subscribers.json")) },
        { label: "Usuarios", value: userCount },
      ]
    : [];

  return (
    <AdminAccessGate>
      <main className="container-shell py-10 sm:py-14">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="soft-label">Admin</span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-900">Panel básico</h1>
          </div>
          <Link href="/" className="secondary-button">Volver al sitio</Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="section-shell p-5">
              <div className="text-xs uppercase tracking-[0.16em] text-stone-500">{stat.label}</div>
              <div className="mt-3 text-3xl font-semibold text-stone-900">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 section-shell p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-stone-900">Acciones rápidas</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/articulos" className="primary-button">Artículos</Link>
            <Link href="/admin/recursos" className="secondary-button">Recursos</Link>
            <Link href="/admin/newsletter" className="secondary-button">Newsletter</Link>
            <Link href="/admin/usuarios" className="secondary-button">Usuarios</Link>
          </div>
        </div>
      </main>
    </AdminAccessGate>
  );
}
