import Link from "next/link";
import { cookies } from "next/headers";
import { AdminAccessGate } from "@/components/auth-shell";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";
import { prisma } from "@/lib/db";

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
};

export default async function AdminUsuariosPage() {
  const cookieStore = await cookies();
  const session = verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
  const isAdmin = session?.role === "ADMIN";

  let users: UserRow[] = [];
  let dbUnavailable = false;

  if (isAdmin && process.env.DATABASE_URL) {
    try {
      users = await prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      });
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

        <div className="mt-8 space-y-4">
          {dbUnavailable && (
            <div className="section-shell p-6 text-stone-600">No se pudo conectar con la base de datos.</div>
          )}
          {!dbUnavailable && users.length === 0 && (
            <div className="section-shell p-6 text-stone-600">Todavía no hay usuarios registrados.</div>
          )}
          {users.map((user) => (
            <div key={user.id} className="section-shell flex items-center justify-between gap-3 p-5">
              <div>
                <div className="text-lg font-semibold text-stone-900">{user.name}</div>
                <div className="text-sm text-stone-600">{user.role === "ADMIN" ? "Administrador" : "Usuario"}</div>
                <div className="text-xs text-stone-500">{user.email}</div>
              </div>
              <span className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs text-stone-700">
                {user.createdAt.toISOString().slice(0, 10)}
              </span>
            </div>
          ))}
        </div>
      </main>
    </AdminAccessGate>
  );
}
