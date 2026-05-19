# AutoSCM

Standalone Supply Chain shell of the Auto-Suite (no TypeScript).

## Run it

```bash
pnpm install
cp .env.example .env
pnpm dev
```

## Frontend-only mode

There is no backend. All "approvals", "DocuSign", "SAP", and "supplier
portal" interactions are stubbed inside the React app and persisted in
`localStorage` keys (`auto-suite-auth`, `auto-suite-notifications`,
`auto-suite-audit`).

Module accent: `scm-theme` (teal-600).
