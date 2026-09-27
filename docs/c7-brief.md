# C7 plan and brief: ANU library study-room booking

This file is the plan for crit 7 and the brief you (the agent) work from.
Read all of it, then `CLAUDE.md`, `spec/README.md`, `fly.toml` and `src/`.
Work through the steps **in order**, do only the step I name, and **stop at
the end of each step** with: what you changed, what you ran, and the result.
Commit only after I say go, with a one-line English message.

## 1. What crit 7 requires (the spec, verbatim from the course site)

1. the app loads at its `*.fly.dev` URL by the cutoff
2. it models a slice of a real ANU system you actually deal with, wired end to end
3. the core flow persists across a reload --- create something, and it's still there
4. the repo shows the process --- commits that grew with the work, a process
   overview in `PROCESS.md`, and the week's reflection in `reflections/crit-7.md`
5. you can account for how you directed, grounded and corrected the work

"Don't rebuild the whole thing; model the slice that annoys you, wire it end
to end, and ship it to fly."

Live URL: <https://comp4020-crit7-gera1t-2001.fly.dev>

## 2. The slice

The real system is ANU Library study-room booking. The annoying part: you
can't see which slots are taken until the booking is refused. This prototype
replaces only that part:

- one page (`/`): a booking form and the list of existing bookings
- fields: `room` (select: `Chifley 2.01`, `Chifley 2.02`, `Hancock 3.11`),
  `date` (`<input type="date">`), `slot` (select: `09:00`, `11:00`, `13:00`,
  `15:00`, `17:00`; each a 2-hour block), `name` (text, max 60)
- a booking for a `room + date + slot` that is already taken is refused, the
  page says "That slot is already booked", and nothing is written
- otherwise it is written to SQLite and appears in the list after the redirect
- the list is newest first, at most 50 rows, and survives reload and redeploy

**Out of scope — do not add:** login, cancelling or editing bookings, real ANU
data, new pages, new dependencies, styling beyond the existing `styles.css`.

## 3. Who does what

| Mine (the human) | Yours (the agent) |
|---|---|
| `CLAUDE.md`, `PROCESS.md`, `reflections/crit-7.md` | schema, db functions, API route, page, spec tests |
| writing `mise.local.toml` (the Fly token) | running checks and deploys when I say go |
| approving each step and the README text | drafting README text in chat |
| running `/comp4020:ship` at the end | |

Never open, print or copy `mise.local.toml`. `flyctl` reads the token from the
environment via `mise`; you never need to see it.

## 4. Steps

### Step 0 — toolchain and first deploy of the untouched starter

Change no files in this step.

1. Report the output of `node -v`, `pnpm -v`, `mise --version`,
   `flyctl version`, `git remote -v`. If `mise` or `flyctl` is missing, tell me
   the install command and wait; don't install without my go-ahead.
   (flyctl: `curl -L https://fly.io/install.sh | sh`, then put `~/.fly/bin` on
   PATH. mise: `curl https://mise.run | sh`.)
2. Check `mise.local.toml` **exists** (`test -f`, do not read it).
3. `pnpm install`, then `pnpm check`. Report pass/fail counts.
4. Deploy the starter as it is:
   `mise exec -- flyctl deploy --remote-only --ha=false -a comp4020-crit7-gera1t-2001`
5. `curl -s -o /dev/null -w "%{http_code}" https://comp4020-crit7-gera1t-2001.fly.dev`
   must print `200`. Stop.

### Step 1 — schema and migration

- In `src/lib/schema.ts` replace `messages` with `bookings`: `id` int
  autoincrement primary key; `room`, `date` (`YYYY-MM-DD`), `slot` (`HH:MM`),
  `name` all text not null; `createdAt` (`created_at`) default
  `datetime('now')`. Add a **unique index** on `(room, date, slot)`.
- Delete `drizzle/0000_*.sql` and `drizzle/meta/*`, then `pnpm db:generate`
  so the migration trail starts from `bookings`. (The deployed volume has only
  the starter's `messages` table from step 0; tell me if you think a fresh
  trail will clash with it, and what you'd do instead.)
- `src/lib/db.ts`: `listBookings()` and
  `addBooking({ room, date, slot, name }): Booking | null`. Return `null`
  when the unique index rejects the row: catch the SQLite constraint error.
  Do not check-then-insert. Export the `Booking` type; keep the file's comments
  accurate.
- Show me the diff and the generated SQL. Stop.

### Step 2 — API route and page

- Rename `src/pages/api/messages.ts` to `src/pages/api/bookings.ts`. Validate:
  all four fields present; `room` and `slot` in the fixed lists; `date` matches
  `^\d{4}-\d{2}-\d{2}$`; `name` trimmed, 1–60 chars. Invalid → `303` to
  `/?error=invalid`. Collision (`addBooking` returned `null`) → `303` to
  `/?error=taken`. Success → `bus.emit("booking", row)`, then `303` to `/`.
- Put the room and slot lists in **one** place (e.g. `src/lib/options.ts`) and
  use it in both the route and the page.
- `src/pages/api/events.ts`: keep it as is except the event name `booking`
  and the type import. CI probes this endpoint after every deploy.
- `src/pages/index.astro`: `<title>ANU Room Booking</title>`; nav links
  "Bookings" (`/`) and "About" (`/readme/`); exactly one `<h1>`; the form with a
  `<label for>` on every field; a `<p role="alert">` only when `?error=` is set;
  `<ul id="bookings">` items as `room · date slot · name`. Keep `lang="en-AU"`,
  the viewport meta and the SSE `<script>` (adapted to the new event).
- `spec/routes.ts` stays `["/", "/readme/"]`.
- Run `pnpm typecheck`. Stop.

### Step 3 — spec tests

Delete `spec/guestbook.test.ts`. Write `spec/bookings.test.ts` in the same
style (same `post` helper with the `origin` header and `redirect: "manual"`),
using a unique name per run (`process.hrtime.bigint()`) and a far-future date:

1. a valid booking → `303` to `/`, and a fresh `GET /` contains the name
2. the same room/date/slot again → `303` to `/?error=taken`, and the first
   name still appears exactly once on `/`
3. `slot=10:30` → `303` to `/?error=invalid`
4. a new booking arrives on `/api/events` (adapt the existing SSE test)

Run `pnpm check` until green. Don't weaken or delete `invariants.test.ts` or
`readme.test.ts` to get there. Stop.

### Step 4 — README

Draft `README.md` **in chat**, under 200 words: one paragraph on what this is
and which real ANU system it stands in for; a "What good looks like here"
section naming the rule (a slot can be booked once, enforced by the database,
not the page), what `spec/bookings.test.ts` protects, and what was left out.
The template comment must be gone. Write the file only after I approve the
text. Run `pnpm check`. Stop.

### Step 5 — deploy and verify live

1. `mise exec -- flyctl deploy --remote-only --ha=false -a comp4020-crit7-gera1t-2001`
2. On the live URL, with `curl`: POST a booking (send the `origin` header),
   then `GET /` twice and confirm it's there both times; POST the same slot
   and confirm `?error=taken`; `GET /readme/` returns `200`.
3. Report the results. Stop. I test it in the browser myself and reload.

### After step 5 (mine)

I write `PROCESS.md` and `reflections/crit-7.md`, run
`pnpm check && pnpm check:evidence`, then `/comp4020:ship`.
