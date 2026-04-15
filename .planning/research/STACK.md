# Stack Research

**Domain:** Resource Hub / Knowledge Management Platform
**Researched:** 2026-04-15
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **Next.js** | 16.2.x | Full-stack React framework | Industry standard for resource hubs in 2026. App Router with React 19 support, built-in API routes, excellent SEO, ISR for content updates. Deployed to Vercel for zero-config serverless. Version 16.1.0+ includes React 19.2, View Transitions, and next upgrade CLI command. |
| **TypeScript** | 6.0.x | Type safety | v6.0.2 latest stable. Essential for large codebases with complex metadata schemas. Prevents runtime errors in filtering/search logic. Next.js has first-class TS support. |
| **PostgreSQL** | 18.3 | Relational database | Latest stable (April 2026). Superior full-text search via tsvector, JSONB for flexible metadata, advanced indexing for filters. PG 18 adds async I/O subsystem for better sequential scan performance, skip scan for multicolumn indexes, and uuidv7() for timestamp-ordered UUIDs. Production-ready and 15-25% faster than PG 17 for short-lived queries. |
| **Drizzle ORM** | 0.31.x | Database ORM | Lightweight (~7.4kb), zero dependencies, 10-20% of raw SQL performance vs Prisma's 2-4x overhead. No code generation step (works with Turbopack fast refresh). Native edge runtime support. SQL-like TypeScript API gives full query control for complex filtering. For content platforms, query control matters more than abstraction. |
| **Tailwind CSS** | 4.x | Utility-first CSS | v4.0 GA since January 2025. 2-5x faster builds than v3, CSS-first configuration via @theme, automatic content detection, 15-25% smaller bundle sizes. Built-in container queries, 3D transforms, native CSS variables. Zero reason to use v3 in 2026 for new projects. Requires Safari 16.4+, Chrome 111+, Firefox 128+. |
| **React** | 19.2 | UI library | Bundled with Next.js 16. Server Components, useActionState, useFormStatus for forms with Server Actions. Industry standard for interactive UIs. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **Meilisearch** | Latest | Search engine | Fast setup (<5 minutes), typo-tolerant, built-in admin UI, MIT license for self-hosting. Best for content search with developer experience priority. Alternative: Typesense (faster, requires more RAM) or Algolia (enterprise-grade, expensive). For v1, Meilisearch's simplicity beats raw speed. |
| **Auth.js** | Latest | Authentication | Formerly NextAuth.js. Official Next.js auth solution. Simple email/password for admin-only access. Supports credentials, OAuth, magic links. Integrates with Next.js App Router middleware. |
| **shadcn/ui** | Latest | Component library | Fully compatible with React 19 and Tailwind v4 (updated October 2024). Vendored components (copy-paste, not npm), built on Radix UI primitives. Standard for Next.js admin panels in 2026. No runtime bundle bloat. |
| **Zod** | 4.x | Schema validation | v4.0.1 latest. Significantly faster validation and smaller TS compilation times than v3. Type-safe form validation, API input validation, database schema sync. Integrates with React Hook Form via @hookform/resolvers. |
| **React Hook Form** | 7.66.x | Form management | Industry standard (12.12KB gzipped). Uncontrolled inputs for performance, minimal re-renders. Integrates with Server Actions via useActionState/useFormStatus. Better DX than TanStack Form for typical admin forms. TanStack Form only needed for strict type safety in complex reusable forms. |
| **TanStack Query** | 5.90.x | Server state management | v5 stable (v6 not mentioned in sources). Caching, refetching, optimistic updates for admin mutations. Single object API syntax. Reduces boilerplate for resource CRUD operations. Works with Server Components and Server Actions. |
| **postgres.js** | Latest | PostgreSQL driver | Modern default for Node.js. Faster than pg, built-in connection pooling, TypeScript-native, tagged template API. Use with @vercel/functions attachDatabasePool for Fluid Compute connection management in serverless. For Edge Runtime, use @neondatabase/serverless (HTTP/WebSocket tunneling). |
| **Lucide React** | Latest | Icons | Standard icon library for shadcn/ui. Tree-shakeable, React components, consistent style. Alternative to Heroicons or FontAwesome. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| **Biome** | Linter + Formatter | v2.3+ replaces ESLint + Prettier with 10-25x faster performance (~200ms vs 3-5s for 10k-line monorepo). Single config file, single binary. Covers ~80% of ESLint rules, 423+ lint rules. Limitation: no React Hooks plugin yet (use ESLint for eslint-plugin-react-hooks if needed). For new projects, Biome is the default. |
| **Vitest** | Unit testing | v4.0.x latest. Official Next.js recommendation for unit tests. 10-20x faster startup than Jest, Jest-compatible API, Vite transform pipeline. Use with React Testing Library for component tests. Note: does not support async Server Components (use E2E tests for those). |
| **Playwright** | E2E testing | v1.58.x latest. Official Next.js recommendation for E2E tests. Faster than Cypress, better tooling than Selenium. Cross-browser (Chromium, Firefox, WebKit). Component testing now stable. Use for async Server Components that Vitest can't test. |
| **Vercel** | Deployment platform | Zero-config Next.js deployment, serverless functions, edge runtime, Postgres hosting, analytics. Industry standard for Next.js apps. Fluid Compute automatically manages connection pools. |

