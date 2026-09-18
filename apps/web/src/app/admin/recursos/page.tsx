import Link from "next/link";

const items = [
  { title: "Checklist de inicio de semana", type: "PDF", status: "Publicado" },
  { title: "Mini guía de sueño", type: "Imprimible", status: "Borrador" },
  { title: "Tarjetas de emociones", type: "Visual", status: "Publicado" },
];

export default function AdminRecursosPage() {
  return (
    <main className="container-shell py-10 sm:py-14">
      <div className="flex items-center justify-between gap-3">
        <div>
          <span className="soft-label">Admin / Recursos</span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-900">Gestión de recursos</h1>
        </div>
        <Link href="/admin" className="secondary-button">Volver</Link>
      </div>

      <div className="mt-8 space-y-4">
        {items.map((item) => (
          <article key={item.title} className="section-shell p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.14em] text-stone-500">{item.type}</div>
                <h2 className="mt-2 text-xl font-semibold text-stone-900">{item.title}</h2>
              </div>
              <span className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs text-stone-700">{item.status}</span>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
