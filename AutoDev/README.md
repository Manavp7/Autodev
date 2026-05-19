# AutoDev

Engineering & R&D workflow shell of the Auto-Suite. The AutoDev app bundles
all three product modules — Product Engineering (R&D), Manufacturing (MFG),
and Supply Chain (SCM) — behind a single Vite/React shell so the entire
demo can run from one URL.

## Stack

- React 19 + Vite 5 (TypeScript)
- React Router 6
- TanStack Query 5
- Zustand 5 with `persist`
- Tailwind CSS 3 (CSS-variable theme tokens)
- React Hook Form + Zod
- axios + axios-mock-adapter (no real backend)

## Run it

```bash
pnpm install   # or npm install
cp .env.example .env
pnpm dev       # http://localhost:5173
```

`VITE_REALTIME=false` keeps every external integration (DocuSign, SAP,
MQTT, email/SMS, PDF service…) stubbed in-memory — the demo never makes
network calls.

## Layout

```
src/
  api/                 axios-mock-adapter client + react-query hooks
  components/auth/     RequireAuth · RoleGuard · SignatureModal
  components/ui/       Toast, Dropdown, Modal …
  context/             AppContext (theme only)
  layouts/             MainLayout — shared sidebar + topbar shell
  lib/                 permissions · audit · demoUsers · mockData
  mfg/                 AutoMFG sub-app (mounted under /mfg/*)
  scm/                 AutoSCM sub-app (mounted under /scm/*)
  pages/               R&D pages: Dashboard, Programs, BOM, ECOs, DVP&R, …
  stores/              Shared zustand stores: authStore · notificationStore · eventBus
  styles/theme.css     Single CSS-variable palette mirrored across all 3 apps
```

## Module accents

The shell flips a wrapper class on the layout root depending on the active
module:

| Module | Wrapper       | --accent       |
| ------ | ------------- | -------------- |
| DEV    | `.dev-theme`  | blue-600       |
| MFG    | `.mfg-theme`  | forest green   |
| SCM    | `.scm-theme`  | teal-600       |

## Demo accounts

Any of the entries in `src/lib/demoUsers.ts` work. Examples:

| Username   | Role               |
| ---------- | ------------------ |
| admin      | SYS_ADMIN          |
| chief      | CHIEF_ENGINEER     |
| pm         | PROGRAM_MANAGER    |
| manager    | PRODUCTION_MANAGER |
| operator   | MACHINE_OPERATOR   |
| cpo        | CPO                |
| srbuyer    | SENIOR_BUYER       |

Password for every demo account: **123**.
