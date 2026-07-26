# Smart Traffic Signal

An interactive, browser-based simulation of a queue-based priority scheduling algorithm for a four-way traffic intersection. Built as a portfolio-grade rebuild of a [C console program](docs/original/smartraffic.c) originally written for a Data Structures course, now a full Next.js application with a live simulation, an analytics dashboard, and scenario controls for rush hour, rain, accidents, and emergency vehicle preemption.

**Live demo:** deploy to Vercel and add your URL here.

## Overview

Four independent vehicle queues (North, South, East, West) feed a signal controller that repeatedly:

1. Picks the direction with the most queued vehicles (ties favor North, then South, East, West).
2. Grants it a green light for `5 + vehicle count` seconds.
3. Clears up to 5 vehicles per cycle (3 in rain).
4. Repeats.

This is the exact algorithm from the original `smartraffic.c` circular-queue implementation, ported to TypeScript and driven by a real-time tick loop instead of a manual CLI menu. See [`lib/simulation/engine.ts`](lib/simulation/engine.ts) for the implementation and [`lib/simulation/engine.test.ts`](lib/simulation/engine.test.ts) for unit tests that verify it against the original's own worked example (`North=10, South=2, East=3, West=1` → North priority, 15s green, 5 vehicles pass).

## Features

- **Live intersection view** — animated per-direction vehicle queues and signal state.
- **Simulation controls** — play/pause/reset, adjustable speed (0.25x–4x) and traffic density.
- **Scenario controls** — toggle rush hour, switch weather (clear/rain), trigger an accident on any approach, dispatch an emergency vehicle that forces an immediate priority override.
- **Analytics dashboard** — live charts for throughput, average wait time, per-direction congestion, and signal timing history, plus a running event log.
- **No backend, no external data** — the entire simulation runs client-side with generated traffic; nothing to configure to see it working.
- **Accessible** — keyboard-navigable controls, ARIA labels and live regions on the intersection view and event log, visible focus states, `prefers-reduced-motion` support.
- **Light/dark theme**, responsive down to small mobile viewports, SEO metadata (Open Graph image, sitemap, robots.txt).

## Tech stack

- [Next.js 16](https://nextjs.org/) (App Router, TypeScript, Turbopack)
- [Tailwind CSS 4](https://tailwindcss.com/) + [Radix UI](https://www.radix-ui.com/) primitives (shadcn/ui-style components)
- [Recharts](https://recharts.org/) for the analytics dashboard
- [Framer Motion](https://www.framer.com/motion/) for queue animations
- [Vitest](https://vitest.dev/) for unit tests on the simulation engine
- Deployed on [Vercel](https://vercel.com/)

## Getting started

Requires Node.js 20.9+ and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Available scripts

| Script                 | Purpose                               |
| ---------------------- | ------------------------------------- |
| `npm run dev`          | Start the development server          |
| `npm run build`        | Production build                      |
| `npm run start`        | Serve the production build            |
| `npm run lint`         | ESLint (zero warnings enforced)       |
| `npm run typecheck`    | TypeScript, no emit                   |
| `npm run test`         | Vitest unit tests (simulation engine) |
| `npm run format`       | Prettier, write mode                  |
| `npm run format:check` | Prettier, check mode (used in CI)     |

## Environment variables

The simulation is entirely client-side and needs **no environment variables to run**. One optional variable affects SEO metadata only:

| Variable               | Required | Description                                                                                                       |
| ---------------------- | -------- | ----------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | No       | Absolute origin used for canonical URLs, Open Graph images, and sitemap.xml. Defaults to `http://localhost:3000`. |

Copy [`.env.example`](.env.example) to `.env.local` to override it locally.

## Deployment (Vercel)

1. Import the repository into Vercel (framework preset: Next.js — auto-detected via [`vercel.json`](vercel.json)).
2. Set `NEXT_PUBLIC_SITE_URL` to your production URL (optional but recommended for correct OG/sitemap output).
3. Deploy. No database, no API keys, no other configuration required.

Or from the CLI:

```bash
npx vercel deploy --prod
```

## Folder structure

```
app/                   Next.js App Router: layout, pages, SEO routes (sitemap, robots, OG image)
components/
  simulation/           Intersection view, controls, signal light
  dashboard/             Metrics grid, charts, event log
  layout/                 Navbar, footer, theme provider/toggle
  ui/                       Radix-based primitives (button, card, slider, switch, tabs, tooltip, badge)
hooks/
  useTrafficSimulation.ts  Drives the engine on a real-time tick loop, exposes state + controls
lib/
  simulation/
    engine.ts                Pure, framework-agnostic scheduler + queue logic (ported from the C original)
    engine.test.ts            Vitest unit tests
    types.ts                    Shared types and tunable constants
  utils.ts                      Tailwind class merge helper
docs/original/            The original C program and technical report, unmodified, for provenance
```

## How the algorithm works

```
Input:  North=10, South=2, East=3, West=1
Output: North gets priority
        Green time:      5 + 10 = 15 seconds
        Vehicles passed:  min(10, 5) = 5
        Remaining:        5 vehicles in North's queue
```

Extensions layered on top of the original algorithm (all opt-in, all off by default):

- **Rush hour** — increases arrival rate 1.7x.
- **Rain** — caps throughput at 3 vehicles/cycle instead of 5, and slightly reduces arrivals.
- **Accident** — excludes the affected direction from selection for 20 simulated seconds; its queue keeps growing but isn't serviced.
- **Emergency vehicle** — immediately preempts the current cycle and forces the scheduler to grant priority to its direction, regardless of queue counts.

## Testing

```bash
npm run test
```

Unit tests cover the priority-selection tie-breaking, the green-time formula, the per-cycle throughput cap, emergency override behavior, accident blocking, and queue-capacity limits.

## Limitations

- Single intersection only — no multi-intersection coordination or "green wave" effect.
- No persistence: refreshing the page resets all state (by design — this is a stateless client-side demo).
- Traffic is procedurally generated, not sourced from real sensors or historical data.
- No authentication or backend — everything, including "emergency dispatch," is a local simulation control, not a real integration.

## Future enhancements

- Multi-intersection coordination (green wave / corridor optimization)
- Machine-learning-based traffic pattern prediction
- Real-time sensor/camera data integration
- Vehicle-to-Infrastructure (V2I) communication simulation
- Configurable intersection topologies (T-junctions, roundabouts)
- Session replay / scenario export

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Security

See [SECURITY.md](SECURITY.md) for how to report a vulnerability.

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

## Acknowledgments

Originally built for the Data Structures and Applications course at B.M.S. College of Engineering (2024–2025). See the [original technical report](docs/original/SmartTrafficSignal.pdf) for the underlying complexity analysis and design rationale.

## License

MIT — see [LICENSE](LICENSE).

## Author

**Krish Ramesh Pareet**
B.E. Computer Science and Business Systems, B.M.S. College of Engineering

- GitHub: [@krishrp1](https://github.com/krishrp1)
- LinkedIn: [krish-pareet](https://www.linkedin.com/in/krish-pareet-3b949031b/)
