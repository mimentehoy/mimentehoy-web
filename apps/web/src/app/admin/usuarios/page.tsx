import Link from "next/link";
import { AdminAccessGate } from "@/components/auth-shell";

const users = [
  { name: "Ana García", role: "Familia", status: "Activo", email: "ana@mimentehoy.com" },
  { name: "Admin MIMENTEHOY", role: "Administrador", status: "Activo", email: "admin@mimentehoy.com" },
  { name: "Sofía Rojas", role: "Educadora", status: "Pendiente", email: "sofia@example.com" },
];

export default function AdminUsuariosPage() {
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
          {users.map((user) => (
            <div key={user.email} className="section-shell flex items-center justify-between gap-3 p-5">
              <div>
                <div className="text-lg font-semibold text-stone-900">{user.name}</div>
                <div className="text-sm text-stone-600">{user.role}</div>
                <div className="text-xs text-stone-500">{user.email}</div>
              </div>
              <span className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs text-stone-700">{user.status}</span>
            </div>
          ))}
        </div>
      </main>
    </AdminAccessGate>
  );
}
