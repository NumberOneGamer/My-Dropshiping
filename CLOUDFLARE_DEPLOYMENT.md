# Cloudflare Pages Deployment Guide

## Setup

1. Install dependencies:
```bash
npm install
npx @cloudflare/next-on-pages
```

2. Create `wrangler.toml`:
```toml
name = "dropship"
compatibility_date = "2024-11-01"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = ".vercel/output/static"

[[d1_databases]]
binding = "DB"
database_name = "dropship"
database_id = "your-database-id"
```

## Environment Variables

Set these in Cloudflare Pages dashboard:
- `DATABASE_URL` - PostgreSQL connection string (use Neon or Supabase)
- `AUTH_SECRET` - Random secret for NextAuth
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` - Google OAuth credentials
- `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY` - Stripe keys
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- `NEXT_PUBLIC_APP_URL` - Production URL
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Public Stripe key

## Build & Deploy

```bash
# Build for Cloudflare Pages
npm run pages:build

# Preview locally
npm run pages:preview

# Deploy to production
npm run pages:deploy
```

## Edge Compatibility Notes

- `bcryptjs` works in edge runtime (avoid `bcrypt` which uses Node.js native modules)
- Prisma needs `@prisma/adapter-neon` for edge-compatible database access
- Stripe SDK is edge-compatible
- `next-auth` v5 is edge-compatible
- File uploads via UploadThing are edge-compatible
- Avoid `fs`, `path`, `crypto` Node.js modules
- Use `next-view-transitions` for view transitions on edge

## Supabase/Neon Database

For edge-compatible PostgreSQL:
```bash
# Neon
DATABASE_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/dropship?sslmode=require"

# Supabase
DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"
```

Run migrations:
```bash
npx prisma migrate dev
npx prisma generate
```
