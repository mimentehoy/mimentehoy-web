import Link from "next/link";

const users = [
  { name: "Ana", role: "Padre", status: "Activo" },
  { name: "Luis", role: "Profesor", status: "Activo" },
  { name: "Sofía", role: "Familia", status: "Pendiente" },
];

export default function AdminUsuariosPage() {
  return (
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
          <div key={user.name} className="section-shell p-5 flex items-center justify-between gap-3">
            <div>
              <div className="text-lg font-semibold text-stone-900">{user.name}</div>
              <div className="text-sm text-stone-600">{user.role}</div>
            </div>
            <span className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs text-stone-700">{user.status}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
