# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Dev server (ng serve)
npm run build      # Production build
npm run watch      # Watch mode build (development)
npm test           # Run tests (Angular CLI Vitest integration via @angular/build:unit-test)
```

To run a single spec file: `npx ng test --include="**/auth-guard.spec.ts"` (pattern matched against file paths).

Tests use **Vitest** (not Jest) — use `vi.fn()`, `vi.spyOn()`, etc. The test runner is wired via `@angular/build:unit-test` with `jsdom` as the browser environment.

## Architecture

Angular 21 SaaS template using the standalone component API throughout — no NgModules. All features are lazy-loaded via `loadComponent()`. The app is a basic employee management UI backed by a Beeceptor mock API (`https://json-placeholder.mock.beeceptor.com`).

### Routing structure

```
/auth         → authentication/ (guestGuard — blocks logged-in users)
  /login      → Login component
  /register   → RegisterComponent (stub)
/employee     → features/employee/ (authGuard — requires login)
  /employees  → EmployeesComponent (CRUD data table)
```

Root redirect: `/` → `/auth/login`.

### Core module (`src/app/core/`)

- **`AuthenticationService`** — central auth state via `BehaviorSubject<user>`. Stores JWT in `localStorage`. Exposes `user$` observable consumed app-wide. Decodes JWT payload client-side (no verification).
- **`authInterceptor`** — functional interceptor that injects `Authorization: Bearer <token>` on every outgoing HTTP request. Note: it always runs, even when unauthenticated — sends `Bearer null` in that case.
- **`authGuard` / `guestGuard`** — route guards; `authGuard` redirects to `/auth/login`, `guestGuard` redirects to `/employee/employees`.

### Authentication flow

`Login` component uses **Angular's signal-based form API** (`form()` from `@angular/forms/signals`) — not traditional `ReactiveFormsModule`. Form schema lives in `src/app/models/loginModel.ts` and uses `validate()` / `applyEach()` for custom validators (including a dynamic social-links array). The `initialLoginModel` is pre-filled with `{ email: 'michael', password: 'success-password' }` matching the mock API. On success, `AuthenticationService.login()` stores the token and navigates to `/employee`.

### Feature: Employee (`src/app/features/employee/`)

- `EmployeeLayoutComponent` wraps child routes; imports `TopHeaderComponent` and subscribes to `auth.user$` to display the username.
- `EmployeesComponent` — full CRUD table using **AG Grid** (`ag-grid-angular`, `themeQuartz`), not PrimeNG Table. CRUD details:
  - Fetches `/users` via `UsersService` (scoped via `providers: [UsersService]` at component level, not root).
  - Create/edit via a PrimeNG `DialogModule` dialog with a signal-based form (`employeeSchema` in `employee-form.model.ts`).
  - Optimistic updates: local signal state is updated immediately; API call follows and only logs errors.
  - Delete confirmation via **SweetAlert2** (`Swal.fire`).
  - Excel export via `xlsx` + `file-saver`.
- `ActionCellComponent` — custom AG Grid cell renderer providing edit and delete buttons (`ICellRendererAngularComp`). Receives `onEdit`/`onDelete` callbacks via `cellRendererParams`.

`IUser` has fields beyond what `IEmployeeForm` edits (`address`, `zip`, `state`, `photo`) — these are preserved on update via spread (`{ ...u, ...value }`) but not exposed in the dialog form.

### Shared (`src/app/shared/`)

- `TopHeaderComponent` — Bootstrap navbar, used inside the employee layout.

### Core module additions

- **`LanguageService`** (`core/services/language.service.ts`) — wraps `@ngx-translate/core`. Persists selected language to `localStorage` under key `lang`. Sets `document.documentElement.dir` to `ltr`/`rtl` for Arabic (non-`en`) support. Call `init()` at app startup; call `setLanguage(lang)` to switch at runtime.

### UI libraries

- **PrimeNG 21** with Aura theme (configured in `app.config.ts`) — used for Dialog, Button, InputText, Password components.
- **AG Grid 35** (`ag-grid-community` / `ag-grid-angular`) — used for the employees data table.
- **Bootstrap 5** (imported globally via `src/styles.scss`).
- **SweetAlert2** — delete confirmation dialogs only.

### Environment config

`src/environments/environment.ts` / `environment.prod.ts` — both currently point to the same mock API. Angular's `fileReplacements` in `angular.json` swaps the file on production builds.

## Key conventions

- All components are `standalone: true`; import dependencies directly in each component's `imports` array.
- Use `loadComponent()` for all new routes — no eager-loaded feature components.
- Inline component styles use SCSS (configured as default in `angular.json` schematics).
- TypeScript strict mode is fully enabled including `strictTemplates` and `strictInjectionParameters`.
- Prettier config (in `package.json`): 100-char line width, single quotes, Angular HTML parser for templates.
- Use `form()` / `schema()` / `submit()` from `@angular/forms/signals` for all new forms — not `ReactiveFormsModule`.
- Services used only within one feature should be scoped to that component via `providers: []`, not `providedIn: 'root'`.
