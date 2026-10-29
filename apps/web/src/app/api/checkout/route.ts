import { NextResponse, type NextRequest } from "next/server";
import { productoPago } from "@/lib/productos-pago";
import { siteUrl, stripeApi, stripeConfigurado, type SesionCheckout } from "@/lib/stripe";
import { shopifyStoreUrl } from "@/data/site";

// Recibe el formulario del botón "Comprar" y manda al cliente al pago seguro de Stripe.
// Si Stripe aún no está configurado (o falla), redirige a Shopify para no perder la venta.
export async function POST(req: NextRequest) {
  const datos = await req.formData();
  const producto = productoPago(String(datos.get("producto") || ""));

  if (!producto) return NextResponse.redirect(new URL("/tienda", req.url), 303);
  if (!stripeConfigurado()) return NextResponse.redirect(producto.shopifyUrl || shopifyStoreUrl, 303);

  const site = siteUrl();
  try {
    const sesion = await stripeApi<SesionCheckout>("/checkout/sessions", {
      mode: "payment",
      locale: "es",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: producto.centimos,
            product_data: { name: producto.nombre },
          },
        },
      ],
      metadata: { producto: producto.slug },
      payment_intent_data: { metadata: { producto: producto.slug } },
      allow_promotion_codes: true,
      // Pago estándar de Stripe (1,5 % + 0,25 €). Managed Payments añade un 3,5 % extra por venta.
      managed_payments: { enabled: false },
      // Contenido digital: aviso de pérdida del derecho de desistimiento (LGDCU art. 103.m)
      custom_text: {
        submit: {
          message:
            "Al pagar aceptas que la descarga del contenido digital empiece de inmediato y que, por ello, pierdes el derecho de desistimiento.",
        },
      },
      success_url: `${site}/gracias?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site}/tienda/${producto.slug}`,
    });
    return NextResponse.redirect(sesion.url!, 303);
  } catch (e) {
    console.error("[checkout]", e);
    return NextResponse.redirect(producto.shopifyUrl || shopifyStoreUrl, 303);
  }
}
