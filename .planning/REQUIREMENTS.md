# Requirements: QuantumThreat BTC

**Defined:** 2026-04-15
**Core Value:** Users must be able to find the quantum-Bitcoin information they need quickly and reliably

## v1 Requirements

### Content Discovery

- [ ] **DISC-01**: User can perform full-text search across resource titles, authors, and summaries
- [ ] **DISC-02**: User can browse resources by category (Papers, BIPs, Articles, Research)
- [ ] **DISC-03**: User can view resources in timeline/chronological order
- [ ] **DISC-04**: User can view individual resource detail pages with complete metadata
- [ ] **DISC-05**: User can access external source via direct link from resource page

### Filtering

- [ ] **FILT-01**: User can filter resources by type (Paper, BIP, Article, Research)
- [ ] **FILT-02**: User can filter resources by publication date range
- [ ] **FILT-03**: User can filter resources by technical level (Beginner, Intermediate, Advanced)
- [ ] **FILT-04**: User can filter resources by tags
- [ ] **FILT-05**: User can combine multiple filters simultaneously
- [ ] **FILT-06**: Filter state is reflected in URL for shareable links

### Resource Display

- [ ] **DISP-01**: Resource displays title, author(s), and publication date
- [ ] **DISP-02**: Resource displays summary/abstract
- [ ] **DISP-03**: Resource displays type (Paper, BIP, Article, Research)
- [ ] **DISP-04**: Resource displays technical level indicator
- [ ] **DISP-05**: Resource displays associated tags
- [ ] **DISP-06**: All pages are mobile responsive

### Admin Authentication

- [ ] **AUTH-01**: Admin can log in with credentials
- [ ] **AUTH-02**: Admin session persists across browser refresh
- [ ] **AUTH-03**: Admin can log out
- [ ] **AUTH-04**: Admin routes are protected with authentication middleware
- [ ] **AUTH-05**: Admin panel is protected with IP allowlisting
- [ ] **AUTH-06**: Admin account requires multi-factor authentication

### Admin Content Management

- [ ] **ADMN-01**: Admin can create new resources with all metadata fields
- [ ] **ADMN-02**: Admin can edit existing resources
- [ ] **ADMN-03**: Admin can delete resources
- [ ] **ADMN-04**: Admin can manage controlled tag vocabulary
- [ ] **ADMN-05**: Admin can view dashboard with content statistics
- [ ] **ADMN-06**: Admin changes trigger automatic revalidation of public pages

### Data Foundation

- [ ] **DATA-01**: Database schema includes Resources table with full-text search support
- [ ] **DATA-02**: Database schema includes controlled Tag vocabulary
- [ ] **DATA-03**: Database schema includes last_verified timestamp for staleness detection
- [ ] **DATA-04**: Database uses GIN indexes for full-text search performance
- [ ] **DATA-05**: Backup and restore procedures are tested and documented

## v2 Requirements

### Content Curation

- **CURE-01**: Admin can add curator notes with editorial context to resources
- **CURE-02**: Admin can assign relevance score (Critical/High/Medium/Low) to resources
- **CURE-03**: User can filter by relevance score
- **CURE-04**: User can see curator notes on resource detail pages

### Content Management

- **MGMT-01**: Admin receives notifications when resources become stale (180+ days)
- **MGMT-02**: Admin can mark resources as verified with timestamp
- **MGMT-03**: System detects broken external links automatically
- **MGMT-04**: Admin can view queue of stale/broken resources

### Advanced Search

- **SRCH-01**: User can use advanced search operators (AND, OR, NOT, quoted phrases)
- **SRCH-02**: Search supports typo tolerance
- **SRCH-03**: Search shows related/similar resources

### Discovery Enhancement

- **DISC-06**: User can export filtered resource lists (CSV, JSON)
- **DISC-07**: User can subscribe to RSS/Atom feed for new resources
- **DISC-08**: Timeline view includes interactive visualization with filtering

## Out of Scope

| Feature | Reason |
|---------|--------|
| User accounts and profiles | Adds friction to core value (quick discovery), no validated need for personalization in v1 |
| Comments and discussion forums | Massive moderation burden, dilutes focus from curation to community management |
| User-submitted content | Quality control impossible at scale, contradicts manual curation value proposition |
| Real-time auto-aggregation | Algorithm cannot assess quantum-Bitcoin relevance, loses curator expertise |
| Email notifications (v1) | Requires user accounts, adds complexity before validation |
| Internationalization | 95% of quantum/Bitcoin research published in English, defer until validated demand |
| Public API (v1) | No validated external use case, defer until user requests emerge |
| Save/bookmark functionality | Requires user accounts, users can bookmark browser-side |
| Social sharing buttons | Not core to discovery value, defer until traffic justifies |

## Traceability

Populated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| *To be populated by roadmap* | | |

**Coverage:**
- v1 requirements: 32 total
- Mapped to phases: 0 (pending roadmap)
- Unmapped: 32 ⚠️

---
*Requirements defined: 2026-04-15*
*Last updated: 2026-04-15 after initial definition*
