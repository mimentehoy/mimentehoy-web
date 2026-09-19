import fs from "fs";
import path from "path";
import Link from "next/link";
import { cookies } from "next/headers";
import { AdminAccessGate } from "@/components/auth-shell";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

const readResources = () => {
  const file = path.join(process.cwd(), "data", "resources.json");
  if (!fs.existsSync(file)) return [];
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return [];
  }
};

type ResourceItem = {
  title: string;
  description: string;
  type: string;
  status: string;
};

export default async function AdminRecursosPage() {
  const cookieStore = await cookies();
  const session = verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
  const items = session?.role === "ADMIN" ? (readResources() as ResourceItem[]) : [];

  return (
    <AdminAccessGate>
      <main className="container-shell py-10 sm:py-14">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="soft-label">Admin / Recursos</span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-900">Gestión de recursos</h1>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/recursos/nuevo" className="primary-button">Nuevo recurso</Link>
            <Link href="/admin" className="secondary-button">Volver</Link>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {items.length === 0 ? (
            <div className="section-shell p-6 text-stone-600">Todavía no hay recursos. Crea el primero.</div>
          ) : (
            items.map((item) => (
              <article key={item.title} className="section-shell p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-[0.14em] text-stone-500">{item.type}</div>
                    <h2 className="mt-2 text-xl font-semibold text-stone-900">{item.title}</h2>
                    <p className="mt-2 text-sm text-stone-600">{item.description}</p>
                  </div>
                  <span className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs text-stone-700">{item.status}</span>
                </div>
              </article>
            ))
          )}
        </div>
      </main>
    </AdminAccessGate>
  );
}
