MIMENTEHOY — Brand tokens and quick usage

Overview
--------
Estos tokens se extrajeron muestreando el logotipo que proporcionaste. Están pensados para uso inmediato en la V1 (home móvil, CTAs, recursos).

Paleta (extraída con muestreo exacto):
- brand-900 (trazo/texto): #001733
- brand-600 (acento): #009bb0

Gradient stops:
- grad-1: #009bb0
- grad-2: #17aba3
- grad-3: #f6a114
- grad-4: #fd9b10
- grad-5: #ed4a6f

Neutrals (sugeridos):
- bg: #ffffff
- bg-alt: #f7fafb
- text-700: #334155

Archivos creados
- styles/brand-tokens.css — variables CSS (:root) y ejemplo de utilidades
- styles/tailwind.theme.js — fragmento para extender tu tailwind.config.js

Guía rápida de uso
------------------
1) Importa styles/brand-tokens.css desde tu entry global (ej. app/layout.tsx o index.css). Ejemplo: `@import "./styles/brand-tokens.css";`

2) Para Tailwind: en tu tailwind.config.js fusiona/require este archivo (o copia los valores al objeto theme.extend.colors). Ejemplo simple:

// tailwind.config.js
const tailwindTheme = require('./styles/tailwind.theme.js')
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: tailwindTheme.theme.extend
  },
  plugins: []
}

3) Botones / CTA
- CTA principal: background: var(--brand-600) (#009bb0) + color: #fff; border-radius: 12px; padding 12-16px.
- CTA alternativo: usar la clase .mimentehoy-gradient con texto blanco.

Notas y siguientes pasos
------------------------
- Si quieres tonos ajustados (ej. reducir o subir luminosidad del navy) puedo aplicar pequeñas variaciones y generar un set accesible (WCAG AA/AAA) para texto/CTA.
- Puedo exportar y optimizar el logo en SVG/PNG y añadirlos en assets/logo/ si confirmas.

(Generado automáticamente: colores extraídos de la imagen del logo con muestreo. Pide ajustes si deseas otras variantes).