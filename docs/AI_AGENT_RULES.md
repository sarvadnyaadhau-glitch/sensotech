# SENSOTECH V2 — AI Agent Rules

## Mission
Build SENSOTECH from a clean V2 product architecture for an initial production target of 1,000 farmers, while keeping the architecture scalable toward 100,000+ users.

## Source of truth
GitHub is the source of truth. Read `docs/V2_MASTER_SPEC.md` before implementing product work.

## Non-negotiable rules
1. This is a V2 rebuild. Do not treat the old frontend as the product architecture.
2. Do not rebuild existing V2 work unless explicitly assigned.
3. Do not introduce fake/mock production data unless a task explicitly requests fixture data for tests.
4. Do not hardcode farmer IDs, farms, sensor readings, API keys, tokens, locations, prices, weather or government claims.
5. Never put secrets in client-side source code or commit `.env` files.
6. Define and preserve typed API contracts.
7. Validate all external input at boundaries.
8. Keep backend services stateless where practical so they can scale horizontally.
9. Long-running AI, satellite, image and notification jobs must be designed for asynchronous/background execution.
10. Avoid N+1 database queries; use indexes and pagination for user-facing lists.
11. Do not store large media blobs directly in PostgreSQL; use object storage references.
12. Farmer data must be isolated by authorization boundaries.
13. Show source/provenance and uncertainty for decision-support outputs when applicable.
14. Never guarantee diagnosis, yield, profit, price or accuracy.
15. Commercial/sponsored recommendations must be clearly distinguishable from neutral advice.
16. Preserve offline/low-data compatibility for rural usage.
17. Prefer simple farmer-facing workflows over exposing the complete capability inventory as menus.
18. Every module must have tests appropriate to its risk and complexity.
19. Run typecheck, tests and build before declaring a task complete.
20. Update documentation when an architectural contract changes.

## Agent workflow
- Inspect repository and current branch first.
- Read relevant docs before coding.
- Implement only the assigned scope.
- Reuse shared types, components and service contracts.
- Do not silently change unrelated modules.
- Report changed files, validation commands and any unresolved dependency.
- Commit with a focused message.

## Definition of done
A task is done only when its implementation is integrated, typed, validated, documented where necessary, and does not break the V2 build.
