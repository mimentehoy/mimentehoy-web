import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container-shell py-16">
      <div className="section-shell mx-auto max-w-xl p-8 text-center">
        <span className="soft-label">404</span>
        <h1 className="mt-4 text-3xl font-semibold text-stone-900">Esta página no existe</h1>
        <p className="mt-3 text-sm text-stone-600">Puede que el enlace sea antiguo o que la página todavía esté en preparación.</p>
        <Link href="/" className="primary-button mt-6">
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
