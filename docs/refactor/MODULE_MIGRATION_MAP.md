# Module Refactor Mapping (Draft)

This file captures the planned old -> new location mapping for the module-based refactor.

## Top-level folders
- `src/app/` -> split into `src/App.tsx`, `src/contexts`, `src/hooks`, `src/utils`, and module folders under `src/modules/*`.
- `src/ui-kit/` -> `src/components/ui/`
- `src/patterns/` -> `src/components/patterns/`
- `src/registry-components/` -> `src/components/registry/` (keep re-exports)
- `src/services/` -> module services or `src/api/` (only shared clients)
- `src/lib/` -> `src/api/`
- `src/data/` + `src/app/data/` -> `src/utils/data/` (module-specific data can be moved later)
- `src/imports/` -> `src/assets/imports/`
- `src/styles/` -> `src/assets/styles/`
- `src/config/` -> `src/constants/` or `src/utils/config/`

## Modules (pages)
- `src/modules/legacy/pages/OverviewPage.tsx` -> `src/modules/overview/pages/OverviewPage.tsx` ✅
- `src/modules/legacy/pages/DashboardPage.tsx` -> `src/modules/overview/pages/DashboardPage.tsx` ✅
- `src/modules/legacy/pages/MapPage.tsx` + `MapPage.module.css` -> `src/modules/map/pages/` ✅
- `src/modules/legacy/pages/ReportsPage.tsx` -> `src/modules/reports/pages/ReportsPage.tsx` ✅
- `src/modules/legacy/pages/DataExportPage.tsx` + Export* tabs -> `src/modules/reports/pages/` ✅
- `src/modules/legacy/pages/lead-risk/**` -> `src/modules/leads/pages/lead-risk/**` ✅
- `src/modules/legacy/pages/LeadsPage.tsx` + `LeadsSupabaseDemo.tsx` -> `src/modules/leads/pages/` ✅
- `src/modules/legacy/pages/account/**` -> `src/modules/auth/pages/**` ✅
- `src/modules/legacy/app-pages/auth/Login.tsx` + `.module.css` -> `src/modules/auth/pages/` ✅
- `src/modules/legacy/pages/system/**` -> `src/modules/system-admin/pages/legacy-system/**` ✅
- `src/pages/registry/**` + `src/registry-components/*` -> `src/modules/registry/` ✅
- `src/pages/PlansPage.tsx` + `src/app/pages/plans/**` + `src/app/pages/inspections/**` -> `src/modules/plans/` ✅
- `src/pages/EvidencePage.tsx` + `src/app/pages/evidence/**` + `src/app/services/evidence*.ts` -> `src/modules/evidence/` ✅
- `src/app/pages/tasks/**` -> `src/modules/tasks/` ✅
- `src/app/pages/TvWallboardPage.tsx` + `src/services/tvSupabase.service.ts` -> `src/modules/tv/` ✅
- `src/modules/system-admin/**` stays but internal folders normalized to components/hooks/services/types/utils/pages

## Pages kept in src/pages
- Auth + system error pages remain as wrappers: `src/pages/auth/**`, `src/pages/system/**` (pending review)
- Any legacy admin-only pages can remain as wrappers under `src/pages/` pointing to new module pages.
