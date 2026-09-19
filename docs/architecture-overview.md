# MIMENTEHOY architecture overview

## Product vision

MIMENTEHOY is a mobile-first editorial platform designed to convert traffic from TikTok into a long-term owned audience. The product must feel useful, calm, and premium, not promotional or generic.

## Stack decision

The current V1 favors a simple and robust stack with minimal operational risk:

- Frontend: Next.js 16 + App Router + TypeScript
- Styling: Tailwind CSS
- Backend: Next API routes for MVP flows
- Database: PostgreSQL or MySQL once Hostinger confirms it
- ORM: Prisma for long-term maintainability
- Newsletter: MailerLite + fallback JSON if API is unavailable
- Commerce: Shopify as checkout layer

## Core flows

- User lands from social content
- Reads a useful article or uses a tool
- Joins the newsletter or creates an account
- Returns through free resources and editorial content
- Later buys a product or explores Shopify items

## V1 product slices

- Home
- Articles
- Resources
- Tools
- Newsletter
- Store
- Auth
- Account
- Admin

## Production considerations

- Prefer Hostinger as the primary host if Node.js + DB + env vars are available
- Keep the application portable so it can move if hosting constraints are discovered
- Use local fallback JSON only until the real DB is available
- Keep admin content management simple and human-friendly
- Avoid adding an app or heavy backend before proving product usage

## Future phase progression

1. V1 validation
2. Editorial CMS + users + subscriptions
3. Personalization + saved content
4. Shopify product sync and automation
5. More advanced admin analytics
6. Optional community features
