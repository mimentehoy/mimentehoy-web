// Datos de cobro y descarga de cada producto de la tienda.
// El nombre y el precio se leen de src/data/site.ts (productCards), así que si cambias
// un precio allí, Stripe cobra el precio nuevo automáticamente.
//
// "archivos" son las rutas dentro del bucket PRIVADO de Supabase Storage
// (SUPABASE_BUCKET, por defecto "productos"). Sube los ficheros con estos nombres.

import { productCards } from "@/data/site";

const ARCHIVOS: Record<string, { etiqueta: string; ruta: string }[]> = {
  "el-idioma-de-tu-hijo": [
    { etiqueta: "Libro en PDF", ruta: "el-idioma-de-tu-hijo/el-idioma-de-tu-hijo.pdf" },
    { etiqueta: "Libro en EPUB", ruta: "el-idioma-de-tu-hijo/el-idioma-de-tu-hijo.epub" },
  ],
  "kit-plantillas-el-idioma-de-tu-hijo": [
    { etiqueta: "Kit de plantillas (PDF)", ruta: "kit-plantillas-el-idioma-de-tu-hijo/kit-plantillas.pdf" },
  ],
  "no-es-que-no-quiera": [
    { etiqueta: "Libro en PDF", ruta: "no-es-que-no-quiera/no-es-que-no-quiera.pdf" },
    { etiqueta: "Libro en EPUB", ruta: "no-es-que-no-quiera/no-es-que-no-quiera.epub" },
  ],
  "kit-para-padres": [
    { etiqueta: "Kit para padres (PDF)", ruta: "kit-para-padres/kit-para-padres.pdf" },
  ],
};

export type ProductoPago = {
  slug: string;
  nombre: string;
  centimos: number;
  shopifyUrl: string;
  archivos: { etiqueta: string; ruta: string }[];
};

// "12,95 €" -> 1295
function aCentimos(precio: string) {
  const n = Number(precio.replace(/[^\d,.]/g, "").replace(/\./g, "").replace(",", "."));
  return Math.round(n * 100);
}

export function productoPago(slug: string | null | undefined): ProductoPago | null {
  const p = productCards.find((c) => c.slug === slug);
  if (!p) return null;
  const centimos = aCentimos(p.price);
  if (!Number.isFinite(centimos) || centimos < 50) return null;
  return {
    slug: p.slug,
    nombre: p.title,
    centimos,
    shopifyUrl: p.shopifyUrl,
    archivos: ARCHIVOS[p.slug] ?? [],
  };
}

export function euros(centimos: number) {
  return (centimos / 100).toLocaleString("es-ES", { style: "currency", currency: "EUR" });
}
