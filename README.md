# Reptiles — საქართველოს ცხოველთა ატლასი

Bilingual atlas of animals of Georgia: species profiles, identification, range, and field context. Live at **[reptiles.ge](https://reptiles.ge)**.

Georgian is canonical. English is a full alternate (`/en/…`), not a machine overlay.

Herpetofauna (snakes, lizards, turtles, amphibians) is the core, aligned with Tarkhnishvili et al. 2026. Birds and mammals are present as hubs and profiles.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router) + React 19
- [next-intl](https://next-intl.dev) (KA default, EN prefixed)
- TypeScript, Tailwind CSS 4

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Species MDX is compiled automatically (`predev` / `prebuild`).

```bash
npm run lint
npm run species:compile
```

## Content

Profiles live in `src/content/species/{scientific-id}/ka.mdx` and `en.mdx`. `predev` / `prebuild` compile them to a gitignored catalog — do not commit or edit that file.

Range on a species or region page comes from `src/data/regions.ts`. Localities are not inferred from habitat or neighbouring regions.

Agents and contributors: read **[AGENTS.md](./AGENTS.md)** before changing taxonomy, URLs, or copy.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Compile species, start Next.js |
| `npm run build` | Production build |
| `npm run species:compile` | MDX → generated catalog |
| `npm run images:optimize` | Image pipeline (CDN / OG) |

## License

Photographs and species text remain with their credited authors and cited sources. Source code in this repository is all rights reserved unless a license file is added.
