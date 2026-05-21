# Cloudflare Pages Deployment Guide

## Prerequisites

1. **Environment Variables** — Set these in Cloudflare Dashboard > Settings > Environment Variables > Production:

### Required
- `DATABASE_URL` — Neon PostgreSQL connection string
- `AUTH_SECRET` — Random secret for NextAuth
- `STRIPE_SECRET_KEY` — Stripe secret key
- `STRIPE_WEBHOOK_SECRET` — Stripe webhook signing secret

### Queue System (Upstash Redis)
- `UPSTASH_REDIS_REST_URL` — Your Upstash Redis REST URL
- `UPSTASH_REDIS_REST_TOKEN` — Your Upstash Redis REST token

### Email (Resend)
- `RESEND_API_KEY` — Resend API key (re_...)
- `EMAIL_FROM` — Sender address (e.g. "KAIRO <noreply@kairo.com>")
- `ADMIN_EMAIL` — Admin notification email

### Supplier API Keys (optional — falls back to mock data)
- `CJ_API_KEY` — CJ Dropshipping API key
- `ALIEXPRESS_API_KEY` / `ALIEXPRESS_API_SECRET` — AliExpress Open Platform credentials
- `AMAZON_CLIENT_ID` / `AMAZON_CLIENT_SECRET` / `AMAZON_REFRESH_TOKEN` / `AMAZON_MARKETPLACE_ID` — Amazon SP-API credentials

### Google OAuth (optional)
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` — Google OAuth credentials

### Public (visible to client)
- `NEXT_PUBLIC_APP_URL` — Production URL (https://kairo-1ne.pages.dev)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Public Stripe key
- `NEXT_PUBLIC_SITE_NAME` — "KAIRO"

## Build & Deploy

Using OpenNext for Cloudflare:

```bash
# Build for Cloudflare Pages
npm run pages:build

# Preview locally
npm run pages:preview

# Deploy to production
npm run pages:deploy
```

## Local Development

```bash
npm run dev
```

## Edge Compatibility

- `bcryptjs` works in edge runtime (avoid `bcrypt`)
- Drizzle ORM + Neon HTTP driver for edge-native database
- Stripe SDK is edge-compatible
- `next-auth` v5 is edge-compatible
- Resend email SDK is edge-compatible
- Upstash Redis REST API is edge-compatible
- Supplier adapters use `fetch()` — fully edge-compatible
- Avoid `fs`, `path`, `crypto` Node.js modules

## Adding Supplier API Keys via Wrangler CLI

```bash
# CJ Dropshipping
npx wrangler pages secret put CJ_API_KEY

# AliExpress
npx wrangler pages secret put ALIEXPRESS_API_KEY
npx wrangler pages secret put ALIEXPRESS_API_SECRET

# Amazon SP-API
npx wrangler pages secret put AMAZON_CLIENT_ID
npx wrangler pages secret put AMAZON_CLIENT_SECRET
npx wrangler pages secret put AMAZON_REFRESH_TOKEN
npx wrangler pages secret put AMAZON_MARKETPLACE_ID

# Upstash Redis
npx wrangler pages secret put UPSTASH_REDIS_REST_URL
npx wrangler pages secret put UPSTASH_REDIS_REST_TOKEN

# Resend Email
npx wrangler pages secret put RESEND_API_KEY
npx wrangler pages secret put EMAIL_FROM
npx wrangler pages secret put ADMIN_EMAIL
```
