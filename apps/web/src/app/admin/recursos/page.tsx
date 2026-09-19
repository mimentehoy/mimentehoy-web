import Link from "next/link";
import { cookies } from "next/headers";
import { AdminAccessGate } from "@/components/auth-shell";
import { AdminResourcesList } from "@/components/admin-resources-list";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";
import { getResources } from "@/lib/content";

export default async function AdminRecursosPage() {
  const cookieStore = await cookies();
  const session = verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
  const items = session?.role === "ADMIN" ? await getResources({ includeDrafts: true }) : [];

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

        <div className="mt-8">
          <AdminResourcesList items={items} />
        </div>
      </main>
    </AdminAccessGate>
  );
}
