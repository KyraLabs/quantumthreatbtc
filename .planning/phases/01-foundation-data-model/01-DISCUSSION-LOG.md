# Phase 1: Foundation & Data Model - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-15
**Phase:** 01-foundation-data-model
**Areas discussed:** Database Schema, Search Infrastructure, Backup/Restore Procedures, Project Structure, Data Management, ORM Choice

---

## Database Schema

### Resources-Tags Relationship

| Option | Description | Selected |
|--------|-------------|----------|
| Tabla de unión normalizada (resource_tags) | Modelo clásico relacional: tabla intermedia para many-to-many. Más estructura, queries más complejas pero integridad referencial fuerte. | |
| Array JSONB en Resources.tags | Tags como array JSON en la tabla Resources. Queries más simples, flexible para metadata adicional por tag. PostgreSQL 18 tiene GIN indexes potentes para JSONB. | ✓ |
| Híbrido: tabla Tags + JSONB metadata | Tabla Tags controlada para vocabulario, pero Resources.tags como JSONB array con metadata extra. Combina control y flexibilidad. | |

**User's choice:** Array JSONB en Resources.tags
**Notes:** Aprovecha GIN indexes de PostgreSQL 18, simplifica queries, mantiene flexibilidad para metadata por tag.

### Metadata Variable Storage

| Option | Description | Selected |
|--------|-------------|----------|
| Columnas individuales estrictas | author_name, author_email, doi como TEXT columns. Schema rígido, queries simples. Límite: autores múltiples requieren normalización. | |
| Columna JSONB para metadata flexible | Columnas core (title, type, date) + metadata variable en campo JSONB. Máxima flexibilidad sin migraciones. | |
| Mix: core columns + extras JSONB | Campos comunes como columnas, metadata poco común en JSONB 'extras'. Balance entre query simplicity y flexibilidad. | ✓ |

**User's choice:** Mix: core columns + extras JSONB
**Notes:** Core fields (title, summary, type, date, external_link, technical_level, authors) como columnas para queries simples. Metadata especializada (DOI, conference, affiliation) en JSONB.

### Tags Table Schema

| Option | Description | Selected |
|--------|-------------|----------|
| Solo (id, name, slug) | Tabla minimalista. Tags solo identifican categorías. Suficiente para v1. | ✓ (Claude) |
| Con descripción y contador | Añade description, usage_count. UI más rica, stats en admin panel. | |
| Tú decides | Claude elige mínimo viable. | ✓ |

**User's choice:** Tú decides
**Notes:** Claude elegirá (id, name, slug) para v1 — vocabulario controlado sin complejidad extra.

---

## Search Infrastructure

### Search Engine Choice

| Option | Description | Selected |
|--------|-------------|----------|
| PostgreSQL nativo (tsvector + GIN) | Capacidades built-in: tsvector, tsquery, GIN indexes. Sin infraestructura adicional. Límite: no typo tolerance, ranking básico. | |
| Meilisearch (externo) | Motor especializado: typo-tolerant, ranking superior, admin UI. Stack RECOMIENDA para content hubs. Trade-off: infraestructura adicional. | ✓ |
| Typesense (externo) | Más rápido (<50ms), más RAM, clustering. Mejor para high-traffic. Overkill para v1. | |

**User's choice:** Meilisearch (externo)
**Notes:** Alinea con stack recomendado, mejor UX desde v1 (typo tolerance, ranking superior). Setup <5 minutos.

### Search Field Weighting

| Option | Description | Selected |
|--------|-------------|----------|
| Title (alto), Summary (medio), Authors (bajo) | Ponderación clásica: title match más relevante. Suficiente para resource hub. | ✓ (Claude) |
| Todo igual (title, summary, authors, tags) | Sin ponderación: match en cualquier campo tiene igual peso. | |
| Tú decides | Claude configura según best practices. | ✓ |

**User's choice:** Tú decides
**Notes:** Claude configurará title > summary > authors, tags searchable sin peso. Sigue best practices para resource discovery.

---

## Backup/Restore Procedures

### Backup Strategy Rigor

| Option | Description | Selected |
|--------|-------------|----------|
| Confiar en backups de Vercel Postgres | Vercel hace backups automáticos (daily snapshots). Documentar restore desde Vercel UI, probar una vez. | ✓ |
| Backups adicionales a S3/almacenamiento externo | Además de Vercel, script pg_dump a S3. Más control, backup offsite. Overhead de infraestructura. | |
| Tú decides | Claude evalúa criticidad vs overhead. | |

