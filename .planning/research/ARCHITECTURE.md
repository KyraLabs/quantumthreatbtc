# Architecture Research

**Domain:** Resource Hub / Knowledge Management Platform
**Researched:** 2026-04-15
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                       │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │ Browse  │  │ Search  │  │ Filter  │  │ Admin   │        │
│  │ Pages   │  │  UI     │  │  UI     │  │  Panel  │        │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘        │
│       │            │            │            │              │
├───────┴────────────┴────────────┴────────────┴──────────────┤
│                      SERVER LAYER                            │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Server Components & Route Handlers        │   │
│  │  ┌─────────────┐  ┌──────────────┐  ┌────────────┐  │   │
│  │  │   Data      │  │  Search      │  │   Auth     │  │   │
│  │  │   Fetching  │  │  Processing  │  │  Middleware│  │   │
│  │  └─────────────┘  └──────────────┘  └────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                       DATA LAYER                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                  PostgreSQL Database                  │   │
│  │  ┌────────────┐  ┌─────────────┐  ┌─────────────┐   │   │
│  │  │ Resources  │  │  Resource   │  │    Admin    │   │   │
│  │  │   Table    │  │    Tags     │  │    Users    │   │   │
│  │  └────────────┘  └─────────────┘  └─────────────┘   │   │
│  │                                                        │   │
│  │  Indexes: GIN (full-text), B-tree (filters), Dates   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| **Browse Pages** | Display resources in categories, enable navigation | Next.js Server Components with static/ISR rendering |
| **Search UI** | Accept user queries, display results | Client Component + URL params for state management |
| **Filter UI** | Multi-criteria filtering (type, date, tags, level) | Client Component reading URL search params |
| **Admin Panel** | CRUD operations for resources, protected routes | Server Components + Server Actions for mutations |
| **Server Components** | Fetch data, execute queries, render on server | Next.js App Router async Server Components |
| **Route Handlers** | API endpoints for specific operations | Next.js Route Handlers (app/api/*) |
| **Auth Middleware** | Verify admin identity, protect admin routes | NextAuth/Auth.js with middleware verification |
| **Data Access Layer** | Type-safe database queries via ORM | Prisma Client with generated types |
| **Database** | Persistent storage, search, filtering | PostgreSQL 15+ with full-text search extensions |

## Recommended Project Structure

```
quantumthreatbtc/
├── app/                        # Next.js App Router
│   ├── (public)/               # Public routes group
│   │   ├── page.tsx            # Homepage with featured resources
│   │   ├── browse/
│   │   │   ├── [category]/
│   │   │   │   └── page.tsx    # Category-filtered resource lists
│   │   │   └── page.tsx        # All resources browse page
│   │   ├── resource/
│   │   │   └── [id]/
│   │   │       └── page.tsx    # Individual resource detail page
│   │   ├── timeline/
│   │   │   └── page.tsx        # Temporal visualization of resources
│   │   └── search/
│   │       └── page.tsx        # Search results page
│   ├── (admin)/                # Admin routes group
│   │   ├── layout.tsx          # Admin layout with auth check
│   │   ├── dashboard/
│   │   │   └── page.tsx        # Admin dashboard
│   │   ├── resources/
│   │   │   ├── page.tsx        # List resources (admin view)
│   │   │   ├── new/
│   │   │   │   └── page.tsx    # Create new resource
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx # Edit existing resource
│   │   └── api/
│   │       └── auth/
│   │           └── [...nextauth]/
│   │               └── route.ts # NextAuth/Auth.js handler
│   ├── api/                    # API Route Handlers
│   │   └── resources/
│   │       ├── route.ts        # GET all, POST new
│   │       └── [id]/
│   │           └── route.ts    # GET, PATCH, DELETE by ID
│   └── layout.tsx              # Root layout
├── components/                 # React components
│   ├── ui/                     # Reusable UI primitives
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Card.tsx
│   ├── resources/              # Resource-specific components
│   │   ├── ResourceCard.tsx
│   │   ├── ResourceList.tsx
│   │   ├── ResourceFilters.tsx
│   │   └── ResourceSearch.tsx
│   ├── timeline/
│   │   └── TimelineView.tsx
│   └── admin/
│       ├── ResourceForm.tsx
│       └── AdminNav.tsx
├── lib/                        # Shared utilities
│   ├── prisma.ts               # Prisma client singleton
│   ├── auth.ts                 # Auth configuration
│   ├── db/                     # Database utilities
│   │   ├── resources.ts        # Resource queries
│   │   └── search.ts           # Search/filter logic
│   ├── validations/            # Zod schemas
│   │   └── resource.ts
│   └── utils.ts                # General utilities
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Migration history
└── types/
    └── index.ts                # TypeScript types
```

### Structure Rationale

- **Route groups `(public)` and `(admin)`:** Organize routes without affecting URLs, enable different layouts per group
- **Colocated API routes:** Keep API handlers close to the features they serve
- **Component organization:** Separate UI primitives from domain-specific components
- **lib/ directory:** Centralize business logic, database access, and utilities away from UI components
- **Prisma schema:** Single source of truth for database structure with type generation

## Architectural Patterns

### Pattern 1: Server Component Data Fetching

**What:** Fetch data directly in Server Components using async/await, eliminating client-side data fetching libraries

**When to use:** Default pattern for all data display; public pages, resource lists, individual resource views

**Trade-offs:**
- **Pro:** Automatic request deduplication, reduced client bundle, better SEO, faster initial load
- **Con:** Cannot use React hooks, requires understanding RSC boundaries

**Example:**
```typescript
// app/(public)/browse/[category]/page.tsx
import { prisma } from '@/lib/prisma'

interface PageProps {
  params: { category: string }
}

export default async function CategoryPage({ params }: PageProps) {
  const resources = await prisma.resource.findMany({
    where: {
      type: params.category,
      published: true
    },
    orderBy: { publicationDate: 'desc' },
    include: { tags: true }
  })

  return <ResourceList resources={resources} />
}
```

### Pattern 2: URL-Based Filter State

**What:** Store filter and search state in URL search params instead of client state, enabling shareable links and server-side filtering

**When to use:** All filtering, sorting, and search features

**Trade-offs:**
- **Pro:** Shareable URLs, browser history, server-side filtering with RSC
- **Con:** More complex state management than client state

**Example:**
```typescript
// app/(public)/search/page.tsx
import { prisma } from '@/lib/prisma'
import { SearchFilters } from '@/components/resources/SearchFilters'

interface SearchPageProps {
  searchParams: {
    q?: string
    type?: string
    level?: string
    date_from?: string
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, type, level, date_from } = searchParams

  const resources = await prisma.resource.findMany({
    where: {
      ...(q && {
        OR: [
          { title: { search: q } },
          { summary: { search: q } }
        ]
      }),
      ...(type && { type }),
      ...(level && { technicalLevel: level }),
      ...(date_from && {
        publicationDate: { gte: new Date(date_from) }
      })
    }
  })

  return (
    <>
      <SearchFilters />
      <ResourceList resources={resources} />
    </>
  )
}
```

### Pattern 3: Server Actions for Mutations

**What:** Use Server Actions for data mutations (create, update, delete) instead of API routes

**When to use:** Admin panel forms, resource management

**Trade-offs:**
- **Pro:** Type-safe, automatic serialization, progressive enhancement, built-in revalidation
- **Con:** Only available in Server Components, requires 'use server' directive

**Example:**
```typescript
// app/(admin)/resources/actions.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { resourceSchema } from '@/lib/validations/resource'

export async function createResource(formData: FormData) {
  const data = {
    title: formData.get('title'),
    link: formData.get('link'),
    type: formData.get('type'),
    summary: formData.get('summary'),
    // ... other fields
  }

  const validated = resourceSchema.parse(data)

  const resource = await prisma.resource.create({
    data: validated
  })

  revalidatePath('/browse')
  redirect(`/resource/${resource.id}`)
}
```

### Pattern 4: Defense-in-Depth Authentication

**What:** Verify authentication at multiple layers (middleware + data access) instead of relying solely on middleware

**When to use:** All admin routes and mutations

**Trade-offs:**
- **Pro:** Prevents CVE-2025-29927 bypass attacks, robust security
- **Con:** Slight code duplication

**Example:**
```typescript
// middleware.ts
import { withAuth } from 'next-auth/middleware'

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token
  }
})

export const config = { matcher: ['/admin/:path*'] }

// app/(admin)/resources/actions.ts
'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function deleteResource(id: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.isAdmin) {
    throw new Error('Unauthorized')
  }

  await prisma.resource.delete({ where: { id } })
  revalidatePath('/admin/resources')
}
```

### Pattern 5: PostgreSQL Full-Text Search

**What:** Use PostgreSQL's native full-text search with tsvector and GIN indexes instead of external search services

**When to use:** Search functionality across title, summary, author, and content fields

**Trade-offs:**
- **Pro:** No external dependencies, cost-effective, sufficient for small-to-medium scale
- **Con:** Less feature-rich than Elasticsearch for very large datasets

**Example:**
```prisma
// prisma/schema.prisma
model Resource {
  id               String   @id @default(cuid())
  title            String
  summary          String   @db.Text
  titleVector      Unsupported("tsvector")?
  summaryVector    Unsupported("tsvector")?

  @@index([titleVector], type: Gin)
  @@index([summaryVector], type: Gin)
}
```

```typescript
// lib/db/search.ts
import { prisma } from '@/lib/prisma'

export async function searchResources(query: string) {
  const tsQuery = query.replace(/\s+/g, ' & ')

  return prisma.$queryRaw`
    SELECT *,
      ts_rank(title_vector, to_tsquery('english', ${tsQuery})) +
      ts_rank(summary_vector, to_tsquery('english', ${tsQuery})) as rank
    FROM resources
    WHERE title_vector @@ to_tsquery('english', ${tsQuery})
       OR summary_vector @@ to_tsquery('english', ${tsQuery})
    ORDER BY rank DESC
    LIMIT 50
  `
}
```

## Data Flow

### Request Flow

```
[User Visits /search?q=quantum]
    ↓
[Next.js App Router] → [Server Component] → [Prisma Query] → [PostgreSQL]
    ↓                        ↓                   ↓                ↓
[HTML Response]     ← [Render RSC]      ← [Type-safe Data] ← [Query Result]
```

### Admin Mutation Flow

```
[Admin Submits Form]
    ↓
[Server Action (use server)] → [Auth Check] → [Validation (Zod)] → [Prisma Mutation] → [PostgreSQL]
    ↓                               ↓              ↓                    ↓                   ↓
[Redirect]              ← [revalidatePath] ← [Success]        ← [Write]          ← [Transaction]
```

### Search & Filter Flow

```
[User Types Query + Applies Filters]
    ↓
[URL Updates (?q=quantum&type=paper&level=advanced)]
    ↓
[Next.js Router] → [Server Component Re-render] → [Filtered Query] → [PostgreSQL Full-Text Search]
    ↓                       ↓                           ↓                       ↓
[New Results]      ← [Render List]              ← [Type-safe Data]     ← [GIN Index Scan]
```

### Key Data Flows

1. **Resource Discovery:** User → Browse/Search UI → URL params → Server Component → Prisma → PostgreSQL → Rendered Results
2. **Resource Creation:** Admin → Form → Server Action → Auth → Validation → Prisma → PostgreSQL → Revalidate cache → Redirect
3. **Timeline View:** User → Timeline Page → Server Component → Temporal Query (ORDER BY publicationDate) → Grouped Results → Timeline Visualization

## Database Schema Design

### Core Tables

```prisma
// prisma/schema.prisma
model Resource {
  id               String   @id @default(cuid())
  title            String
  link             String
  publicationDate  DateTime
  type             ResourceType
  authors          String[]
  summary          String   @db.Text
  relevance        String   @db.Text
  technicalLevel   TechnicalLevel
  curatorNotes     String?  @db.Text
  published        Boolean  @default(false)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  tags             Tag[]    @relation("ResourceTags")

  // Full-text search
  titleVector      Unsupported("tsvector")?
  summaryVector    Unsupported("tsvector")?

  @@index([type])
  @@index([technicalLevel])
  @@index([publicationDate])
  @@index([published])
  @@index([titleVector], type: Gin)
  @@index([summaryVector], type: Gin)
}

model Tag {
  id        String     @id @default(cuid())
  name      String     @unique
  slug      String     @unique
  resources Resource[] @relation("ResourceTags")

  @@index([slug])
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String
  isAdmin       Boolean   @default(false)
  createdAt     DateTime  @default(now())
}

enum ResourceType {
  PAPER
  BIP
  ARTICLE
  RESEARCH
}

enum TechnicalLevel {
  BEGINNER
  INTERMEDIATE
  ADVANCED
  EXPERT
}
```

### Index Strategy

- **GIN indexes** on `tsvector` fields for full-text search performance
- **B-tree indexes** on frequently filtered fields (type, technicalLevel, published)
- **Date index** on publicationDate for timeline queries and date-range filtering
- **Composite indexes** if specific filter combinations become common (defer until needed)

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-10k resources | Monolith architecture is optimal; PostgreSQL full-text search handles this scale easily |
| 10k-100k resources | Add read replicas for PostgreSQL; implement ISR (Incremental Static Regeneration) for popular pages; consider CDN caching |
| 100k+ resources | Consider dedicated search service (Meilisearch or Typesense); separate read/write databases; implement proper cache invalidation strategy |

### Scaling Priorities

1. **First bottleneck:** Database query performance on search/filter operations
   - **Solution:** Optimize indexes, use EXPLAIN ANALYZE, add materialized views for complex aggregations
   - **When:** Query times exceed 200ms consistently

2. **Second bottleneck:** Build times in CI/CD as pages grow
   - **Solution:** Implement ISR instead of SSG, use Turborepo for caching, split into Modular Monolith
   - **When:** Build times exceed 15 minutes

3. **Third bottleneck:** Concurrent admin writes causing conflicts
   - **Solution:** Optimistic UI updates, implement conflict resolution, consider event sourcing
   - **When:** Multiple curators editing simultaneously

## Anti-Patterns

### Anti-Pattern 1: Client-Side Filtering of Server Data

**What people do:** Fetch all resources to client, filter using useState/useEffect

**Why it's wrong:**
- Sends unnecessary data to client (bandwidth waste)
- Slower than database filtering
- Breaks with pagination
- Cannot share filtered URLs

**Do this instead:** Use URL search params + Server Component filtering

```typescript
// BAD: Client-side filtering
'use client'
export default function ResourceList({ allResources }) {
  const [filtered, setFiltered] = useState(allResources)
  const [type, setType] = useState('')

  useEffect(() => {
    setFiltered(allResources.filter(r => r.type === type))
  }, [type])

  return <div>...</div>
}

// GOOD: Server-side filtering
export default async function ResourceList({ searchParams }) {
  const resources = await prisma.resource.findMany({
    where: { type: searchParams.type }
  })

  return <ResourceList resources={resources} />
}
```

### Anti-Pattern 2: Middleware-Only Authentication

**What people do:** Protect routes only with Next.js middleware

**Why it's wrong:**
- Vulnerable to CVE-2025-29927 header manipulation bypass
- No protection at data access layer
- Easy to forget to protect new routes

**Do this instead:** Defense-in-depth with middleware + server-side session checks

```typescript
// BAD: Only middleware
export default withAuth(/* config */)

