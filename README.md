# Wedding Portal & Relatives Directory (Angular 18 Enterprise)

[![CI/CD Pipeline](https://github.com/ankitsah123/cicd/actions/workflows/ci.yml/badge.svg)](https://github.com/ankitsah123/cicd/actions/workflows/ci.yml)

A production-grade Angular application featuring a digital wedding invitation card, live ceremony countdown, interactive events itinerary, family & relatives directory, multi-step RSVP system with live blessings wall, and a coordinator dashboard.

---

## 🚀 Key Architectural Features

- **Angular 18+ Standalone Architecture**: Built with `standalone: true` components, directives, and pipes. Zero legacy `NgModule`s.
- **Reactivity & State Management**:
  - **Angular Signals**: Local component state, computed derivatives, and two-way bindings.
  - **NgRx SignalStore (`@ngrx/signals`)**: High-performance, modular state stores (`RelativesStore`, `RsvpStore`).
  - **RxJS Streams**: Debounced live typeahead search (`debounceTime`, `distinctUntilChanged`), live countdown intervals, and resilient async pipelines.
- **Type Safety & Runtime Boundary Validation with Zod**:
  - All form submissions (`RsvpSubmissionSchema`), relative records (`RelativeSchema`), and environment variables (`EnvironmentSchema`) are strictly validated at runtime.
  - TypeScript types are inferred directly from schemas (`z.infer<typeof Schema>`).
- **Tailwind CSS Design System**:
  - Custom celebration theme (Champagne, Gold, Rosewood, and Ivory design tokens).
  - Responsive layout with mobile navigation drawer.
- **Interactive UI & Celebrations**:
  - Integrated celebration confetti animations (`canvas-confetti`).
  - Ambient celebratory audio player with signal-controlled play/pause states.
  - Calendar export (`.ics`) for all wedding ceremonies.
  - CSV export for guest RSVP lists.
- **CI/CD Quality Standards**:
  - Strict TypeScript checking (`tsc --noEmit`).
  - Prettier automated code formatting.
  - GitHub Actions CI workflow (`.github/workflows/ci.yml`) running lint, type checks, unit tests, and production build with bundle budget checks.

---

## 📂 Project Structure

```
src/
├── app/
│   ├── core/                      # Global singletons, config, and services
│   │   ├── config/                # Zod environment schemas
│   │   └── services/              # Audio, Storage (Zod-validated), Confetti
│   ├── shared/                    # Reusable components
│   │   ├── components/            # Navbar, Footer, Countdown widget
│   ├── features/                  # Domain-driven feature slices
│   │   ├── card/                  # Digital Wedding Card, Hero, & Love Story
│   │   ├── events/                # Ceremony schedule, venue details, .ics export
│   │   ├── relatives/             # Relatives directory, NgRx SignalStore, search
│   │   ├── rsvp/                  # Zod RSVP form, Blessings wall
│   │   └── admin/                 # Host dashboard, headcount metrics, CSV export
│   ├── app.component.ts
│   ├── app.config.ts              # Route providers & View Transitions
│   └── app.routes.ts              # Lazy-loaded feature routes
├── environments/                  # Environment configs
└── styles.css                     # Tailwind CSS directives & fonts
```

---

## 🛠️ Development & Production Commands

| Command | Purpose |
| :--- | :--- |
| `npm start` | Run the local dev server (`http://localhost:4200`) |
| `npm run build` | Compile optimized production build (`dist/wedding-portal`) |
| `npm run typecheck` | Run static TypeScript checks (`tsc --noEmit`) |
| `npm run format:check` | Verify Prettier code formatting |
| `npm run format:write` | Automatically format all project files |
| `npm test` | Run Karma / Jasmine unit test suite |

---

## 👥 Family & Relatives Directory Features

- **Side Filter**: View Groom's family, Bride's family, or all mutual guests.
- **Live Search**: Debounced search by relative name, native relation title (e.g. *Chacha*, *Maasi*, *Nana Ji*), city, or room assignment.
- **Add Relatives**: Real-time form with Zod schema validation and persistent storage.
