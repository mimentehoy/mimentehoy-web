import { NextResponse, type NextRequest } from "next/server";
import { productoPago } from "@/lib/productos-pago";
import { sesionPagada } from "@/lib/stripe";
import { enlaceFirmado } from "@/lib/descargas";

// /api/descarga?s=<session_id>&i=<índice del archivo>
// Comprueba en Stripe que el pedido está pagado y redirige a un enlace temporal del archivo.
export async function GET(req: NextRequest) {
  const s = req.nextUrl.searchParams.get("s");
  const i = Number(req.nextUrl.searchParams.get("i") || "0");

  const sesion = await sesionPagada(s);
  if (!sesion) {
    return new NextResponse("Pedido no encontrado o no pagado.", { status: 403 });
  }

  const archivo = productoPago(sesion.metadata?.producto)?.archivos[i];
  if (!archivo) {
    return new NextResponse("Archivo no encontrado.", { status: 404 });
  }

  try {
    return NextResponse.redirect(await enlaceFirmado(archivo.ruta), 302);
  } catch (e) {
    console.error("[descarga]", e);
    return new NextResponse(
      "No se pudo preparar la descarga. Escríbenos a mimentehoy2026@gmail.com y te lo enviamos.",
      { status: 500 },
    );
  }
}
