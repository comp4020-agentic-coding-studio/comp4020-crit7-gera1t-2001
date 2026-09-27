# Harness

- The brief for this week is docs/c7-brief.md; do exactly the step I name and stop.
- The database enforces the rules; the page only reports them. Never query-then-insert.
- Keep spec/invariants.test.ts, spec/readme.test.ts and /api/events working; CI probes them.
- Run `pnpm typecheck` before saying a step is done; run `pnpm check` before step 3 is done.
- Do not edit fly.toml, Dockerfile, .github/, PROCESS.md, reflections/ or README.md without my go-ahead.
- Show README text in chat before writing it.
- Never open, print or copy mise.local.toml; flyctl gets the token through mise.
