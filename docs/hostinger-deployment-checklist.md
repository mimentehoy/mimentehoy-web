# Hostinger deployment checklist for MIMENTEHOY

## Goal

Keep the project simple, secure and compatible with Hostinger while staying open to future scaling.

## Confirmed requirements to validate in the real plan

Before final production deployment, confirm the following with Hostinger:

- Node.js available
- SSH access available
- PostgreSQL or MySQL database available
- Git deployment support or direct Git pull capability
- cron jobs available
- environment variables supported
- persistent application storage for uploads / generated files
- backups or snapshot capability
- domain is mapped to the app

## Recommended architecture for Hostinger

If the plan supports Node.js and PostgreSQL/MySQL, use:

- Next.js 16 + App Router + TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL as the main database for future growth
- Shopify as the checkout and commerce layer
- MailerLite as optional external newsletter service

## Production deployment path

1. Connect the repo in Hostinger or via Git on the server.
2. Install Node.js version compatible with the app.
3. Create a production database (PostgreSQL preferred if allowed).
4. Set environment variables via Hostinger panel or SSH `.env.production`.
5. Run `npm install` and `npm run build`.
6. Start the app via PM2 or a persistent Node process.
7. Configure the domain and reverse proxy if Hostinger requires it.
8. Set cron or scheduler tasks for backups / maintenance if needed.
9. Keep a local backup of the JSON fallback data and subscriber file.

## Required environment variables

- NODE_ENV=production
- DATABASE_URL="postgresql://user:password@host:5432/mimentehoy"
- NEXTAUTH_SECRET="generate-long-secret"
- NEXTAUTH_URL="https://mimentehoy.com"
- MAILERLITE_API_KEY=""
- MAILERLITE_GROUP_ID=""
- NEXT_PUBLIC_SHOPIFY_URL="https://mimentehoy.myshopify.com"

## Important cautions

- Do not rely on local JSON as the final database for production.
- Mark the current JSON files as V1 fallback data only.
- Use Prisma once the Hostinger DB is confirmed.
- Keep the app stateless and ready for horizontal scaling when needed.

## Recommended go-live order

1. Production DNS and certificate
2. App process + PM2
3. Database + Prisma migration
4. Newsletter configuration
5. Shopify product links
6. SEO and analytics
7. Backup monitoring
