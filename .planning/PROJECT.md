# QuantumThreat BTC

## What This Is

A curated resource hub centralizing all information about Bitcoin's quantum resistance. Users can discover, search, and filter academic papers, BIPs, articles, and research related to post-quantum threats to Bitcoin. The platform serves researchers, developers, and the broader Bitcoin community with rich metadata, analysis, and organization.

## Core Value

Users must be able to find the quantum-Bitcoin information they need quickly and reliably.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Users can browse resources organized by category (papers, BIPs, articles, research)
- [ ] Users can search resources by keywords
- [ ] Users can filter resources by type, technical level, date, and tags
- [ ] Users can view a timeline of quantum-Bitcoin developments
- [ ] Each resource displays title, link, publication date, type, authors, summary, relevance, technical level, tags, and curator notes
- [ ] Admin can add new resources through an admin panel
- [ ] Admin can edit existing resources
- [ ] Admin can delete resources
- [ ] Admin authentication protects content management
- [ ] Public users can access all content without registration

### Out of Scope

- Community features (comments, forums, user interaction) — v1 focuses on content discovery, not community building
- User accounts (profiles, favorites, personal lists) — no need for user state in v1
- Notification system (email alerts for new content) — defer to v2
- Internationalization — English-only for v1
- User-contributed content — manual curation only in v1
- Automatic content detection — manual addition ensures quality

## Context

The Bitcoin post-quantum security space has growing academic and technical research scattered across multiple sources: arXiv papers, GitHub repositories, Bitcoin Improvement Proposals, conference proceedings, and various blogs. Finding comprehensive, up-to-date information requires searching multiple platforms.

This project consolidates that scattered information into a single, searchable, well-organized resource. The curator's analysis and categorization add value beyond simple aggregation by providing context, relevance assessment, and technical level indicators.

Target audiences span different technical levels:
- Academic researchers studying cryptographic vulnerabilities
- Bitcoin core developers implementing quantum-resistant solutions
- Bitcoin community members wanting to understand the threat landscape

## Constraints

- **Tech Stack**: Modern web stack (React/Next.js or equivalent)
- **Data Storage**: Database (Postgres, MongoDB, or similar) for robust search and filtering
- **Access Model**: Public content, authenticated admin-only editing
- **Content Quality**: Manual curation to maintain high signal-to-noise ratio

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Public access, no user accounts | Removes friction for information access, aligns with core value of quick discovery | — Pending |
| Database over static files | Required for advanced search/filtering that defines core value | — Pending |
| Manual curation only | Ensures quality and relevance, avoids moderation complexity | — Pending |
| English-only v1 | Simplifies scope, most quantum/Bitcoin research published in English | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-15 after initialization*