**User's choice:** Confiar en backups de Vercel Postgres
**Notes:** Para v1 de resource hub (datos curables manualmente), Vercel backups suficientes. Reduce complejidad.

### Backup Validation Method

| Option | Description | Selected |
|--------|-------------|----------|
| Restore test en DB staging | Crear BD staging, restaurar backup, verificar datos completos. Más riguroso. | |
| Documentar proceso + smoke test | Docs paso a paso para restore. Smoke test una vez (restaurar, verificar sample). Suficiente para v1. | ✓ |
| Tú decides | Claude elige mínimo que cumple DATA-05. | |

**User's choice:** Documentar proceso + smoke test
**Notes:** Cumple DATA-05 requirement ("tested") sin overhead de ambiente staging para v1.

---

## Project Structure

### Directory Structure

| Option | Description | Selected |
|--------|-------------|----------|
| app/ root (recomendado Next.js 16) | Estructura moderna: app/ para routes, lib/ para utilities, components/ para UI. Alinea con docs oficiales. | ✓ |
| src/app/ (organización src/) | Todo dentro de src/. Más organización, separa source de config. Preferencia personal. | |
| Tú decides | Claude sigue Next.js 16 best practices. | |

**User's choice:** app/ root (recomendado Next.js 16)
**Notes:** Estructura oficial de Next.js 16. Menos nesting, alineación con docs.

### Naming Conventions

| Option | Description | Selected |
|--------|-------------|----------|
| PascalCase components, camelCase functions | Estándar React: ResourceCard.tsx, getResources(). Sin sorpresas. | ✓ (Claude) |
| kebab-case files, PascalCase exports | Archivos kebab-case (resource-card.tsx), exports PascalCase. Algunos prefieren lowercase filenames. | |
| Tú decides | Claude sigue convenciones React ecosystem. | ✓ |

**User's choice:** Tú decides
**Notes:** Claude usará PascalCase para components, camelCase para utilities — estándar Next.js/React.

---

## Data Management

### Seed Data Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Sí, con sample resources | Script inserta 10-20 recursos ejemplo (papers, BIPs, articles) con metadata realista. Útil para UI testing. | ✓ |
| Solo tags iniciales controlados | Seed tabla Tags con vocabulario inicial. Resources se agregan manualmente. | |
| No, base de datos vacía | BD vacía, admin añade todo manualmente. Realista pero menos conveniente para desarrollo. | |

**User's choice:** Sí, con sample resources
**Notes:** Facilita testing del frontend (Phase 2). Sample resources con metadata realista de quantum-Bitcoin research.

### Migration Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Drizzle Kit migrations (recomendado stack) | Genera SQL migrations desde schema TypeScript. Type-safe, versionado automático. | ✓ |
| SQL migrations manuales versionadas | SQL files manuales (001_init.sql, 002_add_tags.sql). Más control, sin type safety. | |
| Prisma migrations | prisma migrate dev/deploy. Más automation, overhead de Prisma. | |

**User's choice:** Drizzle Kit migrations (recomendado stack)
**Notes:** Mantiene consistencia con stack, type safety, versionado automático.

---

## ORM Choice

### Query Builder Selection

| Option | Description | Selected |
|--------|-------------|----------|
| Drizzle ORM (recomendado stack) | Ligero (7.4kb), SQL-like TypeScript API, sin code generation. 10-20% overhead vs raw SQL. Query control + performance. | ✓ |
| Prisma 7 | Más abstraction, mejor DX para teams nuevos a SQL. 2-4x slower, bundle 1.6MB. Genera types automáticamente. | |
| postgres.js (raw SQL) | Sin ORM, queries SQL directas. Máximo control y performance. Más boilerplate. | |

**User's choice:** Drizzle ORM (recomendado stack)
**Notes:** Alinea con stack, mantiene performance óptima, query control para filtrado complejo.

---

## Claude's Discretion

Areas where user deferred to Claude:
- Tags table exact schema (decided: id, name, slug minimal for v1)
- Meilisearch field weighting configuration (decided: title > summary > authors)
- File naming conventions (decided: follow Next.js/React standards)
- GIN index configuration details
- Seed resource content examples
- Environment variable structure

## Deferred Ideas

None — discussion stayed within phase 1 scope (data foundation only).
