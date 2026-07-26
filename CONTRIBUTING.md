# Contributing

Thanks for considering a contribution to Smart Traffic Signal.

## Getting started

```bash
git clone https://github.com/krishrp1/smart-traffic-signal.git
cd smart-traffic-signal
npm install
npm run dev
```

## Before opening a pull request

Run the full check suite locally — CI runs the same checks and will block merges otherwise:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run format:check
```

## Guidelines

- Keep changes focused; unrelated refactors belong in a separate PR.
- Match the existing code style (Prettier + ESLint config in the repo; `npm run format` before committing).
- If you change simulation behavior in `lib/simulation/engine.ts`, add or update a test in `engine.test.ts`.
- UI changes should remain accessible: keyboard-operable controls, visible focus states, and ARIA labels on anything non-text.
- No new runtime dependencies without a good reason — this project intentionally has a small surface area.

## Commit messages

Short, imperative, and descriptive (`fix: correct wait-time chart y-axis ticks`, not `updated stuff`). Conventional Commits prefixes (`feat`, `fix`, `chore`, `docs`, `test`, `refactor`) are welcome but not required.

## Reporting bugs / requesting features

Use the issue templates in `.github/ISSUE_TEMPLATE/`.
