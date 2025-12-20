# Theming overview

The dashboard now ships with **two first-class themes**—light and dark—that must stay in parity across every tech stack (web, desktop, and mobile). The React app exposes a shared `ThemeContext` and a `data-theme` attribute on the root document to keep styling synchronized with the currently selected palette.

## Design tokens

These tokens define the colors for both themes. Web uses them as CSS variables; native stacks should mirror the same hex values.

| Token                      | Light                     | Dark                       | Purpose                    |
| -------------------------- | ------------------------- | -------------------------- | -------------------------- |
| `--bg-color`               | `#f5f7fb`                 | `#0b1221`                  | Page background            |
| `--text-color`             | `#111827`                 | `#e5e7eb`                  | Primary text               |
| `--muted-text-color`       | `#52606d`                 | `#9ca3af`                  | Secondary text/axes        |
| `--surface-color`          | `#ffffff`                 | `#0f172a`                  | Main container background  |
| `--surface-elevated-color` | `#f9fafb`                 | `#111827`                  | Cards and charts           |
| `--border-color`           | `#d8dee4`                 | `#1f2937`                  | Outlines/dividers          |
| `--control-bg-color`       | `#ffffff`                 | `#0f172a`                  | Inputs and selects         |
| `--control-border-color`   | `#d8dee4`                 | `#1f2937`                  | Input borders              |
| `--accent-color`           | `#2563eb`                 | `#7c3aed`                  | Buttons and highlights     |
| `--accent-color-strong`    | `#1d4ed8`                 | `#a855f7`                  | Hover state for accents    |
| `--accent-contrast-color`  | `#ffffff`                 | `#0b1221`                  | Text on accent backgrounds |
| `--focus-ring-color`       | `rgba(37, 99, 235, 0.25)` | `rgba(124, 58, 237, 0.35)` | Focus halo                 |

## Web implementation (React/Vite)

- `src/themeContext.tsx` defines a `ThemeContext` with `theme` and `toggleTheme`.
- `src/App.tsx` applies the selected theme to `document.documentElement` via `data-theme`, stores preference in `localStorage`, and exposes a toggle button in the header.
- `src/index.css` contains the CSS variables above and styles controls, layout, and charts to react to theme changes.
- `ChartComponent` reads the CSS variables so axis labels, grids, and bars always align with the active theme.

## Desktop and mobile guidance

Use the same token names and values so assets remain visually consistent:

- **Desktop (e.g., Dioxus/Tauri):** define a light/dark palette that matches the table above and switch container classes or data attributes when the theme changes. React to `prefers-color-scheme` for defaults and store overrides locally.
- **Mobile (React Native/Capacitor):** mirror the hex values in your theme object, apply them to `StatusBar`, navigation stacks, and controls, and respect the system appearance toggle with an override stored in async storage.

Keeping the token values aligned ensures that switching themes produces the same visual experience no matter which stack the dashboard runs on.
