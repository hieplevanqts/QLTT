# ADR-001: Module-Aware Routing and Registry

## Status
Proposed (Step 1 audit complete, no refactor yet).

## Context
The project currently mixes feature screens across:

- `src/pages/*` (legacy/large surface area)
- `src/modules/*` (newer module-oriented areas, especially `system-admin`)

Routing is composed primarily from `src/routes/routes.tsx` via `createBrowserRouter`, with a mix of:

- route objects imported from modules
- lazy-loaded pages under `src/pages/*`
- auto-generated installed modules via `src/imports/installedModules.ts`

This creates maintainability and performance risks:

1. **Routing ownership is unclear** (paths defined in multiple places).
2. **Permissions/guards are scattered** (some in route config, some in components).
3. **Module registry exists but is partial** (installed routes are spread, not strongly typed).
4. **Legacy `src/pages` continues to grow**, making long-term refactors harder.

---

## Step 1 — Inventory of routing and structure (audit)

### Primary router composition

- **Main router:** `src/routes/routes.tsx:121`
- **Guard wrapper:** `ProtectedLayout` uses `ProtectedRoute`:
  - `src/app/components/auth/ProtectedRoute.tsx`
- **Permission guard:** `PermissionProtectedRoute`:
  - `src/app/components/auth/PermissionProtectedRoute.tsx`

### Module routes already mounted

Mounted from `src/routes/routes.tsx`:

- `systemAdminDashboardRoute`
  - Source: `src/modules/system-admin/routes.tsx`
- `saMasterDataRoutes`
  - Source: `src/modules/system-admin/sa-master-data/routes.tsx`
- `saIamRoutes`
  - Source: `src/modules/system-admin/sa-iam/routes.tsx`
- `saSystemConfigRoutes`
  - Source: `src/modules/system-admin/sa-system-config/routes.tsx`
- `...installedRoutes`
  - Source: `src/imports/installedModules.ts` (auto-generated)

### Installed routes (auto-generated registry)

File: `src/imports/installedModules.ts`

Currently includes:

- `iTodolistRoute` → `src/modules/i-todolist/routes.tsx`
- `kpiQlttRoute` → `src/modules/kpi-qltt/routes.tsx`
- `systemModulesRoute` → `src/modules/system-admin/routes.tsx`

### Route inventory (high-level)

The table below captures the major route groups, their source, and whether they are module-owned.

| Path (base) | Source file | Module-owned? | Notes |
| --- | --- | --- | --- |
| `/auth/login` | `src/routes/routes.tsx` | Legacy | Auth entry |
| `/tv` | `src/routes/routes.tsx` | Legacy | Guarded by `PermissionProtectedRoute` |
| `/overview` | `src/routes/routes.tsx` → `src/pages/OverviewPage` | Legacy | Lazy-loaded |
| `/map` | `src/routes/routes.tsx` → `src/pages/MapPage` | Legacy | Lazy-loaded + guard |
| `/registry/*` | `src/routes/routes.tsx` → `src/pages/registry/*` | Legacy | Deep nested routes |
| `/lead-risk/*` | `src/routes/routes.tsx` → `src/pages/lead-risk/*` | Legacy | Many routes under `src/pages` |
| `/plans/*` | `src/routes/routes.tsx` → `src/app/pages/plans/*` | Semi-module | Under `src/app/pages` |
| `/tasks/*` | `src/routes/routes.tsx` → `src/app/pages/tasks/*` | Semi-module | Under `src/app/pages` |
| `/system-admin` | `src/modules/system-admin/routes.tsx` | Module | Dashboard entry |
| `/system-admin/master-data/*` | `src/modules/system-admin/sa-master-data/routes.tsx` | Module | Good module structure |
| `/system-admin/iam/*` | `src/modules/system-admin/sa-iam/routes.tsx` | Module | Good module structure |
| `/system-admin/system-config/*` | `src/modules/system-admin/sa-system-config/routes.tsx` | Module | Good module structure |
| `/system/*` | `src/routes/routes.tsx` → `src/pages/system/*` | Legacy | IAM-like legacy screens exist here too |
| `/kpi/*` | `src/modules/kpi-qltt/routes.tsx` | Module | Installed route |
| `/todolist/*` | `src/modules/i-todolist/routes.tsx` | Module | Installed route |
| `/system/modules/*` | `src/modules/system-admin/routes.tsx` | Module | Registry/import flows |

### Observations and issues

1. **Mixed routing sources:**
   - `src/routes/routes.tsx` is very large and still owns many feature routes.
   - `src/modules/*/routes.tsx` is used for some areas, but not the whole app.
2. **Parallel IAM concepts exist:**
   - `/system-admin/iam/*` (module-first)
   - `/system/*` (legacy system pages)
3. **Installed route registry is not strongly typed:**
   - `installedRoutes` is an array of route objects but without manifest metadata.
4. **Guarding strategy is split:**
   - Some permissions are enforced at route-level.
   - Some permissions are enforced in components.
5. **Performance risks:**
   - Many lazy loads are good, but the router is a monolith.
   - Module-level code splitting and registry-driven composition are not standardized.

---

## Step 2 — Options analysis (maintainability + performance)

### Option A (recommended): Module-first + legacy wrappers

Core idea:

- All new features go into `src/modules/<module-key>/...`.
- `src/pages` becomes legacy wrappers and entry shells only.
- Routing is built from a typed **Module Registry** with explicit imports.

Pros:

- Clear ownership and discoverability.
- Easier to centralize permissions, menus, and module metadata.
- Scales better and supports structured lazy-loading.

Cons:

- Requires light refactors and a migration plan.
- Cannot be done as a big-bang change.

### Option B: Continue pages-first

Core idea:

- Keep routing primarily in `src/routes/routes.tsx` and `src/pages`.

Pros:

- Lowest short-term change.

Cons:

- Long-term maintainability risk increases.
- Permissions and module registry become harder to standardize.
- Router monolith continues to grow.

---

## Decision

Adopt **Option A: Module-first + legacy wrappers**.

This will be implemented incrementally:

1. Introduce a typed Module Registry.
2. Compose routes from the registry.
3. Keep legacy routes intact (no big-bang).

---

## Proposed module conventions (target state)

### Folder structure

```text
src/modules/<module-key>/
  manifest.ts        # Module metadata + references
  routes.tsx         # Route objects for the module
  pages/
  components/
  services/ | data/
  hooks/
  types/
```

### Module manifest shape (proposed)

```ts
export interface ModuleManifest {
  key: string;
  name: string;
  group: 'IAM' | 'DMS' | 'OPS' | 'SYSTEM';
  order?: number;
  icon?: string;
  routes: RouteObject[];
  menu?: MenuItemDef[];
}
```

### Routing rules

1. New routes must be declared in a module `routes.tsx`.
2. `src/routes/routes.tsx` should compose module routes rather than define feature routes directly.
3. Guards should be applied at module route boundaries where possible.

---

## Migration strategy (non-breaking)

1. Add a module registry alongside the current router.
2. Route composition uses registry routes + existing legacy routes.
3. Gradually move legacy `src/pages/*` routes behind module wrappers.

No existing route paths need to change during this ADR.

