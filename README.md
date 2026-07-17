# QuantumThreat BTC

A curated resource hub centralizing information about the quantum threat to
Bitcoin: academic papers, BIPs, articles, YouTube videos, Delving Bitcoin posts,
and mailing-list threads, all gathered in one searchable place.

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + React
- TypeScript
- Tailwind CSS
- [Biome](https://biomejs.dev) for linting and formatting
- [pnpm](https://pnpm.io) as package manager (pinned via `packageManager`)

## Getting started

This repo pins pnpm through the `packageManager` field, so [Corepack](https://nodejs.org/api/corepack.html)
will use the right version automatically:

```bash
corepack enable
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `pnpm dev` — start the dev server
- `pnpm build` — production build
- `pnpm start` — run the production build
- `pnpm lint` — check with Biome
- `pnpm format` — format with Biome

## Notes

- `sharp` build scripts are intentionally not run (`allowBuilds.sharp: false` in
  `pnpm-workspace.yaml`). Next.js image optimization is handled by the hosting
  platform, and sharp ships prebuilt binaries, so its install script is not
  needed. If self-hosting image optimization ever requires it, approve it with
  `pnpm approve-builds sharp`.
