# Project Research Summary

**Project:** QuantumThreat BTC
**Domain:** Resource Hub / Knowledge Management Platform (Quantum-Bitcoin Research)
**Researched:** 2026-04-15
**Confidence:** HIGH

## Executive Summary

QuantumThreat BTC is a manually-curated resource hub for quantum computing threat research related to Bitcoin. The research indicates this should be built as a content-focused platform emphasizing quality curation over automation, using a modern monolith architecture with Next.js 16 App Router and PostgreSQL. The key differentiator is manual expert curation with editorial context, not automated aggregation.

The recommended approach is a three-tier architecture with Server Components for data fetching, PostgreSQL for storage and full-text search, and a minimal admin panel for curator-only content management. Critical success factors include establishing controlled taxonomy governance from day one, implementing staleness detection metadata, and starting with PostgreSQL's native full-text search before considering dedicated search engines. The stack leverages bleeding-edge but stable technologies (Next.js 16, React 19, PostgreSQL 18, Tailwind v4, Drizzle ORM) to provide excellent developer experience while maintaining production readiness.

The primary risks are taxonomy sprawl destroying search quality, search performance degradation at scale, and content staleness damaging credibility. These are mitigated by building controlled vocabulary enforcement into Phase 1, planning search architecture for 1000+ resources from the start, and including `last_verified` metadata from day one with systematic review workflows in later phases.

## Key Findings

### Recommended Stack

The research strongly recommends a modern, performance-optimized stack built around Next.js 16 with the App Router pattern. This enables Server Components for automatic request deduplication and excellent SEO, while React 19 provides Server Actions for type-safe mutations. PostgreSQL 18 serves as both the primary database and search engine, leveraging native full-text search with GIN indexes for up to 10,000 resources before considering dedicated search services.

**Core technologies:**
- **Next.js 16.2.x**: Full-stack React framework with App Router, React 19 support, built-in ISR for content updates, deployed to Vercel for zero-config serverless
- **PostgreSQL 18.3**: Latest stable with superior full-text search via tsvector, JSONB for flexible metadata, async I/O subsystem for 15-25% better performance than PG 17
- **Drizzle ORM 0.31.x**: Lightweight (~7.4kb) with 10-20% of Prisma's performance overhead, SQL-like TypeScript API for complex filtering control, no code generation step
- **Tailwind CSS 4.x**: 2-5x faster builds than v3, CSS-first configuration, 15-25% smaller bundles, built-in container queries and 3D transforms
- **Meilisearch**: Fast setup (<5 minutes), typo-tolerant search, MIT license for self-hosting, best for content search with developer experience priority
- **Auth.js**: Official Next.js auth solution for admin-only access, supports credentials and OAuth, integrates with App Router middleware
- **shadcn/ui**: React 19 and Tailwind v4 compatible, vendored components (no bundle bloat), standard for Next.js admin panels in 2026
- **Zod 4.x**: Significantly faster validation than v3, type-safe form and API validation, integrates with React Hook Form
- **Biome 2.3+**: Replaces ESLint + Prettier with 10-25x faster performance, single config file, 423+ lint rules (limited React Hooks support)

### Expected Features

The feature research clearly distinguishes between table stakes (basic search and filtering), differentiators (curator notes and relevance scoring), and anti-features to avoid (user accounts, comments, auto-aggregation). The platform's value proposition centers on manual expert curation, not community features or automation.

**Must have (table stakes):**
- Full-text keyword search with support for technical terms and acronyms
- Multi-dimensional filtering (type, date, technical level, tags)
- Core metadata display (title, author, date, type, summary, direct links)
- Mobile responsive design (60%+ traffic is mobile in 2026)
- Admin panel with CRUD operations and authentication
- Clean, organized information architecture