## Installation

```bash
# Initialize Next.js project with App Router
npx create-next-app@latest quantumthreatbtc --typescript --tailwind --app --turbopack

# Core database
npm install drizzle-orm postgres
npm install -D drizzle-kit

# Connection pooling for Vercel serverless
npm install @vercel/functions

# Authentication
npm install next-auth@latest

# Forms and validation
npm install react-hook-form zod @hookform/resolvers

# Server state management
npm install @tanstack/react-query

# UI components (shadcn/ui - install via CLI)
npx shadcn@latest init
npx shadcn@latest add button form input table select

# Icons
npm install lucide-react

# Search engine (Meilisearch - self-hosted or cloud)
npm install meilisearch

# Dev tools
npm install -D @biomejs/biome vitest @testing-library/react @testing-library/jest-dom playwright
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| **Drizzle ORM** | Prisma 7.x | Choose Prisma if team is new to databases and needs automated migrations with gentler learning curve. Prisma 7 (late 2025) removed Rust engine for pure TS/WASM, reducing bundle from ~8MB to 1.6MB (600KB gzipped) with 9x faster cold starts. Still 2-4x slower than Drizzle, but improved. Requires `prisma generate` on schema changes. Use if abstraction > query control. |
| **Meilisearch** | Typesense | Choose Typesense for raw speed (<50ms responses) and built-in clustering. Keeps entire index in RAM. Auto-embedding for semantic search. Resource-based cloud pricing (~$30/mo) vs Meilisearch's usage-based. Better for high-traffic e-commerce. QuantumThreat BTC is content-focused, not performance-critical search. |
| **Meilisearch** | Algolia | Choose Algolia for enterprise features (analytics, A/B testing, global CDN, 99.999% uptime). Expensive: $0.50 per 1000 searches, $550/mo for Grow plan. Overkill for v1 manual curation project. |
| **PostgreSQL 18** | PostgreSQL 17 | PG 17.9 is stable and production-ready. Choose if team is risk-averse about bleeding-edge versions. PG 18 is faster (async I/O, skip scan) but only 6 months GA. Some devs prefer even-numbered releases (14, 16, 18) as "safe" releases, but this is opinion not official guidance. |
| **Biome** | ESLint + Prettier | Choose ESLint + Prettier if project needs framework-specific plugins (eslint-plugin-next, eslint-plugin-react-hooks) that Biome doesn't support yet. For hybrid approach: run both in CI (Biome for speed, ESLint for legacy rules). For new projects with standard Next.js patterns, Biome is sufficient. |
| **Tailwind v4** | Tailwind v3 | Choose v3 only if supporting older browsers (Safari <16.4, Chrome <111, Firefox <128). v3.4 is the fallback. v4 is 2-5x faster, smaller bundles, modern features (container queries, 3D transforms, CSS variables). |
| **Vercel** | Netlify / Railway / Fly.io | Choose Netlify for similar serverless DX. Railway/Fly.io for better database hosting control and pricing. Vercel is tightly integrated with Next.js (same company), has Fluid Compute for connection pooling, and simplest deployment. For bootstrapped project, Vercel's free tier is generous. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| **Next.js Pages Router** | Legacy API. App Router is the default since Next.js 13 (2022). Server Components, streaming, layouts, parallel routes only in App Router. Next.js 16 focuses on App Router improvements. | Next.js App Router |
| **MongoDB** | Document DB is poor fit for relational data (resources → tags, categories, authors). No native full-text search ranking. JSONB in Postgres gives schema flexibility without sacrificing relational integrity or search quality. | PostgreSQL with JSONB columns |
| **Jest** | Slower startup (3-5s vs 200ms for Vitest). Webpack/Babel era tooling. For new projects, zero reason to use Jest in 2026. Jest-compatible API means migration is trivial. | Vitest |
| **Cypress** | Slower than Playwright, weaker browser automation. Playwright is official Next.js recommendation, better DevTools, faster execution. | Playwright |
| **CSS Modules / Styled Components** | CSS Modules lack utility-first speed. Styled Components add runtime overhead and poor RSC compatibility. Tailwind v4 is faster, smaller, better DX in 2026. | Tailwind CSS v4 |
| **Node-Postgres (pg)** | Older API, verbose syntax, no built-in connection pooling (requires pg-pool). postgres.js is faster, cleaner, modern default. | postgres.js |
| **Elasticsearch** | Overkill for <10k resources. Complex setup, Java dependency, heavy resource usage. Meilisearch/Typesense offer similar features with 5-minute setup and lower resource footprint. | Meilisearch or Typesense |
| **tRPC** | Adds abstraction layer when Next.js Server Actions provide type-safe client-server communication out of the box. tRPC useful for shared API with mobile/non-Next.js clients, but QuantumThreat BTC is web-only admin. | Next.js Server Actions |

## Stack Patterns by Variant

**If deploying to Vercel Edge Runtime:**
- Use @neondatabase/serverless instead of postgres.js (Edge doesn't support TCP)
- Use Neon or Supabase Postgres (HTTP/WebSocket-compatible)
- Ensure libraries are edge-compatible (check package.json exports for "edge-light" runtime)

**If self-hosting (not Vercel):**
- Configure connection pooling manually (pg-pool or postgres.js pool)
- Use PgBouncer or similar for connection pooling at database level
- Set idle timeout to ~5 seconds if connections are limited

**If supporting older browsers:**
- Use Tailwind CSS v3.4 (v4 requires modern CSS features)
- Check shadcn/ui component compatibility (some use modern CSS)
- Add polyfills for fetch, Promise, etc. via core-js if needed

**If team prefers Prisma:**
- Use Prisma 7.x (not 6.x)
- Enable edge runtime with Prisma Accelerate (paid proxy service)
- Run `prisma generate` after schema changes (automate in package.json scripts)
- Expect larger bundle size (~1.6MB vs Drizzle's 7.4kb)

**If team wants to avoid bleeding-edge:**
- PostgreSQL 17.9 instead of 18.3
- Zod v3 instead of v4 (if migration risk concerns exist)
- Tailwind v3.4 instead of v4 (if avoiding breaking changes)
- Note: These are stable, but you sacrifice performance improvements

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| Next.js 16.2.x | React 19.2 | Bundled together. Do not manually install React. |
| Tailwind CSS v4 | Next.js 16 | Requires Next.js 15+ and PostCSS 8. Use @tailwindcss/postcss plugin. |
| shadcn/ui | React 19 + Tailwind v4 | Fully updated as of October 2024. New projects default to v4. |
| Drizzle ORM 0.31.x | PostgreSQL 18 | Supports all PG versions. Use drizzle-kit for migrations. |
| Auth.js (NextAuth) | Next.js 16 App Router | Works with middleware. Use next-auth@latest for App Router compatibility. |
| TanStack Query v5 | React 19 | Stable. v6 not yet GA. Works with Server Components and Server Actions. |
| Zod 4.x | TypeScript 6.x | Peer dependency: zod@^3.25.0 or ^4.0.0. v3.25+ includes both v3 and v4 at subpaths. |
| Biome 2.3+ | Next.js 16 | No conflicts. May need ESLint for react-hooks plugin until Biome adds it. |
| Vitest 4.x | Next.js 16 | Works with Turbopack. Does not support async Server Components (use Playwright). |
| Playwright 1.58.x | Next.js 16 | Official Next.js E2E testing recommendation. |
| postgres.js | PostgreSQL 18 | Driver-level compatibility. Supports all PG versions. |

## Sources

- **/vercel/next.js** (Context7) — Next.js 16 features, App Router, React 19 integration
- **/websites/postgresql_18** (Context7) — PostgreSQL 18 features, performance improvements
- **/drizzle-team/drizzle-orm** (Context7) — Drizzle ORM documentation, edge runtime support
- **/prisma/prisma** (Context7) — Prisma 7 architecture changes, version compatibility
- **/tanstack/query** (Context7) — TanStack Query v5 API, Next.js integration
- **/colinhacks/zod** (Context7) — Zod v3 vs v4, migration guide, performance improvements
- **/biomejs/biome** (Context7) — Biome v2.3 features, linter rules, ESLint comparison
- **/vitest-dev/vitest** (Context7) — Vitest v4, Next.js compatibility, async component limitations
- **/microsoft/playwright** (Context7) — Playwright v1.58, Next.js official testing
- **WebSearch: "Prisma vs Drizzle ORM 2026 Next.js"** (MEDIUM confidence) — Drizzle performance claims verified by multiple sources (makerkit.dev, designrevision.com, dev.to)
- **WebSearch: "Meilisearch vs Algolia vs Typesense"** (MEDIUM confidence) — Search engine comparison from meilisearch.com blog, elest.io, medium.com
- **WebSearch: "PostgreSQL 17 vs 18 production ready 2026"** (HIGH confidence) — Official PG release notes, planetscale.com benchmarks, dataegret.com upgrade guide
- **WebSearch: "Tailwind CSS v4 stable 2026"** (HIGH confidence) — Official tailwindcss.com blog, GA announcement January 22, 2025
- **WebSearch: "Biome vs ESLint Prettier 2026"** (MEDIUM confidence) — Multiple sources (medium.com, betterstack.com, dev.to) agree on 10-25x performance claims
- **WebSearch: "Vercel serverless postgres connection pooling"** (HIGH confidence) — Official Vercel docs, Fluid Compute announcement
- **WebSearch: "Next.js testing stack 2026 Vitest Playwright"** (HIGH confidence) — Official Next.js docs updated April 8, 2026 for v16.2.3

---
*Stack research for: QuantumThreat BTC Resource Hub*
*Researched: 2026-04-15*
