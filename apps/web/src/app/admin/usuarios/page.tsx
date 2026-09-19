import Link from "next/link";
import { cookies } from "next/headers";
import { AdminAccessGate } from "@/components/auth-shell";
import { AdminUsersList, type AdminUserRow } from "@/components/admin-users-list";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";
import { prisma } from "@/lib/db";

export default async function AdminUsuariosPage() {
  const cookieStore = await cookies();
  const session = verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
  const isAdmin = session?.role === "ADMIN";

  let users: AdminUserRow[] = [];
  let dbUnavailable = false;

  if (isAdmin && process.env.DATABASE_URL) {
    try {
      const rows = await prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      });
      users = rows.map((row) => ({ ...row, createdAt: row.createdAt.toISOString() }));
    } catch {
      dbUnavailable = true;
    }
  }

  return (
    <AdminAccessGate>
      <main className="container-shell py-10 sm:py-14">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="soft-label">Admin / Usuarios</span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-900">Usuarios</h1>
          </div>
          <Link href="/admin" className="secondary-button">Volver</Link>
        </div>

        <div className="mt-8">
          {dbUnavailable ? (
            <div className="section-shell p-6 text-stone-600">No se pudo conectar con la base de datos.</div>
          ) : (
            <AdminUsersList users={users} currentUserId={session?.userId ?? null} />
          )}
        </div>
      </main>
    </AdminAccessGate>
  );
}
