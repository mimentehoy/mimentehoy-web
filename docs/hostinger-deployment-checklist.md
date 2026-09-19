# Hostinger deployment checklist for MIMENTEHOY

## Goal

Keep the project simple, secure and compatible with Hostinger while staying open to future scaling.

## Confirmed requirements (verified live in hPanel on 2026-09-19)

Domain `mimentehoy.com` is purchased on the user's Hostinger account (1-year term, expires 2027-09-19, verification pending — confirm the WHOIS contact email or the registrar may suspend it). No hosting plan is purchased yet.

| | Single | Premium | Business | Cloud |
|---|---|---|---|---|
| Node.js apps | ❌ | ❌ | ✅ | ✅ |
| SSH | ❌ | ✅ | ✅ | ✅ |
| Git | ✅ | ✅ | ✅ | ✅ |
| MySQL databases | 2 | 10 | 150 | 300 |
| PostgreSQL | not available on any shared plan | | | |
| Cron jobs | 2 | unlimited | unlimited | unlimited |
| Renewal price | €6.99/mo | €9.99/mo | €16.99/mo | from €23.99/mo |

**Business is the minimum plan** that supports Node.js + SSH + unlimited cron. Not yet purchased — the app keeps running on the local JSON fallback until it is.

## Recommended architecture for Hostinger

- Next.js 16 + App Router + TypeScript
- Tailwind CSS
- Prisma ORM, **MySQL** as the main database — confirmed PostgreSQL is not available on any Hostinger shared hosting plan; `prisma/schema.prisma` currently says `postgresql` and must switch to `mysql` before the first deploy here
- Shopify as the checkout and commerce layer
- MailerLite as optional external newsletter service

## Production deployment path

1. Connect the repo in Hostinger or via Git on the server.
2. Install Node.js version compatible with the app.
3. Create a production MySQL database in hPanel (Business plan or higher).
4. Set environment variables via Hostinger panel or SSH `.env.production`.
5. Run `npm install` and `npm run build`.
6. Start the app via PM2 or a persistent Node process.
7. Configure the domain and reverse proxy if Hostinger requires it.
8. Set cron or scheduler tasks for backups / maintenance if needed.
9. Keep a local backup of the JSON fallback data and subscriber file.

## Required environment variables

- NODE_ENV=production
- DATABASE_URL="mysql://user:password@host:3306/mimentehoy"
- NEXTAUTH_SECRET="generate-long-secret"
- NEXTAUTH_URL="https://mimentehoy.com"
- ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_SESSION_SECRET — protect the CMS admin routes (see src/lib/admin-session.ts)
- MAILERLITE_API_KEY=""
- MAILERLITE_GROUP_ID=""
- NEXT_PUBLIC_SHOPIFY_URL="https://mimentehoy.myshopify.com"

## Important cautions

- Do not rely on local JSON as the final database for production.
- Mark the current JSON files as V1 fallback data only.
- Use Prisma (MySQL provider) once the Business hosting plan is purchased.
- Keep the app stateless and ready for horizontal scaling when needed.

## Recommended go-live order

1. Production DNS and certificate
2. App process + PM2
3. Database + Prisma migration
4. Newsletter configuration
5. Shopify product links
6. SEO and analytics
7. Backup monitoring
