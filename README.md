# MIMENTEHOY

MIMENTEHOY es una plataforma editorial y de comunidad orientada a contenidos sobre TDAH, autismo, crianza, salud mental, hábitos, sueño, relaciones y neurodivergencia. El objetivo es convertir la audiencia de redes sociales en una audiencia propia, ofreciendo contenido útil, recursos descargables, herramientas prácticas, newsletter y un puente hacia productos y Shopify.

## Estado actual (actualizado 2026-09-19)

- **[https://mimentehoy.com](https://mimentehoy.com) está en vivo**, con HTTPS: home, artículos, recursos (ya en Postgres real, con fallback a JSON solo si no hay `DATABASE_URL`), herramienta de rutinas visuales, newsletter, tienda (Shopify Storefront API con fallback estático), autenticación real (registro/login/roles) y panel admin con CRUD completo.
- Hosting real: **Netlify** (proyecto `mimentehoy-web`, deploy automático desde `main` en GitHub) + **Postgres gestionado por Netlify** (`@netlify/database`, ver sección "Base de datos" más abajo). Dominio comprado y DNS gestionado en **Hostinger** (`A`/`CNAME` apuntando a Netlify) — Hostinger todavía no aloja la app ni la base de datos.
- **Sin plan de hosting de Hostinger contratado.** Se verificó en vivo en hPanel que Hostinger compartido solo soporta Node.js + SSH desde el plan **Business**, y que solo ofrece **MySQL** (no PostgreSQL) — ver `docs/hostinger-deployment-checklist.md`.
- ⚠️ **Despliegues en pausa hasta el 6 de octubre de 2026** — la cuenta Free de Netlify agotó sus créditos mensuales (Usage & billing). El sitio sigue en vivo con el último deploy publicado; solo está bloqueada la publicación de cambios nuevos hasta la renovación (o una subida de plan).

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
- **Variables de entorno configuradas en Netlify**: `MAILERLITE_API_KEY`, `SESSION_SECRET` (secreto, firma las cookies de sesión). Las de Shopify no están puestas todavía — ver `.env.example` para la lista completa. `DATABASE_URL` no hace falta configurarla ahí: la inyecta automáticamente la integración de base de datos (ver abajo).
- ⚠️ **Despliegues en pausa hasta el 6 de octubre de 2026**: la cuenta Free agotó sus créditos mensuales tras un pico de deploys en un solo día. `git push origin main` sigue funcionando (el código llega a GitHub con normalidad), pero Netlify no reconstruirá hasta la renovación o una subida de plan. Revisar Team settings → Usage & billing antes de asumir que un push se ha publicado.

Para desplegar cambios (cuando los créditos lo permitan): `git push origin main` y Netlify reconstruye solo.

## Base de datos (Postgres en Netlify)

- **Producción**: Postgres gestionado por Netlify (`@netlify/database`, plan gratuito), creado desde el dashboard del proyecto → Database. La cadena de conexión (`NETLIFY_DB_URL`) la inyecta Netlify automáticamente en build y runtime — **nunca la hemos visto ni la hemos puesto en ningún sitio**; `apps/web/src/lib/db.ts` hace `DATABASE_URL = DATABASE_URL || NETLIFY_DB_URL` para que Prisma siga leyendo el nombre de variable de siempre.
- **Cliente de Prisma**: se genera en `apps/web/src/generated/prisma` (no en `node_modules/@prisma/client`, que es el sitio por defecto). Esto es deliberado — hay un `package.json` duplicado que existía en la raíz del monorepo (ya eliminado) que hacía que `prisma generate` escribiera en un `node_modules` distinto según qué hubiera instalado en cada sitio, lo que rompió producción varias veces seguidas el 19 de septiembre de 2026 con `Cannot find module '.prisma/client/default'`. Una ruta de salida explícita (`generator client { output = "..." }` en `prisma/schema.prisma`) elimina esa ambigüedad para siempre — es el enfoque que recomienda el propio Prisma para monorepos. `apps/web/src/generated/` está en `.gitignore`: se regenera en cada build, nunca se commitea.
- **Build**: `npm run build` ejecuta, en orden, `db:generate` (regenera el cliente) → `db:push` (`prisma db push`, sincroniza el esquema con la base de datos real) → `db:seed` (importa `data/articles.json`/`data/resources.json` la primera vez, solo si el slug no existe ya — nunca sobrescribe ediciones hechas desde `/admin`) → `next build`.
- **Desarrollo local**: sin `DATABASE_URL` en `.env.local`, la app cae automáticamente al fallback JSON (artículos/recursos) o devuelve "no configurada" (auth, `/db-status`). Para desarrollar contra una base de datos real, apunta `DATABASE_URL` a tu propio Postgres y ejecuta `npm run db:push` manualmente desde `apps/web`.
