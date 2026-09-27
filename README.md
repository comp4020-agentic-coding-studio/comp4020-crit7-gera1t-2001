# ANU Room Booking

A prototype for ANU Library study-room booking — specifically the part that's
annoying in the real system: you can't see which slots are taken until your
booking gets refused. This replaces just that slice: pick a room, date and
2-hour slot, give your name, and book it. The list of existing bookings is
right there on the same page, live, in every open tab.

## What good looks like here

The rule that matters: **a slot can be booked once.** A room/date/slot
combination that's already taken is refused with "That slot is already
booked," and nothing is written. That's enforced by a unique index in
SQLite, not by checking-then-inserting in the page — the database is the
one source of truth, so it can't race. `spec/bookings.test.ts` protects
this directly: it books a slot, confirms a repeat is refused and doesn't
duplicate the original, rejects an out-of-list slot, and confirms a new
booking reaches other tabs over SSE.

Left out on purpose: logins, cancelling or editing a booking, real ANU
data, new pages, and anything beyond the existing styling.
