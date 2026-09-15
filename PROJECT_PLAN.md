# Proyecto MIMENTEHOY — Plan inicial del ecosistema digital

## 1. Resumen ejecutivo

MIMENTEHOY nace como un ecosistema editorial y de crecimiento propio para convertir la audiencia de TikTok en una comunidad y base de usuarios con valor real. La prioridad de la V1 es validar uso, generar confianza y construir una base sólida de contenido, recursos descargables y herramientas útiles, sin caer en una web genérica de salud mental.

La estrategia es:

Valor -> Confianza -> Registro -> Recurrencia -> Comunidad -> Monetización

La V1 no debe volverse un “gran portal” con demasiadas funciones. Debe ser una experiencia mínima, rápida, premium y muy útil para móvil.

## 2. Estado de auditoría actual

- El repositorio actual está vacío.
- No hay código previo ni estructura técnica implementada.
- No se ha confirmado la configuración de Hostinger ni el plan concreto contratado.
- La arquitectura definitiva se basará en el nivel real de acceso a Node.js, bases de datos, SSH y despliegue.

## 3. Requisitos de Hostinger que necesitamos confirmar

Antes de decidir el stack final, necesitamos saber si el plan de Hostinger permite lo siguiente:

- Node.js
- SSH
- MySQL
- PostgreSQL
- despliegue Git
- aplicaciones persistentes
- cron jobs
- variables de entorno
- almacenamiento / volumen de archivos
- backups y restauración

Si se cumplen estas condiciones, la recomendación será mantener Hostinger como base principal y usar Next.js + PostgreSQL + Prisma.

Si hay una limitación importante, se documentará y se propondrá una alternativa antes de implementar.

## 4. Stack recomendado (condicional a Hostinger)

### Opción recomendada si Hostinger lo soporta

- Frontend: Next.js 14+ / App Router
- Lenguaje: TypeScript
- UI: Tailwind CSS + componentes propios
- Base de datos: PostgreSQL
- ORM: Prisma
- Autenticación: Auth.js / NextAuth
- Hosting: Hostinger con Node.js y PostgreSQL/MySQL gestionados
- Ecommerce: Shopify como checkout externo
- SEO: metadata, Open Graph, sitemap, robots, schema

### Principios de decisión

- Seguridad
- Mantenibilidad
- Velocidad
- SEO
- Escalabilidad
- Bajo coste

No se añadirá tecnología por moda; se priorizará lo que resuelve el problema con claridad.

## 5. Filosofía del producto

MIMENTEHOY debe sentirse como un ecosistema útil y confiable, no como una web de contenido “genérica” o promocional.

El valor tiene que aparecer desde el primer toque: artículos claros, recursos prácticos, herramientas útiles y newsletter con sentido.

La prioridad es:

- llegar a la gente desde TikTok y móvil
- ofrecer valor inmediato
- conseguir registro real
- generar recurrencia
- construir comunidad sin sobrecargar
- monetizar más adelante con productos y Shopify

## 6. V1 — Alcance permitido

La V1 incluye únicamente:

1. Home
2. Artículos
3. Recursos
4. Herramientas
5. Newsletter
6. Tienda
7. Registro / Login
8. Mi cuenta
9. Panel de administración básico

No se construye aún:

- foro
- chat
- comunidad compleja
- app móvil nativa
- IA conversacional
- decenas de herramientas
- e-commerce propio

## 7. Arquitectura propuesta

### Frontend público

- Home con enfoque mobile-first
- Páginas de contenido editorial
- Biblioteca de recursos descargables
- Herramienta interactiva simple
- Newsletter
- Tienda integrada con Shopify
- Registro/login
- Perfil personal

### Panel administrativo

- CRUD de artículos, recursos, newsletter y categorías
- Gestión de usuarios y suscriptores
- Publicación y borradores
- Estado del contenido

### Capa de datos

- Usuarios
- Perfiles
- Intereses
- Artículos
- Categorías
- Recursos
- Descargas
- Favoritos
- Newsletter
- Suscriptores
- Herramientas guardadas
- Productos vinculados a Shopify

## 8. Estructura de carpetas propuesta

```text
mimentehoy/
├── apps/
│   ├── web/
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── styles/
│   │   └── public/
│   └── admin/
│       ├── app/
│       ├── components/
│       └── lib/
├── packages/
│   └── ui/
│       ├── src/
│       └── README.md
├── prisma/
│   └── schema.prisma
├── docs/
│   └── architecture.md
├── scripts/
│   └── backup.sh
├── .env.example
├── .gitignore
├── README.md
├── PROJECT_PLAN.md
└── package.json
```

## 9. Esquema inicial de base de datos

Modelo conceptual:

