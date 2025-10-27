Project-specific Copilot instructions — uppcl-ots

Quick orientation
- This repo contains two related Vite apps: the primary React + TypeScript app at the workspace root `src/` and a small vanilla Vite demo in `uppcl-ots/`.
- Primary files to inspect for UI and behaviour: `src/OTSRegistrationPage.tsx`, `src/App.tsx`, `src/main.tsx`.
- Build tooling: Vite + TypeScript + Tailwind. Key config: `vite.config.ts`, `tailwind.config.cjs`, `postcss.config.cjs`, `tsconfig.json`.

What matters for edits
- The registration UI, sample data and business logic live in `src/OTSRegistrationPage.tsx`. Small helper components (Field, Th, Td, TogglePath) are defined at the bottom of that file — modify them in-place or extract them if refactoring.
- The app is currently a static/prototype UI: OTP and payment actions are stubbed (use of `alert()` and local state). There are no network/API calls to a backend in the codebase.
- Internationalization is implemented inline as an `i18n` object in `OTSRegistrationPage.tsx` (keys: `en`/`hi`) — update translations there.

Build / dev workflows (how to run)
- Install dependencies at the root and run the React dev server:
  - From repository root:
    npm install
    npm run dev
  - Default Vite port (if free) is 5173.
- Build (typecheck + production build): `npm run build` — this runs `tsc && vite build` as defined in `package.json`.
- Preview production build locally: `npm run preview` after a successful build.
- Note: there is a secondary app in `uppcl-ots/` (vanilla TS + Vite). If you intend to work on that example, open a terminal in `uppcl-ots/` and run its own `npm install` and `npm run dev`.

Important repo conventions & gotchas
- TypeScript setup: `tsconfig.json` is strict and `noEmit: true`. The `build` script runs `tsc` (type-check only) before `vite build` — fix type errors to unblock builds.
- Relative asset base: `vite.config.ts` sets `base: './'` so built assets use relative paths (chosen for Netlify static hosting). When adding links/assets remember relative paths are expected in production.
- Tailwind is used for styling. Edit utility classes directly in JSX; the content path is `./src/**/*.{js,ts,jsx,tsx}` in `tailwind.config.cjs`.
- UI behavior is data-driven from the `sampleConsumer` object in `OTSRegistrationPage.tsx`. Change that object to test different scenarios.
- Payment/OTP are intentionally mocked; wiring to a real API should be done by adding a new service module (e.g. `src/services/payment.ts`) and replacing inline alerts with fetch/axios calls.

Files to reference when coding
- `src/OTSRegistrationPage.tsx` — main UI/logic for OTS flows (phases, installments, mobile OTP flow)
- `src/App.tsx`, `src/main.tsx` — app bootstrap and root component
- `vite.config.ts`, `netlify.toml` — production hosting settings (`base: './'`, Netlify publish folder `dist`)
- `package.json` — scripts: `dev`, `build`, `preview`

Examples and small recipes
- To change the minimum allowed input for lumpsum payments, edit the numeric input `min={2000}` located in `OTSRegistrationPage.tsx` (search for `min={2000}`).
- To add a backend call for OTP verification replace the `setOtpVerified(true); alert("OTP verified")` block with an async call to your API and gate the `canPay` logic on the real response.
- To add a new installment plan, update `installmentPlans` array in `OTSRegistrationPage.tsx` — each entry has `key`, `discount`, `installments`, `enabled`.

When in doubt
- Look first at `src/OTSRegistrationPage.tsx` — 80% of UI and business rules reside here.
- If something fails during `npm run build`, run `npx tsc --noEmit` locally to see the TypeScript errors.

Questions for the maintainer
- Do you want the prototype OTP/payments to be converted into actual network calls or kept as stubs? If networked, what API endpoints/auth are expected?
- Is the `uppcl-ots/` subfolder still required or can it be removed/merged into the root project?

If you want me to update or expand any section, mention which area (build, i18n, payment wiring, or test scaffolding) and I will iterate.
