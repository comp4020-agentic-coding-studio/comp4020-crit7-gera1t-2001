# Process overview

## What I built

A one-page stand-in for ANU Library study-room booking: pick a room, a date
and a two-hour slot, and each slot can be booked once. It runs on the course's
Astro + Drizzle/SQLite starter, deployed to Fly.io.

## How I got here

Before any code I wrote `CLAUDE.md` and a stepwise brief, `docs/c7-brief.md`,
that makes the agent do one named step, report, and stop for my go-ahead
([`HARNESS_SHA`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit7-gera1t-2001/commit/HARNESS_SHA)).
It first paid off in Step 0: `flyctl` was missing, and the agent stopped and
asked instead of installing it. I also deployed the untouched starter first, to
prove the token and deploy path before any work depended on them.

The rule the app exists for lives in a unique index on `(room, date, slot)`,
not in page logic; I read the generated SQL myself to confirm it
([`62fcf60`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit7-gera1t-2001/commit/62fcf60)).
In the same step the agent claimed drizzle skips applied migrations by content
hash. I asked it to show the source rather than assert it. It quoted
`SQLiteSyncDialect.migrate`, which compares only timestamps, and corrected
itself: the conclusion held, for a weaker reason.

The route and page came next
([`f66d7df`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit7-gera1t-2001/commit/f66d7df)),
then spec tests
([`b63cbac`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit7-gera1t-2001/commit/b63cbac)).
They passed on the first run, so I had the agent break the rule on purpose:
RED_TEST_RESULT. The README was drafted in chat and approved before it was
written
([`e1a77ca`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit7-gera1t-2001/commit/e1a77ca)).

One surprise: after committing, the live site still showed the guestbook. While
the repo is private, a commit is not a deploy; only `flyctl deploy` updates
Fly. After redeploying I booked a slot in the browser, reloaded, and saw it
still there, then booked the same slot again and saw it refused.
