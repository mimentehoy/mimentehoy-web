import Link from "next/link";
import type { Metadata } from "next";
import { euros, productoPago } from "@/lib/productos-pago";
import { sesionPagada } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Gracias por tu compra",
  robots: { index: false, follow: false },
};

export default async function GraciasCompraPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const sesion = await sesionPagada(session_id);
  const producto = sesion ? productoPago(sesion.metadata?.producto) : null;

  if (!sesion || !producto) {
    return (
      <main className="container-shell py-10 sm:py-14">
        <div className="mx-auto max-w-xl section-shell p-8 text-center">
          <h1 className="text-2xl font-semibold text-stone-900">No encontramos este pedido</h1>
          <p className="mt-4 text-sm text-stone-600">
            Si acabas de pagar, espera unos segundos y recarga la página. Si sigue sin aparecer, escríbenos a{" "}
            <a className="underline" href="mailto:mimentehoy2026@gmail.com">mimentehoy2026@gmail.com</a> y te lo
            enviamos.
          </p>
          <Link href="/tienda" className="secondary-button mt-6">
            Volver a la tienda
          </Link>
        </div>
      </main>
    );
  }

  const email = sesion.customer_details?.email;

  return (
    <main className="container-shell py-10 sm:py-14">
      <div className="mx-auto max-w-xl section-shell p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
          Pago completado · {euros(sesion.amount_total ?? producto.centimos)}
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-stone-900">¡Gracias! Aquí tienes {producto.nombre}</h1>

        <div className="mt-6 flex flex-col gap-3">
          {producto.archivos.map((a, i) => (
            <a
              key={a.ruta}
              href={`/api/descarga?s=${encodeURIComponent(sesion.id)}&i=${i}`}
              className="primary-button w-full !py-3.5"
            >
              Descargar {a.etiqueta}
            </a>
          ))}
        </div>

        <p className="mt-6 text-sm text-stone-600">
          {email ? (
            <>
              El recibo de tu compra llegará a <strong>{email}</strong>.{" "}
            </>
          ) : null}
          Guarda esta página en favoritos: el enlace de descarga sigue funcionando más adelante.
        </p>
        <Link href="/tienda" className="secondary-button mt-6">
          Ver más libros y kits
        </Link>
      </div>
    </main>
  );
}
