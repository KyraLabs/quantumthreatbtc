# Roadmap: QuantumThreat BTC

## Overview

This roadmap delivers a curated resource hub for Bitcoin quantum resistance research in four phases. Starting with database foundation and controlled taxonomy (Phase 1), we build the public discovery interface (Phase 2), then secure admin authentication (Phase 3), and finally content management capabilities (Phase 4). Each phase delivers a complete, verifiable capability that brings us closer to the core value: users finding quantum-Bitcoin information quickly and reliably.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation & Data Model** - Database schema with controlled taxonomy and search infrastructure
- [ ] **Phase 2: Public Discovery Interface** - Browse, search, filter, and view resources
- [ ] **Phase 3: Admin Authentication** - Secure admin access with defense-in-depth
- [ ] **Phase 4: Content Management** - Admin panel for resource CRUD operations

## Phase Details

### Phase 1: Foundation & Data Model
**Goal**: Database and taxonomy infrastructure ready for content curation
**Depends on**: Nothing (first phase)
**Requirements**: DATA-01, DATA-02, DATA-03, DATA-04, DATA-05
**Success Criteria** (what must be TRUE):
  1. PostgreSQL database exists with Resources and Tags tables
  2. Full-text search indexes (GIN) are configured and tested
  3. Controlled tag vocabulary system prevents duplicate/inconsistent tags
  4. Database includes staleness detection metadata (last_verified timestamp)
  5. Backup and restore procedures are documented and tested
**Plans**: 8 plans (5 original + 3 gap closure)

Plans:
- [x] 01-01-PLAN.md — Next.js 16 project initialization with TypeScript and Biome
- [x] 01-02-PLAN.md — Drizzle schema with Resources and Tags tables, migrations
- [x] 01-03-PLAN.md — Meilisearch setup via Docker with index configuration
- [x] 01-04-PLAN.md — Database seeding with quantum-Bitcoin resources and smoke test
- [x] 01-05-PLAN.md — Backup/restore documentation and validation procedures
- [ ] 01-06-PLAN.md — [GAP] Biome lint fixes: non-null assertions, formatter, drizzle/meta exclusion
- [ ] 01-07-PLAN.md — [GAP] Meilisearch seed: await task completion before process exit
- [ ] 01-08-PLAN.md — [GAP] backup.sh and restore.sh auto-load .env

### Phase 2: Public Discovery Interface
**Goal**: Users can discover, search, filter, and explore quantum-Bitcoin resources
**Depends on**: Phase 1
**Requirements**: DISC-01, DISC-02, DISC-03, DISC-04, DISC-05, DISP-01, DISP-02, DISP-03, DISP-04, DISP-05, DISP-06, FILT-01, FILT-02, FILT-03, FILT-04, FILT-05, FILT-06
**Success Criteria** (what must be TRUE):
  1. User can perform full-text search across resource titles, authors, and summaries
  2. User can browse resources by category (Papers, BIPs, Articles, Research)
  3. User can filter resources by type, date range, technical level, and tags simultaneously
  4. User can view individual resource detail pages with all metadata (title, author, date, summary, type, technical level, tags)
  5. User can access external source via direct link from resource page
  6. User can view resources in chronological timeline order
  7. Filter state appears in URL and can be shared as links
  8. All pages work correctly on mobile devices
**Plans**: TBD
**UI hint**: yes

### Phase 3: Admin Authentication
**Goal**: Admin can securely access protected routes with defense-in-depth security
**Depends on**: Phase 2
**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05, AUTH-06
**Success Criteria** (what must be TRUE):
  1. Admin can log in with credentials and multi-factor authentication
  2. Admin session persists across browser refresh
  3. Admin can log out from any admin page
  4. Admin routes reject unauthenticated requests with proper redirects
  5. Admin panel access is restricted by IP allowlisting
  6. Authentication uses defense-in-depth pattern (middleware + action-level checks)
**Plans**: TBD

### Phase 4: Content Management
**Goal**: Admin can create, edit, and delete resources through admin panel
**Depends on**: Phase 3
**Requirements**: ADMN-01, ADMN-02, ADMN-03, ADMN-04, ADMN-05, ADMN-06
**Success Criteria** (what must be TRUE):
  1. Admin can create new resources with all metadata fields (title, author, date, type, summary, technical level, tags, external link)
  2. Admin can edit existing resources and changes appear immediately on public pages
  3. Admin can delete resources with confirmation
  4. Admin can manage controlled tag vocabulary (add new tags, rename existing)
  5. Admin can view dashboard with content statistics (total resources, resources by type, recent additions)
  6. Admin changes trigger automatic revalidation of affected public pages
**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Data Model | 5/8 | Gap closure in progress | - |
| 2. Public Discovery Interface | 0/TBD | Not started | - |
| 3. Admin Authentication | 0/TBD | Not started | - |
| 4. Content Management | 0/TBD | Not started | - |
