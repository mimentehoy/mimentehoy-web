# MIMENTEHOY

MIMENTEHOY es una plataforma editorial y de comunidad orientada a contenidos sobre TDAH, autismo, crianza, salud mental, hábitos, sueño, relaciones y neurodivergencia. El objetivo es convertir la audiencia de redes sociales en una audiencia propia, ofreciendo contenido útil, recursos descargables, herramientas prácticas, newsletter y un puente hacia productos y Shopify.

## Estado actual

- Fase 0: auditoría, arquitectura y planificación inicial.
- El repositorio está vacío y no hay código previo en este proyecto.
- La arquitectura definitiva dependerá de la configuración real del hosting de Hostinger.

## Recomendación técnica inicial

Si el plan de Hostinger permite:

- Node.js
- SSH
- PostgreSQL o MySQL
- Git deployment
- cron jobs
- variables de entorno
- almacenamiento y backups

la opción recomendada para la V1 es:

- Next.js 14+ con App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- Autenticación con NextAuth o Auth.js
- PostgreSQL como base de datos principal
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

## Deploy en Netlify y configuración de MailerLite (rápido)

Pasos que se han automatizado en el repositorio y cómo usarlo:

1) Conectar el repositorio GitHub a Netlify y crear un sitio usando la carpeta `apps/web` como "Base directory" (si Netlify te pide un subdirectorio). Opciones de build:
   - Build command: `npm run build`
   - Publish directory: `out`
   - Node version: 20 (ya configurado en `netlify.toml`)

2) El repositorio incluye una Netlify Function preparada para reenviar suscriptores a MailerLite. Antes de ejecutar el primer deploy, añade en Netlify (Site → Settings → Build & deploy → Environment)
   la variable de entorno:
   - `MAILERLITE_API_KEY` = tu_clave_de_mailerlite

   Nota: la clave no debe almacenarse en el repositorio. También puedes usar `MAILERLITE_TOKEN` si tu clave usa ese nombre.

3) En el build se ejecuta un paso previo (`prebuild`) que copia la función desde `src/mailerLiteSubscribeFunction.js` a `netlify/functions/mailerLiteSubscribe.js`. Netlify construirá y desplegará la función automáticamente.

4) El formulario de newsletter en la web realiza dos acciones al enviar:
   - POST a `/` (mantiene la compatibilidad con Netlify Forms si quieres activarlo)
   - POST a `/.netlify/functions/mailerLiteSubscribe` para que MailerLite reciba el suscriptor inmediatamente.

5) Para probar:
   - Despliega a Netlify.
   - Envía una suscripción de prueba desde la página (usa una dirección de email de prueba).
   - Comprueba en Netlify (Site → Functions) que `mailerLiteSubscribe` existe y en Netlify Logs que se ejecutó.
   - Comprueba en MailerLite si aparece el nuevo suscriptor.

6) Alternativa/backup: si no quieres usar MailerLite todavía, deja `MAILERLITE_API_KEY` vacío: el formulario seguirá funcionando como Netlify Form (si activas Forms en Netlify) y el comportamiento no se romperá.

---

Si quieres, continuo y:
- Conecto el repo a Netlify por ti (necesitarás autorizar la conexión OAuth en Netlify/GitHub), o
- Te doy los pasos exactos con capturas para que lo conectes tú y lo probemos.

Dime cuál prefieres.
