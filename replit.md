# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Artifacts

### SENSOTECH - Smart Farming Ecosystem (`artifacts/sensotech`)
- React + Vite frontend-only app at path `/`
- 6-step multi-page flow:
  1. **Login** — Farm background, SENSOTECH logo, Google sign-in button
  2. **Language Selection** — 8 language grid (English, Marathi, Hindi, Tamil, Telugu, Kannada, Gujarati, Punjabi)
  3. **Farmer Profile Setup** — Name, mobile, address, serial number (disabled, hardcoded 001)
  4. **Home Screen (My Farms)** — 3 farm cards (Mauli/Lemon, Sarvadnya/Mushroom, Kranti/Pomegranate), bottom nav (Community/Home/News), profile popup
  5. **Farm Dashboard** — Weather 5-day forecast for Akola, 5 circular sensor charts, pump toggle, bottom nav with AI/Mic/Expert
  6. **AI Advisor** — Crop recommendation, fertilizer guide, watering schedule
- Auto day/night mode: 6PM-6AM activates dark mode + brightness reduction
- Farm background images, dark translucent overlays throughout
- Uses lucide-react icons, framer-motion available, recharts available

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