**Should have (competitive differentiators):**
- Curator notes with editorial context per resource (transforms aggregation into curation)
- Relevance scoring to help users prioritize in information overload
- Technical level indicators (Beginner/Intermediate/Advanced) for accessibility
- Rich domain-specific tag taxonomy (Shor's algorithm, NIST standards, signature schemes)
- Timeline/chronological view showing evolution of quantum threat understanding
- Summary/abstract display in search results to reduce evaluation friction

**Defer (v2+):**
- User accounts and profiles (adds friction without validated need)
- Comments and discussion forums (massive moderation burden, dilutes curation focus)
- User-submitted content (quality control impossible, contradicts manual curation value)
- Real-time auto-aggregation (creates noise, loses curator expertise)
- Email notifications (requires accounts, privacy concerns)
- Internationalization (95% quantum/Bitcoin research is in English)

### Architecture Approach

The architecture follows a proven monolith pattern with Server Components as the default data fetching mechanism, URL-based filter state for shareable links, and Server Actions for mutations. This eliminates client-side state management complexity while maintaining excellent performance and SEO. The key pattern is defense-in-depth authentication (middleware + data access layer verification) to prevent CVE-2025-29927 bypass attacks.

**Major components:**
1. **Public Layer** (Browse, Search, Filter UIs) — Server Components with URL params for state, ISR for content updates, direct Prisma queries
2. **Admin Layer** (Resource CRUD, Dashboard) — Protected routes with Auth.js middleware, Server Actions for mutations, revalidation after changes
3. **Data Layer** (PostgreSQL) — Resources table with tsvector full-text search, controlled tag vocabulary, GIN indexes for search, B-tree for filters
4. **Search Integration** (Meilisearch or PostgreSQL FTS) — Architecture decision based on scale: PostgreSQL native for <1000 resources, dedicated Meilisearch for 1000+ with typo tolerance needs

**Key architectural patterns:**
- Server Component data fetching eliminates client-side fetching libraries
- URL-based filter state enables shareable filtered views and server-side rendering
- Server Actions for mutations provide type safety and progressive enhancement
- PostgreSQL full-text search with GIN indexes sufficient for small-to-medium scale
- Defense-in-depth auth (middleware + session checks in actions) prevents bypass attacks

### Critical Pitfalls

The pitfalls research identified six critical failures that destroy resource hub platforms if not addressed in foundational phases. These are not hypothetical concerns but documented patterns from knowledge management platform post-mortems.

1. **Uncontrolled taxonomy sprawl** — Free tagging without controlled vocabulary creates duplicate tags ("quantum", "Quantum", "quantum-computing") making search unusable after 6-12 months. Must implement controlled vocabulary with governance from day one in Phase 1. Cannot be retrofitted without painful data migration.

2. **Search performance degradation at scale** — PostgreSQL full-text search works perfectly with 100 resources but degrades to 5+ second queries at 10,000+ resources. Must plan search architecture for target scale from the start, use GIN indexes, separate read-optimized search from write-optimized primary database, test with 10x expected data volume.

3. **Content staleness without detection** — Resources become outdated (broken links, retracted papers, superseded BIPs) but remain with no indicators, damaging credibility. Must add `last_verified` timestamp to schema in Phase 1, implement review queue and automated staleness detection in Phase 3+.

4. **Admin panel exposed to public internet** — Publicly accessible admin endpoints become targets for brute force, credential stuffing, and automated scanners. Must implement IP allowlisting, non-obvious admin paths, MFA, aggressive rate limiting from Phase 1. Security architecture cannot be retrofitted after breach.

5. **Database schema changes causing data loss** — ORM auto-migrations can generate destructive SQL that wipes months of curated content. Must test migrations on production-volume copies, manually review generated SQL, maintain verified backup/restore procedures, use additive-only migrations.

6. **Over-engineering for hypothetical scale** — Implementing Elasticsearch clusters and microservices for 500 resources creates operational burden and delays launch. Must start with simplest architecture (monolith, PostgreSQL), set concrete scale thresholds for changes (e.g., "dedicated search at 10k resources"), defer complexity until metrics prove need.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Foundation & Core Data Model
**Rationale:** Database schema and taxonomy governance must be correct from day one. Retrofitting controlled vocabulary or adding staleness metadata requires painful migrations. This phase establishes the foundational architecture that cannot be changed easily later.

**Delivers:**
- PostgreSQL database with Resource and Tag tables
- Controlled vocabulary system with tag governance
- Schema includes `last_verified`, `published`, and full-text search metadata
- Drizzle ORM setup with migration procedures
- Backup/restore procedures tested
- Seed data for development

**Addresses features:**
- Database foundation for all features
- Metadata display (requires schema)
- Tag filtering (requires controlled taxonomy)

**Avoids pitfalls:**
- Taxonomy sprawl (controlled vocabulary enforced)
- Schema migration data loss (procedures established)
- Content staleness detection (metadata field included)

**Research needs:** SKIP — PostgreSQL schema design is well-documented, standard patterns apply.

---

### Phase 2: Public Display & Navigation
**Rationale:** Validates core value proposition (resource discovery) before building admin tools. Users can see the curated content and provide feedback on organization. Server Component patterns are established here and reused in admin panel.

**Delivers:**
- Homepage with featured resources
- Browse by category/type pages
- Individual resource detail pages
- Mobile responsive layout
- Server Component data fetching patterns

**Addresses features:**
- Clean organized structure
- Direct external links
- Core metadata display
- Mobile responsive design

**Uses stack:**
- Next.js App Router with Server Components
- Tailwind CSS v4 for styling
- shadcn/ui for UI primitives

**Avoids pitfalls:**
- Client-side filtering anti-pattern (uses Server Components)
- Over-engineering (starts simple, validates UX first)

**Research needs:** SKIP — Next.js Server Components are well-documented, standard display patterns.

---

### Phase 3: Search & Filtering
**Rationale:** Builds on proven display patterns from Phase 2. Search architecture decision (PostgreSQL FTS vs Meilisearch) must be made based on expected scale. This is the most complex technical feature and requires careful performance planning.

**Delivers:**
- Full-text search across title, summary, author
- Multi-dimensional filtering (type, date, technical level, tags)
- URL-based filter state for shareable links
- PostgreSQL GIN indexes or Meilisearch integration
- Search performance testing with 10x data volume

**Addresses features:**
- Full-text search (table stakes)
- Category/type filtering (table stakes)
- Date filtering (table stakes)
- Technical level filtering (differentiator)
- Tag filtering (differentiator)

**Implements architecture:**
- URL-based filter state pattern
- PostgreSQL full-text search with tsvector
- Server Component filtering with indexed queries

**Avoids pitfalls:**
- Search performance degradation (architecture planned for scale)
- Client-side filtering anti-pattern (server-side with URL params)
- Over-engineering (starts with PostgreSQL, migrates to Meilisearch only if needed)

**Research needs:** CONSIDER for Meilisearch integration if choosing dedicated search engine. PostgreSQL FTS needs no additional research.

---

### Phase 4: Admin Panel & Content Management
**Rationale:** Admin tools come after public UX is validated. Security must be correct from the start (defense-in-depth auth). Server Actions provide type-safe mutations with automatic revalidation.

**Delivers:**
- Auth.js authentication with credentials provider
- IP allowlisting and MFA for admin access
- Admin dashboard
- Resource CRUD with Server Actions
- Tag management (controlled vocabulary enforcement)
- Defense-in-depth auth (middleware + action-level checks)

**Addresses features:**
- Admin panel (CRUD operations)
- Admin authentication (table stakes)
- Curator notes (differentiator — requires admin input UI)
- Relevance scoring (differentiator — requires admin input UI)

**Implements architecture:**
- Server Actions for mutations
- Defense-in-depth authentication pattern
- Admin route group with protected layout

**Avoids pitfalls:**
- Admin panel exposure (IP allowlisting, MFA, non-obvious paths)
- Middleware-only auth anti-pattern (defense-in-depth)
- Missing audit logging (track all content changes)

**Research needs:** SKIP — Auth.js and Server Actions are well-documented.

---

### Phase 5: Polish & Enhancement
**Rationale:** Adds nice-to-have features after core is proven. Timeline view validated with real users before implementation. Content review workflows address staleness detection.

**Delivers:**
- Timeline/chronological view of resources
- Admin review queue for stale content
- Broken link detection background jobs
- Advanced search operators
- Performance optimization (query tuning, caching)

**Addresses features:**
- Timeline view (differentiator, deferred from v1)
- Advanced search (v1.x feature)
- Content staleness detection (pitfall mitigation)

**Avoids pitfalls:**
- Content staleness (review queue and detection implemented)
- External link rot (monitoring and admin queue)
- Search performance (optimization based on real metrics)

**Research needs:** SKIP for standard features, CONSIDER for timeline visualization if building custom component.

---

### Phase Ordering Rationale

1. **Foundation first:** Database schema, taxonomy, and security architecture cannot be changed easily once content is live. These decisions must be correct from day one.

2. **Public before admin:** Validating resource discovery UX before building content management tools ensures we're building the right thing. Users can provide feedback on organization and filtering.

3. **Search after display:** Search builds on Server Component patterns established in display pages. Architecture decision (PostgreSQL vs Meilisearch) is informed by expected scale and performance requirements.

4. **Admin once validated:** Building admin tools after public UX is proven prevents wasted effort on premature features. Security must be correct from the start regardless.

5. **Polish when proven:** Timeline view and advanced features are deferred until core value is validated with real users. Performance optimization based on actual metrics, not hypothetical scale.

### Research Flags

**Phases likely needing deeper research during planning:**
- **Phase 3 (Search & Filtering):** IF choosing Meilisearch over PostgreSQL FTS, need research on indexing pipeline, sync strategies, and deployment architecture. PostgreSQL FTS is well-documented and needs no additional research.
- **Phase 5 (Timeline View):** IF building custom visualization component, may need research on React timeline libraries or D3.js integration patterns. Simple chronological list needs no research.

**Phases with standard patterns (skip research):**
- **Phase 1 (Foundation):** PostgreSQL schema design, Drizzle ORM setup, migration procedures are well-documented with established patterns.
- **Phase 2 (Public Display):** Next.js Server Components, App Router patterns, shadcn/ui integration are thoroughly documented.
- **Phase 4 (Admin Panel):** Auth.js configuration, Server Actions, admin CRUD patterns are standard Next.js patterns with official documentation.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All recommendations based on official documentation and Context7 library verification. Version compatibility confirmed across Next.js 16, React 19, PostgreSQL 18, Tailwind v4. Performance claims for Drizzle vs Prisma, Biome vs ESLint, and Tailwind v4 verified by multiple independent sources. |
| Features | HIGH | Feature classification (table stakes vs differentiators) based on academic repository standards (Dublin Core, OAI-PMH), knowledge management best practices, and competitor analysis (Messari, Lopp.net, SSRN). Anti-features validated by multiple sources on community feature pitfalls. |
| Architecture | HIGH | Patterns verified against official Next.js documentation (Server Components, Server Actions, App Router), PostgreSQL full-text search documentation, and multiple implementation guides. Defense-in-depth auth pattern confirmed by CVE-2025-29927 mitigation guidance. Scale thresholds (<10k monolith, 10k-100k read replicas, 100k+ dedicated search) validated by multiple sources. |
| Pitfalls | HIGH | All critical pitfalls sourced from authoritative knowledge management research (APQC, Enterprise Knowledge, Bloomfire) and database performance guides (PostgreSQL docs, Algolia best practices). Taxonomy sprawl, search degradation, and staleness detection are documented failure patterns with known recovery strategies. Security pitfalls (admin exposure, migration data loss) based on official vulnerability disclosures and database migration best practices. |

**Overall confidence:** HIGH

Research is comprehensive with multiple source verification for all critical recommendations. Stack choices are based on official documentation and recent stable releases. Feature classification derives from established repository standards and competitor analysis. Architecture patterns are proven Next.js approaches. Pitfalls are documented industry failures with known prevention strategies.

### Gaps to Address

**Minor gaps requiring validation during implementation:**

- **PostgreSQL vs Meilisearch decision threshold:** Research suggests 1,000-10,000 resources as the inflection point for dedicated search, but exact threshold depends on query complexity and metadata richness. Should load test with production-volume data early in Phase 3 to validate architecture choice.

- **Taxonomy breadth:** Research establishes need for controlled vocabulary but doesn't specify how many tags/categories are appropriate for quantum-Bitcoin domain. Will need domain expert input during Phase 1 to design initial taxonomy structure. Recommend starting with 30-50 curated tags based on Lopp.net pattern.

- **Timeline visualization approach:** Research validates timeline view as differentiator but doesn't specify implementation approach (simple chronological list vs interactive D3.js visualization vs library component). Defer decision to Phase 5 when user feedback indicates complexity needed.

- **Admin access patterns:** IP allowlisting recommendation assumes curator has static IP or VPN access. If curator uses dynamic IP or works from multiple locations, will need alternative approach (VPN requirement or stronger MFA with relaxed IP restrictions). Clarify with curator during Phase 4 planning.

**How to handle during planning/execution:**

- **Search architecture decision:** Add explicit decision point in Phase 3 planning: "Load test PostgreSQL FTS with 10x expected resources (5,000-10,000 records). If query time < 200ms, proceed with PostgreSQL. If > 500ms, migrate to Meilisearch." Document decision and performance data.

- **Taxonomy structure:** Schedule taxonomy design session with domain expert in Phase 1. Use Lopp.net categories (30+ categories) as reference, adapt to quantum-Bitcoin focus. Build controlled vocabulary enforcement in admin UI from day one.

- **Timeline implementation:** Start Phase 5 with simple grouped chronological list. Gather user feedback. If users request interactivity, then research timeline libraries (react-chrono, vis-timeline). Don't build complex visualization until need is validated.

- **Admin security approach:** Clarify curator's access patterns (static IP? VPN? multiple locations?) during Phase 4 kickoff. Adjust security strategy accordingly (strict IP allowlisting for static, VPN requirement for dynamic, stronger MFA for multiple locations).

## Sources

### Primary (HIGH confidence)
- **/vercel/next.js** (Context7) — Next.js 16 features, App Router, React 19 integration, Server Components, Server Actions
- **/websites/postgresql_18** (Context7) — PostgreSQL 18 features, async I/O improvements, skip scan, uuidv7()
- **/drizzle-team/drizzle-orm** (Context7) — Drizzle ORM documentation, performance characteristics, edge runtime support
- **/tanstack/query** (Context7) — TanStack Query v5 API, Next.js integration patterns
- **/colinhacks/zod** (Context7) — Zod v3 vs v4, performance improvements, migration guide
- **/biomejs/biome** (Context7) — Biome v2.3 features, linter rules, performance vs ESLint/Prettier
- **/vitest-dev/vitest** (Context7) — Vitest v4, Next.js compatibility, async component testing limitations
- **/microsoft/playwright** (Context7) — Playwright v1.58, official Next.js E2E testing recommendation
- PostgreSQL Official Docs — Full-Text Search, GiST/GIN indexes, tsvector operations
- Next.js Official Docs — App Router architecture, data fetching, caching strategies
- Dublin Core Metadata Initiative — Repository metadata standards
- Cornell University eCommons — Academic repository metadata guidelines

### Secondary (MEDIUM confidence)
- APQC: Top 5 Knowledge Management Threats for 2026 — Taxonomy sprawl, content staleness
- Enterprise Knowledge: Common Knowledge Management Mistakes — Over-engineering, lack of governance
- Bloomfire: 8 Reasons Why Knowledge Management Fails — Content rot, poor search, no ownership
- Better Stack: PostgreSQL Full-Text Search with TypeScript (2025) — Implementation patterns
- WorkOS: Next.js App Router Authentication Guide (2026) — Auth.js integration, security patterns
- Algolia: Faceted Search Best Practices — Filter UX, performance optimization
- Nielsen Norman Group: Filter Categories and Values for UX — Filter design research
- Baymard Institute: Filter Usability Research — 76% of sites have serious filter issues
- Multiple sources (makerkit.dev, designrevision.com, dev.to): Drizzle vs Prisma performance comparison
- Multiple sources (meilisearch.com, elest.io, medium.com): Search engine comparison (Meilisearch/Typesense/Algolia)
- Multiple sources (medium.com, betterstack.com, dev.to): Biome vs ESLint/Prettier benchmarks

### Tertiary (LOW confidence)
- Specific crypto research platform features (Messari, CoinDesk) — Based on web search, verified against product websites but not official documentation
- Emerging AI trends in knowledge management — Rapidly evolving space, may be overhyped, flagged for validation

### Examples Analyzed
- Messari (https://messari.io/) — Commercial crypto research platform with professional analysts
- Lopp.net Bitcoin Resources (https://www.lopp.net/bitcoin-information.html) — Manual curation, 30+ categories, community-driven
- SSRN Cryptocurrency Hub — Academic repository with peer review
- Plan B Network (GitHub: bitcoin-educational-content) — Open source Bitcoin education platform

---
*Research completed: 2026-04-15*
*Ready for roadmap: yes*
