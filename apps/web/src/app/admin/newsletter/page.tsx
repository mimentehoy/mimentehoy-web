import Link from "next/link";

export default function AdminNewsletterPage() {
  return (
    <main className="container-shell py-10 sm:py-14">
      <div className="flex items-center justify-between gap-3">
        <div>
          <span className="soft-label">Admin / Newsletter</span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-900">Newsletter</h1>
        </div>
        <Link href="/admin" className="secondary-button">Volver</Link>
      </div>

      <div className="mt-8 section-shell p-6">
        <p className="text-sm leading-6 text-stone-600">Sección lista para gestionar campañas, edición semanal y listados de suscriptores.</p>
      </div>
    </main>
  );
}
