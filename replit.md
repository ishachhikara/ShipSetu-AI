# ShilpSetu AI

A mobile-first AI business assistant prototype that helps rural artisans turn handmade work into polished listings, confident prices, and buyer connections.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- `pnpm --filter @workspace/shilpsetu-ai run dev` — run the ShilpSetu AI frontend

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/shilpsetu-ai/src/App.tsx` — the complete demo flow, local state, navigation, and reusable UI
- `artifacts/shilpsetu-ai/src/index.css` — ShilpSetu visual tokens and responsive styling
- `artifacts/shilpsetu-ai/.replit-artifact/artifact.toml` — artifact routing and managed web workflow

## Architecture decisions

- The first build is frontend-only and uses local React state so the full hackathon journey remains usable without database setup or third-party integrations.
- The prototype uses a single shared shell and screen state rather than a backend router because the primary goal is a convincing, fully navigable demo.
- AI capabilities are represented with deterministic demo states and responses so the UI can later swap in real speech, catalogue, pricing, matching, or coaching services.

## Product

- Language selection and artisan onboarding for Meena Devi
- Product photo and voice/text description flow
- AI photo enhancement, catalogue generation, translation tabs, and smart pricing
- Marketplace listing publish flow with success state
- AI buyer matching, buyer details, offer sending, orders, and inventory
- AI Business Coach with quick questions and demo guidance
- Craft story and impact dashboard content

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
