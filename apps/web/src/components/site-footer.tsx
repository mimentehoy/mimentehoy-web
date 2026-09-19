import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-stone-200 bg-stone-100/80">
      <div className="container-shell py-10">
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
              MIMENTEHOY
            </div>
            <p className="max-w-sm text-sm leading-6 text-stone-600">
              Información útil, recursos prácticos y apoyo para familias, crianza, TDAH y neurodivergencia.
            </p>
          </div>

          <div>
            <div className="mb-3 text-sm font-semibold text-stone-900">Explorar</div>
            <ul className="space-y-2 text-sm text-stone-600">
              <li><Link href="/articulos">Artículos</Link></li>
              <li><Link href="/recursos">Recursos</Link></li>
              <li><Link href="/herramientas">Herramientas</Link></li>
              <li><Link href="/newsletter">Newsletter</Link></li>
            </ul>
          </div>

          <div>
            <div className="mb-3 text-sm font-semibold text-stone-900">Cuenta</div>
            <ul className="space-y-2 text-sm text-stone-600">
              <li><Link href="/registro">Registro</Link></li>
              <li><Link href="/login">Login</Link></li>
              <li><Link href="/mi-mimentehoy">Mi MIMENTEHOY</Link></li>
              <li><Link href="/admin">Admin</Link></li>
            </ul>
          </div>

          <div>
            <div className="mb-3 text-sm font-semibold text-stone-900">Más</div>
            <ul className="space-y-2 text-sm text-stone-600">
              <li><Link href="/tienda">Tienda</Link></li>
              <li><Link href="/tienda">Productos</Link></li>
              <li><Link href="/newsletter">Suscribirse</Link></li>
              <li><Link href="/newsletter/baja">Darme de baja</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-stone-200 pt-5 text-sm text-stone-500">
          © 2026 MIMENTEHOY. Contenido informativo y educativo.
        </div>
      </div>
    </footer>
  );
}
