# C7 finish: PROCESS.md and reflection

This is my go-ahead to edit `PROCESS.md` and `reflections/crit-7.md` (CLAUDE.md
otherwise reserves them). Do the steps in order and stop at the end.

Drafts (written for me, in my Windows folder):

- `/mnt/c/Users/Administrator/Desktop/COMP8020/comp4020-crit7-gera1t-2001-main/docs/PROCESS-draft.md`
- `/mnt/c/Users/Administrator/Desktop/COMP8020/comp4020-crit7-gera1t-2001-main/docs/crit-7-draft.md`

## 1. PROCESS.md

Copy `PROCESS-draft.md` over `PROCESS.md` in the repo root, then fill its two
placeholders from the real record:

- `HARNESS_SHA` (appears twice, link text and URL): the short SHA of my commit
  "Add harness rules and C7 brief", from `git log --oneline`.
- `RED_TEST_RESULT`: what actually happened when you broke the unique index on
  purpose in Step 3 — which bookings tests went red, and that they went green
  after the revert. One short clause, facts only. If you don't have that result
  in this session, say so and stop; don't guess.

Don't change anything else in the draft. Every claim in it has to be true. If
any sentence contradicts what you saw this week, quote it and tell me, but
don't rewrite it.

## 2. reflections/crit-7.md

Copy `crit-7-draft.md` to `reflections/crit-7.md`. Replace the two `TODO` lines
at the end with the sentence I give you in my message, translated into plain
English if I wrote it in Chinese. Keep my meaning; don't add to it. Change
nothing else.

## 3. Check and commit

1. Show me both finished files in chat, with word counts (target 150–300 each).
2. Run `pnpm check` and `pnpm check:evidence`. Both must pass. If
   `check:evidence` fails, report which line and stop.
3. Commit both files with the message
   `Add process overview and crit 7 reflection`.
4. Report the commit SHA and stop. Don't push, don't run `/comp4020:ship` —
   I do that myself.
