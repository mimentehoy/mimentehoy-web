import type { ReactNode } from "react";

// Botón "Comprar": envía a /api/checkout, que abre el pago seguro de Stripe
// (o Shopify, si Stripe todavía no está configurado). Es un formulario normal,
// así que funciona en componentes de servidor y sin JavaScript.

type BuyButtonProps = {
  slug: string;
  className?: string;
  formClassName?: string;
  children: ReactNode;
};

export function BuyButton({ slug, className, formClassName, children }: BuyButtonProps) {
  return (
    <form action="/api/checkout" method="POST" className={formClassName}>
      <input type="hidden" name="producto" value={slug} />
      <button type="submit" className={`${className ?? ""} cursor-pointer`}>
        {children}
      </button>
    </form>
  );
}
