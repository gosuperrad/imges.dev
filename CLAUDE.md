# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Reference docs

`AGENTS.md` is the source of truth for code style, naming, error handling, import order, and CI/CD details — read it before making non-trivial changes. `README.md` documents the public URL contract (path-segment params, query params, retina, formats). `GIT_FLOW.md` defines the branching model.

## Commands

```bash
npm install --legacy-peer-deps    # Required (picomatch peer dep issue)
npm run dev                       # Dev server on http://localhost:3000
npm run build                     # Production build
npm start                         # Start built server (port: $PORT or 3000)
npm run lint                      # ESLint
npx tsc --noEmit                  # Type-check (no test framework exists)
npx prisma migrate dev            # Apply migrations locally
npx prisma generate               # Regenerate Prisma client after schema changes
```

There is no test framework. Verify changes via `npm run build`, `npx tsc --noEmit`, and manual smoke tests against the dev server.

System libs needed locally for `canvas`/`sharp`: `brew install pkg-config cairo pango libpng jpeg giflib librsvg pixman`.

## Architecture

This is a Next.js 16 (App Router) image-generation service. The whole product is essentially one route handler plus a small set of supporting libs.

**Request flow for an image:**
1. `proxy.ts` (Next.js middleware export — note the file is named `proxy.ts` but exports the middleware function `proxy` and a `config.matcher`) runs first. It rate-limits image requests (100/min/IP) and `/analytics/login/api` (5/min/IP) using an in-memory `Map`. **This only works because Railway runs a single instance** — multi-instance deploys would need Redis/Upstash.
2. `app/[...params]/route.ts` is the catch-all that parses the URL path (`/WIDTHxHEIGHT[@2x]/bg/fg.format`), validates against `MAX_TOTAL_PIXELS` (`lib/limits.ts`) and a complexity score, draws to `node-canvas`, optionally pipes through `sharp` for format conversion, and fires a non-blocking `trackImageEvent` call.
3. `lib/fonts.ts` lazy-downloads Google Fonts on first use, caches the TTF in `.next/cache/fonts/`, and registers it with `node-canvas`. An in-memory `Set` prevents re-registration. `SUPPORTED_FONTS` is the allowlist — adding a font means adding it here.
4. `lib/analytics.ts` writes to Postgres via Prisma. It **silently no-ops in `NODE_ENV=development`** and skips events whose referrer is `imges.dev`/`*.railway.app` to avoid the homepage builder polluting stats. Failures are swallowed — analytics never break image generation.

**Other routes:** `app/og-image/route.ts` is a separate dedicated OG image endpoint. `app/analytics/` is the password-protected dashboard (auth via `ANALYTICS_TOKEN` env var, see `lib/analytics-auth.ts`). `app/page.tsx` + `app/components/ImageBuilder.tsx` is the interactive builder shown on the homepage.

**Persistence:** Prisma + Postgres, single `ImageEvent` model plus a pre-aggregated `PopularStats` model (`prisma/schema.prisma`). `lib/prisma.ts` exports the singleton client. Migrations run automatically on container start via `scripts/start.sh` (`prisma migrate deploy` then `npm start`).

**Deployment:** Railway, Docker (`Dockerfile` uses `node:22-bookworm-slim` and installs the Cairo/Pango/etc. system libs). `next.config.ts` declares `serverExternalPackages: ["canvas"]` — do not bundle canvas; it must stay external. Security headers (CSP, X-Frame-Options, etc.) are also set in `next.config.ts`.

## Project conventions worth knowing

- **Always** install with `--legacy-peer-deps`.
- Update `CHANGELOG.md` under `[Unreleased]` with the PR number when making user-facing changes.
- Git Flow: PRs target `develop`, then `develop` → `main` via merge commit (not squash).
- `@/*` path alias maps to project root.
- `@types/node` is pinned to v20 in Dependabot config — don't bump it.
- Keep utilities in `lib/` pure; route handlers compose them.
