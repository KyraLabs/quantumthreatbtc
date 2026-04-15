# Phase 1: Foundation & Data Model - Context

**Gathered:** 2026-04-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Database and taxonomy infrastructure ready for content curation. This phase delivers PostgreSQL schema with controlled tag vocabulary, Meilisearch integration for full-text search, and validated backup/restore procedures. No UI work — pure data foundation.

</domain>

<decisions>
## Implementation Decisions

### Database Schema

- **D-01:** Resources-Tags relationship via JSONB array in `Resources.tags` column (not junction table)
- **D-02:** Metadata strategy: Core columns for common fields (title, summary, type, date, external_link, technical_level, authors) + JSONB `extras` column for specialized metadata (DOI, conference, affiliation, etc.)
- **D-03:** Tags table schema: `(id, name, slug)` minimal structure for v1 — just vocabulary control

### Search Infrastructure

- **D-04:** Use Meilisearch (external) as search engine, not PostgreSQL native tsvector
- **D-05:** Sync strategy: PostgreSQL → Meilisearch on resource create/update/delete
- **D-06:** Meilisearch setup via Docker/cloud service (not embedded)

### Backup/Restore Procedures

- **D-07:** Rely on Vercel Postgres automatic backups for v1
- **D-08:** Validation: Document restore process step-by-step + smoke test (restore to staging/local, verify sample resource exists)
- **D-09:** No offsite backups (S3/Backblaze) for v1 — defer to v2 if needed

### Project Structure

- **D-10:** Next.js 16 App Router with `app/` root structure (not `src/app/`)
- **D-11:** Directory organization: `app/` for routes, `lib/` for utilities, `components/` for UI components, `db/` for schema/queries
- **D-12:** Drizzle ORM (not Prisma or raw SQL) — aligns with stack recommendation for query control + performance

### Data Management

- **D-13:** Seed data: Create seed script with 10-20 sample resources (mix of Papers, BIPs, Articles) + initial tag vocabulary (Shor's Algorithm, NIST Standards, Signature Schemes, Grover's Algorithm, Post-Quantum, etc.)
- **D-14:** Migrations via Drizzle Kit (`drizzle-kit generate`, `drizzle-kit migrate`) — type-safe schema evolution

### Claude's Discretion

- Exact GIN index configuration for PostgreSQL (if needed as fallback search)
- Meilisearch field weighting (likely: title > summary > authors, tags searchable)
- File naming conventions (will follow Next.js/React standards: PascalCase components, camelCase utilities)
- Seed resource content (realistic quantum-Bitcoin examples)
- Environment variable naming and .env structure

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Technology Stack
- `CLAUDE.md` §Stack — Full technology decisions (Next.js 16, PostgreSQL 18, Drizzle ORM 0.31.x, Meilisearch, Tailwind CSS v4)
- `.planning/research/STACK.md` — Detailed stack rationale, version compatibility, installation commands

### Requirements
- `.planning/REQUIREMENTS.md` — DATA-01 through DATA-05 (database schema, tag vocabulary, staleness detection, GIN indexes, backup procedures)
- `.planning/PROJECT.md` — Core value ("users find quantum-Bitcoin information quickly and reliably"), constraints, key decisions

### Domain Context
- `.planning/research/FEATURES.md` — Feature analysis including rich tag taxonomy, domain-specific tags (quantum-Bitcoin vocabulary)
- `.planning/research/PITFALLS.md` — Known pitfalls for resource hub platforms (search relevance issues, schema flexibility, backup verification)

No formal ADRs or specs exist yet — this is the initial phase establishing architectural patterns.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

None — greenfield project. Phase 1 establishes foundational patterns that Phase 2+ will build upon.

### Established Patterns

Stack decisions from research:
- **PostgreSQL 18**: JSONB for flexible metadata, GIN indexes for search (if used), uuidv7() for timestamp-ordered IDs
- **Drizzle ORM**: SQL-like TypeScript API, migrations via drizzle-kit, ~7.4kb bundle
- **Meilisearch**: Typo-tolerant search, built-in admin UI, <5 minute setup
- **Next.js 16 App Router**: Server Components, Server Actions for mutations, App Router middleware for future auth

### Integration Points

This phase creates integration points for:
- **Phase 2 (Public Discovery)**: Database schema + Meilisearch index consumed by browse/search/filter UI
- **Phase 3 (Admin Auth)**: Schema includes future admin user/session tables (not in v1 scope)
- **Phase 4 (Admin Panel)**: Server Actions will mutate Resources table + sync to Meilisearch

</code_context>

<specifics>
## Specific Ideas

**Tag vocabulary examples:**
User expects domain-specific quantum-Bitcoin tags like:
- Cryptography algorithms: "Shor's Algorithm", "Grover's Algorithm", "ECDSA", "Schnorr"
- Post-quantum standards: "NIST PQC", "CRYSTALS-Dilithium", "CRYSTALS-Kyber"
- Bitcoin-specific: "BIP", "Taproot", "Signature Schemes", "Mining Security"
- Threat categories: "Harvest Now Decrypt Later", "Quantum Supremacy"

**Resource types:**
Controlled vocabulary: Paper, BIP, Article, Research (exactly these 4 for v1)

**Technical levels:**
Beginner, Intermediate, Advanced (for FILT-03 filtering)

No specific UI references since this phase has no frontend work — pure data layer.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope (data foundation only).

</deferred>

---

*Phase: 01-foundation-data-model*
*Context gathered: 2026-04-15*
