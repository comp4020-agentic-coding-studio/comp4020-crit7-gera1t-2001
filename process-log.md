# Process log

One entry per commit, written after that commit exists and citing its real
hash, as `CLAUDE.md` describes. This file is the raw material `PROCESS.md` is
drafted from; it is not itself the submission.

The convention itself only arrived on 2026-09-28, carried into `CLAUDE.md` by
hand from assignment 2 (this repo, being the first full-stack-starter
deliverable, didn't inherit it automatically). The entries below reconstruct
the week from `git log` and the actual prompts, backfilled in one pass rather
than incrementally commit-by-commit; from here on, each new entry should be
added before the *next* commit, per the rule above.

---

- **Date/time:** 2026-09-27, 21:23
- **Tag:** [routine]
- **What happened:** Crit 7 is the first deliverable on the full-stack
  starter, so its `CLAUDE.md` arrived as the bare template rather than
  carrying forward a prior week's lessons — there's no earlier full-stack repo
  to inherit from.
- **What I did instead of the obvious thing:** Wrote the harness rules and
  `docs/c7-brief.md` myself, as a step-by-step plan (Steps 0–5), rather than
  asking the agent to work from the published brief alone.
- **How I knew it was right:** Every following entry in this log cites back to
  a step this brief actually names.
- **Citation:**
  [`1a9650a`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit7-gera1t-2001/commit/1a9650a)
- **Curated prompt:** (none — `CLAUDE.md` and the brief were written directly,
  not produced by the agent)

---

- **Date/time:** 2026-09-27, ~21:40
- **Tag:** [routine]
- **What happened:** `pnpm install` failed compiling `better-sqlite3` (no
  `make`/`gcc` in the sandbox), and `flyctl` wasn't on `PATH`; the brief said
  to stop and ask before installing either.
- **What I did instead of the obvious thing:** Had the agent report both gaps
  instead of working around them. Installed `build-essential` by hand, then
  gave explicit go-ahead for `flyctl`'s official install script before it ran
  it.
- **How I knew it was right:** `pnpm install` and `pnpm check` both went green
  afterward, and the untouched starter deployed and answered 200 at its live
  URL — the brief's own definition of Step 0 done.
- **Citation:** (no commit — toolchain setup and the first deploy don't touch
  the repo)
- **Curated prompt:** "build-essential is installed, mise.local.toml is
  written, and I committed CLAUDE.md and docs/c7-brief.md. Retry pnpm
  install, then read docs/c7-brief.md in full and do Step 0 only, then stop."
  / "Go: install flyctl with the official script. It needs no sudo... Then
  finish Step 0."

---

- **Date/time:** 2026-09-27, 21:57
- **Tag:** [harness]
- **What happened:** The schema was replaced (`messages` → `bookings`, unique
  per room/date/slot). Asked for the migration-trail answer the brief
  required, and the agent first described drizzle's apply-decision as
  content-hash-based.
- **What I did instead of the obvious thing:** Didn't accept that explanation
  as given — required it to verify the claim against the actual migrator
  source in `node_modules/drizzle-orm` and quote the exact lines that decide
  whether a migration runs, before committing anything.
- **How I knew it was right:** The quoted source
  (`SQLiteSyncDialect.migrate()` in `dialect.cjs`) showed the real mechanism
  is a timestamp comparison against only the single latest applied row, not a
  hash comparison. The explanation was corrected, the practical conclusion
  (no clash) was re-checked against the real recorded timestamps, and only
  then committed.
- **Citation:**
  [`62fcf60`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit7-gera1t-2001/commit/62fcf60)
- **Curated prompt:** "Two things before committing. (1) Your migration
  explanation says drizzle tracks applied migrations by content hash. Check
  that against the actual migrator source... quote the lines that decide
  whether a migration runs. Correct your explanation if it's wrong... (2)
  Then commit Step 1."

---

- **Date/time:** 2026-09-27, 22:10
- **Tag:** [judgement]
- **What happened:** Rewriting the page and API route for bookings left one
  CSS selector (`#messages`) matching nothing rendered; the brief's Step 2
  file list didn't name `styles.css`.
- **What I did instead of the obvious thing:** Had the agent flag the
  mismatch and ask, rather than silently leave a dead selector or silently
  rename it as if it were already in scope.
- **How I knew it was right:** Got an explicit go-ahead for that one extra
  line before it was committed.
- **Citation:**
  [`f66d7df`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit7-gera1t-2001/commit/f66d7df)
- **Curated prompt:** "Accepted, including the styles.css selector rename.
  Commit Step 2 with a one-line message, then do Step 3 only: run pnpm check
  until green and stop."

---

- **Date/time:** 2026-09-27, 22:27
- **Tag:** [harness]
- **What happened:** `spec/bookings.test.ts`'s "doesn't duplicate the first
  booking" assertion had never failed, so on its own it was not evidence the
  collision rule actually worked.
- **What I did instead of the obvious thing:** Instead of trusting the green
  result, had the agent temporarily drop the unique index (a scratch schema
  edit plus a regenerated migration), run `pnpm test`, and show exactly which
  test went red before reverting.
- **How I knew it was right:** With the index removed, exactly 1 of 29 tests
  failed — the collision test, at the redirect-location assertion — and
  `pnpm check` was fully green again once `git checkout` reverted the scratch
  change. Both the broken state and the clean revert are on record, not just
  the final green.
- **Citation:**
  [`b63cbac`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit7-gera1t-2001/commit/b63cbac)
- **Curated prompt:** "Before committing: a test that has never failed proves
  nothing. (1) Quote the assertion... (2) Temporarily break the rule... Run
  pnpm test, show me which bookings tests go red, then revert with git
  checkout and confirm pnpm check is green again. (3) Commit Step 3."

---

- **Date/time:** 2026-09-27, 22:34
- **Tag:** [routine]
- **What happened:** Step 4 asked for the README describing the booking rule
  and what it protects.
- **What I did instead of the obvious thing:** Had the draft reviewed in chat
  before it touched disk, per the brief's own rule against editing
  `README.md` without a go-ahead.
- **How I knew it was right:** Approved the draft verbatim; `pnpm check` was
  still green once it was written.
- **Citation:**
  [`e1a77ca`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit7-gera1t-2001/commit/e1a77ca)
- **Curated prompt:** "README approved as drafted. Write it, run pnpm check,
  commit Step 4 with a one-line message. Then do Step 5: deploy, verify live
  with curl as the brief says, report, and stop."

---

- **Date/time:** 2026-09-27, after 22:34
- **Tag:** [routine]
- **What happened:** Step 5 asked to deploy the finished feature and verify
  it live with curl, the same way Step 0 verified the untouched starter.
- **What I did instead of the obvious thing:** Verified against the deployed
  URL directly — booking persistence across a reload, collision refusal, the
  `/readme/` route — rather than treating the local `pnpm check` pass as
  sufficient on its own.
- **How I knew it was right:** Each curl check matched the brief's own stated
  expectation: a repeat booking redirecting to `/?error=taken`, the original
  README text served in full at `/readme/`.
- **Citation:** (no commit — deployment and the curl checks don't touch the
  repo)
- **Curated prompt:** same message as the previous entry, Step 5 half.
