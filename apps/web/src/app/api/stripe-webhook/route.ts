import { NextResponse, type NextRequest } from "next/server";
import { productoPago } from "@/lib/productos-pago";
import { firmaWebhookValida, siteUrl, type SesionCheckout } from "@/lib/stripe";

// Envía al comprador un email con su enlace de descarga cuando Stripe confirma el pago.
// Necesita STRIPE_WEBHOOK_SECRET y RESEND_API_KEY (Resend, plan gratis: 3.000 emails/mes).
// Sin ellas no hace nada.
export async function POST(req: NextRequest) {
  const secreto = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secreto) return NextResponse.json({ ok: true });

  const cuerpo = await req.text();
  if (!firmaWebhookValida(cuerpo, req.headers.get("stripe-signature") || "", secreto)) {
    return NextResponse.json({ error: "Firma no válida" }, { status: 400 });
  }

  const evento = JSON.parse(cuerpo) as { type: string; data: { object: SesionCheckout } };
  // "completed" llega al terminar el pago; con métodos que se confirman más tarde
  // (MB WAY, transferencias…) el cobro real llega en "async_payment_succeeded".
  const tipos = ["checkout.session.completed", "checkout.session.async_payment_succeeded"];
  if (!tipos.includes(evento.type)) return NextResponse.json({ recibido: true });

  const s = evento.data.object;
  const email = s.customer_details?.email;
  const producto = productoPago(s.metadata?.producto);
  if (s.payment_status !== "paid" || !email || !producto || !process.env.RESEND_API_KEY) {
    return NextResponse.json({ recibido: true });
  }

  const enlace = `${siteUrl()}/gracias?session_id=${s.id}`;
  const formatos = producto.archivos.map((a) => a.etiqueta).join(" · ");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `descarga-${s.id}`,
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || "MIMENTEHOY <hola@mimentehoy.com>",
      reply_to: process.env.EMAIL_REPLY_TO || "mimentehoy2026@gmail.com",
      to: email,
      subject: `Tu descarga: ${producto.nombre}`,
      text: `¡Gracias por tu compra!\n\nAquí tienes ${producto.nombre} (${formatos}). Descárgalo cuando quieras desde este enlace:\n${enlace}\n\nGuarda este correo: el enlace sigue funcionando más adelante.\nSi tienes cualquier problema, responde a este email.\n\nUn abrazo,\nMIMENTEHOY`,
      html: `<!doctype html><html lang="es"><body style="margin:0;padding:24px;background:#f6f3ee;font-family:Arial,Helvetica,sans-serif;color:#2d2a26">
  <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;padding:32px 28px">
    <p style="margin:0 0 4px;font-size:13px;letter-spacing:1px;text-transform:uppercase;color:#7a7268">MIMENTEHOY</p>
    <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3">¡Gracias por tu compra!</h1>
    <p style="margin:0 0 8px;font-size:16px;line-height:1.5">Aquí tienes <strong>${producto.nombre}</strong>.</p>
    <p style="margin:0 0 24px;font-size:14px;color:#7a7268">${formatos}</p>
    <p style="margin:0 0 24px"><a href="${enlace}" style="display:inline-block;padding:14px 24px;background:#2f6f8f;color:#ffffff;border-radius:10px;text-decoration:none;font-weight:bold">Descargar</a></p>
    <p style="margin:0 0 8px;font-size:14px;line-height:1.5">Guarda este correo: el enlace sigue funcionando más adelante.</p>
    <p style="margin:0 0 24px;font-size:14px;line-height:1.5">Si tienes cualquier problema, responde a este email y te ayudamos.</p>
    <p style="margin:0;font-size:14px">Un abrazo,<br>MIMENTEHOY</p>
  </div>
</body></html>`,
    }),
  });

  if (!res.ok) {
    console.error("[webhook] Resend", res.status, await res.text());
    // 500 para que Stripe reintente el aviso más tarde.
    return NextResponse.json({ error: "No se pudo enviar el email" }, { status: 500 });
  }

  return NextResponse.json({ recibido: true });
}
