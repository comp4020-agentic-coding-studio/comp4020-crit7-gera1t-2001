# Crit 7

## What was the breakthrough that moved the work forward?

The breakthrough was noticing what was missing. Every repo since crit 2 had
arrived with a carried-forward section in `CLAUDE.md`: rules distilled from my
earlier weeks, such as "a green `pnpm check` doesn't prove the page is right".
The crit 7 repo arrived with an empty `CLAUDE.md`, and I only noticed near the
end, when I went looking for my process log and it wasn't there.

Looking back, I had rebuilt two of those rules by hand without seeing them
written down. When the booking tests passed on the first run, I had the agent
break the unique index on purpose to watch a test go red: the old rule that a
check has to be shown reacting to a deliberate fault. And when the live site
still showed the starter guestbook after four green commits, I learned again
that passing checks are not what a user sees; only the deployed page is.

## What did this work change about who I want to be as a software developer?

I had been treating those rules as something the course handed me each week,
when they were things I had learned from my own mistakes. If they only exist
because a repo generator copies them in, they are not really my habits yet. I
want to keep my working rules somewhere I control and bring them into each
project on purpose, instead of hoping they arrive.

Next week I will rework my CLAUDE.md properly, because Assignment 3, the most
important piece of work, is coming up.
