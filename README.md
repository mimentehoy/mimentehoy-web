# MIMENTEHOY

MIMENTEHOY es una plataforma editorial y de comunidad orientada a contenidos sobre TDAH, autismo, crianza, salud mental, hábitos, sueño, relaciones y neurodivergencia. El objetivo es convertir la audiencia de redes sociales en una audiencia propia, ofreciendo contenido útil, recursos descargables, herramientas prácticas, newsletter y un puente hacia productos y Shopify.

## Estado actual (actualizado 2026-09-19)

- **[https://mimentehoy.com](https://mimentehoy.com) está en vivo**, con HTTPS: home, artículos, recursos, herramienta de rutinas visuales, newsletter, tienda (Shopify Storefront API con fallback estático) y panel admin básico, sobre un fallback JSON.
- Hosting real: **Netlify** (proyecto `mimentehoy-web`, deploy automático desde `main` en GitHub). Dominio comprado y DNS gestionado en **Hostinger** (`A`/`CNAME` apuntando a Netlify) — Hostinger todavía no aloja la app en sí.
- **Sin plan de hosting de Hostinger contratado.** Se verificó en vivo en hPanel que Hostinger compartido solo soporta Node.js + SSH desde el plan **Business**, y que solo ofrece **MySQL** (no PostgreSQL) — ver `docs/hostinger-deployment-checklist.md`.

## Recomendación técnica (confirmada)

Plan de hosting recomendado cuando se contrate: **Business** — es el mínimo con Node.js + SSH + cron ilimitados en Hostinger compartido.

- Next.js 16 con App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- **MySQL** como base de datos principal — Hostinger compartido no ofrece PostgreSQL en ningún plan; `prisma/schema.prisma` debe migrar de `postgresql` a `mysql`
- Autenticación con NextAuth/Auth.js sobre esa base de datos (la auth actual es un prototipo local, ver `docs/architecture-overview.md`)
- Shopify como motor de ecommerce y checkout externo

Esto prioriza seguridad, SEO, velocidad, mantenibilidad y escalabilidad sin depender de servicios externos innecesarios.

## Estructura propuesta

```text
mimentehoy/
├── apps/
│   ├── web/                  # frontend público de MIMENTEHOY
│   └── admin/               # panel privado de contenido y gestión
├── packages/
│   └── ui/                  # componentes reutilizables
├── prisma/
│   └── schema.prisma        # esquema inicial de base de datos
├── docs/
│   └── architecture.md      # documentación técnica adicional
├── scripts/
│   └── ...                  # utilidades y tareas de mantenimiento
├── .env.example             # variables de entorno de ejemplo
├── .gitignore
├── PROJECT_PLAN.md          # plan completo del proyecto
├── README.md
└── package.json             # en una fase posterior, al inicializar el proyecto
```

## Ramp-up recomendado

1. Confirmar el plan concreto de Hostinger.
2. Comprobar si admite Node.js, PostgreSQL/MySQL y SSH.
3. Elegir el stack según la capacidad real del servidor.
4. Instalar la base del proyecto en Next.js.
5. Definir los modelos de contenido y usuarios.
6. Diseñar la experiencia editorial móvil-first.
7. Entrar en la V1: home, artículos, recursos, herramientas, newsletter, tienda, auth y admin.

## Variables de entorno

Se usará `.env.example` como plantilla. No se incluirán credenciales reales en el repositorio.

Ejemplo de variables esperadas:

```env
NODE_ENV=development
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="changeme"
NEXTAUTH_URL="http://localhost:3000"
SHOPIFY_STORE_DOMAIN="tu-tienda.myshopify.com"
SHOPIFY_STOREFRONT_ACCESS_TOKEN=""
ADMIN_EMAIL=""
```

## Requisitos para desarrollo

- Node.js 20 LTS
- npm o pnpm
- PostgreSQL o MySQL compatible con la instalación de Hostinger
- editor con soporte TypeScript

## Siguiente paso

Se requiere confirmar:

- plan exacto de Hostinger
- si permite Node.js y PostgreSQL/MySQL
- si hay acceso SSH y despliegue Git
- si hay dominio y acceso administrativo

Con esa información, se podrá cerrar la arquitectura final y avanzar a la siguiente fase del proyecto.

---

## Deploy en Netlify (estado real, actualizado 2026-09-19)

El sitio ya está conectado, desplegado y en dominio propio. Así queda montado:

- **Proyecto Netlify**: `mimentehoy-web`, conectado a `github.com/mimentehoy/mimentehoy-web`, deploy automático en cada push a `main`.
- **Build**: `apps/web` como base directory, `npm run build` (fuerza `next build --webpack`; Turbopack no es compatible todavía con `@netlify/plugin-nextjs`). El runtime de Next.js lo gestiona el plugin `@netlify/plugin-nextjs`, declarado en `apps/web/package.json` y `apps/web/netlify.toml` — **no** se usa `publish = "out"` (eso era de una exportación estática antigua; la app ya tiene rutas API reales y no puede exportarse como estático).
- **Dominio**: `mimentehoy.com` comprado en Hostinger, DNS también en Hostinger apuntando a Netlify:
  - `A @ → 75.2.60.5`
  - `CNAME www → mimentehoy-web.netlify.app`
  - Certificado HTTPS (Let's Encrypt) emitido automáticamente por Netlify.
- **Newsletter**: `src/app/api/newsletter/route.ts` reenvía a MailerLite directamente vía su API (variable `MAILERLITE_API_KEY` en Netlify → Environment variables) o guarda en un JSON local de fallback si no está configurada. La función independiente `netlify/functions/mailerLiteSubscribe.js` (generada desde `src/mailerLiteSubscribeFunction.js` por `copy-functions.js`) es un resto de una versión anterior — ya no la llama nada del frontend, sigue construyéndose por compatibilidad pero puede limpiarse en el futuro.
- **Variables de entorno configuradas en Netlify hoy**: solo `MAILERLITE_API_KEY`. Ni `DATABASE_URL`, ni las de Shopify, ni las de `ADMIN_*` están puestas todavía — ver `.env.example` para la lista completa y qué activa cada una.

Para desplegar cambios: `git push origin main` y Netlify reconstruye solo.
