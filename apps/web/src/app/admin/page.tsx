import Link from "next/link";

const stats = [
  { label: "Artículos", value: "26" },
  { label: "Recursos", value: "14" },
  { label: "Newsletter", value: "3" },
  { label: "Usuarios", value: "182" },
];

export default function AdminPage() {
  return (
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
  );
}
