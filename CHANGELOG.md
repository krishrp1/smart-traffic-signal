# Changelog

All notable changes to this project are documented in this file.
Format loosely follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [2.0.0] — 2026-07-26

### Changed

- Full rebuild as a production Next.js 16 (App Router, TypeScript) web application, replacing the original C console program's interactive menu with a live, real-time browser simulation. The underlying priority-scheduling algorithm and circular-queue behavior are preserved and unit-tested against the original's own worked example.

### Added

- Interactive four-way intersection view with live vehicle queues and signal state.
- Simulation controls: play/pause/reset, speed (0.25x–4x), traffic density.
- Scenario controls: rush hour, rain, accident triggers, emergency vehicle dispatch with priority override.
- Analytics dashboard: throughput, average wait time, per-direction congestion, and signal timing history charts, plus an event log.
- Light/dark theming, responsive layout, SEO metadata (Open Graph image, sitemap, robots.txt), WCAG-AA-oriented accessibility.
- Vitest unit tests for the simulation engine.
- CI (GitHub Actions): lint, typecheck, test, format check, build.
- `vercel.json`, `.env.example`, and full project documentation (this file, README, CONTRIBUTING, SECURITY).

### Preserved

- Original `smartraffic.c` source and technical report, moved to `docs/original/` for provenance.
- MIT license and author attribution.

## [1.0.0] — 2024–2025

- Original C console program: circular-queue-based traffic signal controller with priority scheduling, submitted for the Data Structures and Applications course at B.M.S. College of Engineering.