- User
- Profile
- Interest
- UserInterest
- Article
- Category
- ArticleCategory
- Resource
- ResourceCategory
- Download
- Favourite
- Newsletter
- NewsletterSubscriber
- Tool
- SavedRoutine
- ProductReference

### Recomendación de normalización

- User y Profile separados para mantener mejor perfil y datos de cuenta.
- Categories reutilizadas para artículos, recursos y herramientas.
- NewsletterSubscriber independiente de User para permitir registros externos y consentimientos claros.
- ProductReference enlaza contenido con productos de Shopify sin duplicar datos del ecommerce.
- Favourites y Downloads guardan actividad del usuario sin necesidad de crear modelos complejos.

## 10. Arquitectura de URLs

### Pública

- `/` — Home
- `/articulos` — listado de artículos
- `/articulos/[slug]` — artículo individual
- `/recursos` — biblioteca de recursos
- `/recursos/[slug]` — recurso individual
- `/herramientas/rutina-visual` — herramienta interactiva
- `/newsletter` — página de newsletter
- `/newsletter/[slug]` — edición del boletín
- `/tienda` — listado de productos de Shopify
- `/registro` — registro
- `/login` — login
- `/mi-mimentehoy` — perfil del usuario
- `/mi-mimentehoy/recursos` — recursos descargados
- `/mi-mimentehoy/favoritos`
- `/mi-mimentehoy/intereses`
- `/mi-mimentehoy/cuenta`

### Admin

- `/admin` — dashboard
- `/admin/articulos`
- `/admin/articulos/nuevo`
- `/admin/articulos/[id]`
- `/admin/recursos`
- `/admin/newsletter`
- `/admin/usuarios`
- `/admin/categorias`

## 11. Design system inicial

### Objetivos visuales

- editorial premium
- cálido y familiar
- moderno y sobrio
- pensado para móvil
- claramente legible
- muy cuidado en tipografía y espacio

### Tokens recomendados

- color base: arena cálida, crema, granate o marrón de acento
- fondo principal: blanco/crema
- texto: oscuro, de alta legibilidad
- acento: terracota, verde seco o azul suave según identidad final
- tipografía: editorial serif + sans para UI

### Principios de diseño

- mobile first
- 390px y 430px como referencias clave
- componentes limpios y reutilizables
- espacio generoso
- poca carga visual
- sin botones de IA ni bloques genéricos
- una sola idea principal por sección

## 12. Datos y credenciales que necesitaremos más adelante

Necesitaremos, sin pedir secretos en chat:

- tipo de plan de Hostinger
- acceso a panel de control o dominio
- si hay SSH disponible
- si se permite PostgreSQL o MySQL
- SMTP o servicio de emails para newsletter
- acceso a Shopify Storefront API o enlaces de checkout
- claves de entorno a través de `.env` local o variables del servidor

### Modo seguro para compartir credenciales

- nunca en chat abierto
- usar variables de entorno locales
- almacenar secrets solo en entorno del servidor o `.env.local` ignorado por git
- documentar la estructura en `.env.example`

## 13. Fases de trabajo previstas

1. Fase 0 — Auditoría del entorno y arquitectura inicial
2. Fase 1 — Arquitectura técnica y documentación
3. Fase 2 — Diseño visual / design system
4. Fase 3 — Base del proyecto
5. Fase 4 — Base de datos
6. Fase 5 — Autenticación
7. Fase 6 — Home
8. Fase 7 — Artículos
9. Fase 8 — Recursos
10. Fase 9 — Newsletter
11. Fase 10 — Primera herramienta
12. Fase 11 — Shopify
13. Fase 12 — Panel admin
14. Fase 13 — Analítica
15. Fase 14 — Testing
16. Fase 15 — Deploy Hostinger

## 14. Decisiones pendientes que bloquean la implementación técnica

- plan concreto de Hostinger
- acceso a bash/SSH y configuración del servidor
- tipo de base de datos disponible
- estrategia de emails para newsletter
- si se usará PostgreSQL o MySQL como base principal
- si se desea despliegue con Node.js en Hostinger o arquitectura alternativa

## 15. Criterios de aceptación del proyecto

- V1 estrecha y útil
- experiencia móvil muy buena
- contenido editorial claro y útil
- posibilidad de generar valor y registro sin depender de redes sociales
- arquitectura lista para escalar sin “refactor enorme”
- admin sencillo para gestionar contenido
- separación clara entre contenido editorial, recursos, ecommerce y usuario

## 16. Recomendación final de partida

Si el plan de Hostinger lo permite, usar:

- Hostinger como base cloud para la app
- PostgreSQL por base de datos principal
- Next.js + TypeScript + Tailwind para la experiencia web
- Prisma para el modelo de datos
- Shopfy para ecommerce
- SMTP propio o servicio de newsletter compatible con el hosting

Esto es la mejor combinación para MIMENTEHOY en un primer ciclo de validación y escalado prudente.