// GOOD: Middleware + server checks
export default withAuth(/* config */)

// Plus in every protected action:
export async function deleteResource(id: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.isAdmin) throw new Error('Unauthorized')
  // ... mutation
}
```

### Anti-Pattern 3: Over-Normalization of Content Metadata

**What people do:** Create separate tables for every metadata field (Authors, Publishers, Sources, etc.)

**Why it's wrong:**
- Complex joins for simple displays
- Over-engineering for read-heavy workload
- PostgreSQL JSONB/arrays handle this well

**Do this instead:** Use PostgreSQL arrays for simple lists, JSONB for complex metadata

```prisma
// BAD: Over-normalized
model Resource {
  id      String @id
  authors Author[]
}

model Author {
  id         String @id
  name       String
  resources  Resource[]
}

// GOOD: Arrays for simple cases
model Resource {
  id      String   @id
  authors String[] // ["Alice", "Bob"] - simple and fast
}

// GOOD: JSONB for complex metadata
model Resource {
  id       String @id
  metadata Json   // { authors: [{name, affiliation, orcid}], ... }
}
```

### Anti-Pattern 4: Using External Search Service Prematurely

**What people do:** Add Elasticsearch/Algolia from day one for "better search"

**Why it's wrong:**
- Additional infrastructure complexity and cost
- PostgreSQL full-text search sufficient for <100k records
- More moving parts to maintain

**Do this instead:** Start with PostgreSQL full-text search, migrate only when necessary

**When to switch:** Query times consistently >500ms, need advanced features (typo tolerance, faceting), scale >100k resources

### Anti-Pattern 5: Building Custom Timeline Visualization Too Early

**What people do:** Implement complex interactive timeline with custom D3.js visualization in v1

**Why it's wrong:**
- High implementation complexity
- Uncertain if users want this feature
- Simple chronological list often sufficient initially

**Do this instead:** Start with sorted list grouped by year, add visualization only after validating user need

```typescript
// v1: Simple grouped list
const resourcesByYear = await prisma.resource.groupBy({
  by: ['publicationDate'],
  orderBy: { publicationDate: 'desc' }
})

