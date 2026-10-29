// Stripe Checkout sin SDK: llamadas REST con fetch y verificación de webhooks con node:crypto.
// Así no hace falta añadir dependencias al proyecto.
//
// Mientras STRIPE_SECRET_KEY no esté configurada, stripeConfigurado() devuelve false
// y los botones de compra siguen enviando a Shopify (ver /api/checkout).

import { createHmac, timingSafeEqual } from "node:crypto";

const API = "https://api.stripe.com/v1";

export type SesionCheckout = {
  id: string;
  url: string | null;
  payment_status: "paid" | "unpaid" | "no_payment_required";
  amount_total: number | null;
  metadata: Record<string, string> | null;
  customer_details: { email: string | null } | null;
};

export function stripeConfigurado() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function siteUrl() {
  return (process.env.SITE_URL || "https://mimentehoy.com").replace(/\/$/, "");
}

// Convierte { a: { b: [ { c: 1 } ] } } en a[b][0][c]=1, el formato que espera la API de Stripe.
function aFormulario(valor: unknown, prefijo = "", out = new URLSearchParams()) {
  if (valor === undefined || valor === null) return out;
  if (Array.isArray(valor)) {
    valor.forEach((v, i) => aFormulario(v, `${prefijo}[${i}]`, out));
  } else if (typeof valor === "object") {
    for (const [k, v] of Object.entries(valor as Record<string, unknown>)) {
      aFormulario(v, prefijo ? `${prefijo}[${k}]` : k, out);
    }
  } else {
    out.append(prefijo, String(valor));
  }
  return out;
}

export async function stripeApi<T>(ruta: string, cuerpo?: Record<string, unknown>): Promise<T> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Falta STRIPE_SECRET_KEY");
  const res = await fetch(`${API}${ruta}`, {
    method: cuerpo ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${key}`,
      ...(cuerpo ? { "Content-Type": "application/x-www-form-urlencoded" } : {}),
    },
    body: cuerpo ? aFormulario(cuerpo).toString() : undefined,
    cache: "no-store",
  });
  const datos = await res.json();
  if (!res.ok) throw new Error(`Stripe ${res.status}: ${datos?.error?.message || "error"}`);
  return datos as T;
}

// Devuelve la sesión solo si está PAGADA; si no, null.
export async function sesionPagada(sessionId: string | null | undefined) {
  if (!sessionId || !/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) return null;
  try {
    const s = await stripeApi<SesionCheckout>(`/checkout/sessions/${sessionId}`);
    return s.payment_status === "paid" ? s : null;
  } catch {
    return null;
  }
}

// Verifica la cabecera Stripe-Signature (t=...,v1=...) de un webhook.
export function firmaWebhookValida(cuerpo: string, cabecera: string, secreto: string, toleranciaSeg = 300) {
  const partes = Object.fromEntries(
    cabecera.split(",").map((p) => {
      const i = p.indexOf("=");
      return [p.slice(0, i), p.slice(i + 1)];
    }),
  ) as Record<string, string>;
  const t = Number(partes.t);
  const firmas = cabecera
    .split(",")
    .filter((p) => p.startsWith("v1="))
    .map((p) => p.slice(3));
  if (!t || firmas.length === 0) return false;
  if (Math.abs(Date.now() / 1000 - t) > toleranciaSeg) return false;
  const esperada = Buffer.from(createHmac("sha256", secreto).update(`${t}.${cuerpo}`).digest("hex"));
  return firmas.some((f) => {
    const b = Buffer.from(f);
    return b.length === esperada.length && timingSafeEqual(b, esperada);
  });
}
