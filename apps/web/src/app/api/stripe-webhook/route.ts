import { NextResponse, type NextRequest } from "next/server";
import { productoPago } from "@/lib/productos-pago";
import { firmaWebhookValida, siteUrl, type SesionCheckout } from "@/lib/stripe";

// OPCIONAL: envía al comprador un email con su enlace de descarga (por si cierra la pestaña
// antes de volver a la web). Usa Resend (plan gratis: 3.000 emails/mes).
// Sin STRIPE_WEBHOOK_SECRET y RESEND_API_KEY no hace nada.
export async function POST(req: NextRequest) {
  const secreto = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secreto) return NextResponse.json({ ok: true });

  const cuerpo = await req.text();
  if (!firmaWebhookValida(cuerpo, req.headers.get("stripe-signature") || "", secreto)) {
    return NextResponse.json({ error: "Firma no válida" }, { status: 400 });
  }

  const evento = JSON.parse(cuerpo) as { type: string; data: { object: SesionCheckout } };
  if (evento.type === "checkout.session.completed") {
    const s = evento.data.object;
    const email = s.customer_details?.email;
    const producto = productoPago(s.metadata?.producto);
    if (s.payment_status === "paid" && email && producto && process.env.RESEND_API_KEY) {
      const enlace = `${siteUrl()}/gracias?session_id=${s.id}`;
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || "MIMENTEHOY <hola@mimentehoy.com>",
          to: email,
          subject: `Tu descarga: ${producto.nombre}`,
          html: `
            <p>¡Gracias por tu compra!</p>
            <p>Aquí tienes <strong>${producto.nombre}</strong>. Puedes descargarlo cuando quieras desde este enlace:</p>
            <p><a href="${enlace}" style="display:inline-block;padding:12px 20px;background:#2f6f8f;color:#fff;border-radius:10px;text-decoration:none">Descargar</a></p>
            <p>Guarda este correo: el enlace sigue funcionando más adelante.</p>
            <p>Un abrazo,<br>MIMENTEHOY</p>`,
        }),
      });
      if (!res.ok) console.error("[webhook] Resend", res.status, await res.text());
    }
  }

  return NextResponse.json({ recibido: true });
}
