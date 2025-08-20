# Project Development Guidelines (advanced)

This repository is a small, config‑driven React + TypeScript + Vite application that demonstrates wiring UI components via a lightweight action engine and Recoil for state.

These notes focus on project‑specific caveats, build/testing procedures, and development tips.

## Build and Configuration

- Toolchain
  - Node.js: use Node 18+ (Vite 5 requires >=18). The project is ESM (package.json has "type": "module").
  - Bundler: Vite + @vitejs/plugin-react
  - Language: TypeScript (noEmit, JSX: react-jsx)
- Scripts
  - Install: `npm install`
  - Dev server: `npm run dev` (Vite)
  - Production build: `npm run build` (tsc type-check + vite build)
  - Preview built app: `npm run preview`
- JSON modules
  - In app code you can import JSON (tsconfig has `resolveJsonModule: true`). Vite handles this at build time.
  - In Node ESM scripts (outside Vite), prefer `fs.readFile + JSON.parse` or enable import assertions (Node >=20) when importing JSON.
- Configuration flow
  - `src/config/pageConfig.json` defines the dashboard components and their bindings.
  - `src/config/interactionConfig.ts` derives action‐engine rules from `pageConfig.json`. For `mode: "direct"` it creates a trigger `${source}.onChange`; for `mode: "indirect"` it creates `${via}.onClick`.
  - `src/App.tsx` maps `ComponentType` → React component and instantiates the components declared in `pageConfig.json`.

## Architecture Notes

- State: `src/atoms.ts` exposes `componentValuesState` and `componentStateFamily` for reading/writing values per component id.
- Action engine: `src/engine/actionEngine.ts`
  - `registerActionHandler(id, actionType, handler)` lets a component expose imperative handlers (e.g., setValue) keyed by component id.
  - `executeTrigger(trigger, rules)` filters rules on trigger and calls the registered target handler(s) with evaluated args.
  - Arg interpolation uses `${<componentId>.value}` patterns. Resolution reads current values via `snapshot_UNSTABLE()` from Recoil.
- Components
  - `CalendarComponent` updates its own value and emits `${id}.onChange` via `executeTrigger`.
  - `ButtonComponent` sets its own timestamp value and emits `${id}.onClick`.
  - `ChartComponent` registers a `setValue` handler and, when its date value changes, simulates async data loading then renders a bar chart via `echarts-for-react`.

Caveats and pitfalls
- Handlers must be registered before you fire triggers that target them. In React, registration occurs in `useEffect`; ensure order if you simulate events immediately on mount.
- `evaluateArgs` reads Recoil values using an ephemeral snapshot; this observes committed state at evaluation time. If you depend on concurrent updates, sequence your triggers accordingly.
- Node ESM + JSON: importing JSON directly in Node requires assertions; prefer `fs.readFile` in ad‑hoc scripts.

# Agent
Do NOT run `npm run dev`, the console gets stuck
You do not need to run the tests