// v2+: Add visualization if validated
```

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| **NextAuth/Auth.js** | Configuration in lib/auth.ts, handlers in app/api/auth | Use database session strategy for admin users; credentials provider with bcrypt |
| **Vercel/Deployment** | Git-based deployment with env vars | Set DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL |
| **PostgreSQL** | Prisma Client via connection string | Use connection pooling (PgBouncer) if serverless |
| **Email (future)** | Resend/SendGrid for admin notifications | Defer to v2; not needed for manual curation |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| **Server Component ↔ Database** | Prisma Client | Direct queries in async Server Components |
| **Client Component ↔ Server** | Server Actions, Route Handlers | Server Actions for mutations, Route Handlers for API endpoints |
| **Admin ↔ Public** | Separate route groups | Shared components in /components, different layouts |
| **Search ↔ Database** | PostgreSQL FTS via Prisma raw queries | Type-safe with sql`` template or $queryRaw |

## Build Order Recommendations

Based on component dependencies, suggested implementation order:

### Phase 1: Foundation
1. Database schema (Resource, Tag models)
2. Prisma setup with migrations
3. Seed data for development

### Phase 2: Public Display
4. Public layout and homepage
5. Browse by category (Server Component pattern)
6. Individual resource detail pages

### Phase 3: Search & Filter
7. URL-based filter infrastructure
8. PostgreSQL full-text search setup
9. Search UI and results page
10. Filter UI components

### Phase 4: Admin Panel
11. Authentication (NextAuth setup)
12. Admin layout with auth middleware
13. Resource CRUD with Server Actions
14. Admin dashboard

### Phase 5: Polish
15. Timeline view (temporal visualization)
16. Advanced filtering (multi-select, date ranges)
17. Performance optimization (indexes, caching)

**Rationale:** Public display validates core value (resource discovery) before building admin tools; search/filter builds on proven display patterns; admin comes after public UX is validated; timeline is deferred as nice-to-have feature.

## Sources

**HIGH Confidence:**
- Next.js Official Docs - App Router Architecture (https://nextjs.org/docs/app)
- Context7: Next.js documentation on Server Components, data fetching, App Router patterns
- Context7: Prisma schema design, relations, indexing best practices
- PostgreSQL Full-Text Search Official Docs (https://www.postgresql.org/docs/current/textsearch.html)
- Better Stack: Full-Text Search in Postgres with TypeScript (2025)

**MEDIUM Confidence:**
- WorkOS: Building authentication in Next.js App Router guide (2026)
- Enterprise Knowledge: Knowledge Portal Architecture (verified pattern alignment)
- DEV Community: Filtering with React Server Components and URL Search Params (verified implementation)
- Hygraph/Sanity: Headless CMS architecture patterns (contextual reference for content modeling)

**Pattern Verification:**
- Multiple sources confirm: Start with monolith for <50 engineers, modular monolith for growth
- Multiple sources confirm: PostgreSQL FTS sufficient for <100k records
- Multiple sources confirm: CVE-2025-29927 requires defense-in-depth auth
- Multiple sources confirm: URL-based state for RSC filtering is the recommended pattern

---
*Architecture research for: Resource Hub / Knowledge Management Platform*
*Researched: 2026-04-15*
