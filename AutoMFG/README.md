# AutoMFG

Standalone Manufacturing Execution shell of the Auto-Suite. Identical to
the `mfg/` sub-app embedded in AutoDev, but bootable on its own port.

## Run it

```bash
pnpm install
cp .env.example .env
pnpm dev
```

Default URL: `http://localhost:5174` (or whatever Vite picks).

## Frontend-only mode

`VITE_REALTIME=false` (default) keeps the live store on a deterministic
mock-tick simulation. Set to `true` to lazy-load `socket.io-client`, but
the simulation still runs because there is no backend.

## Stack

- React 19 + Vite 5 (TypeScript)
- Zustand for stores (auth, notifications, app, live, event bus)
- Tailwind 3 with shared CSS variable theme (`mfg-theme` accent)
- axios + axios-mock-adapter
