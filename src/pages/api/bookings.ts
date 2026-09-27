import type { APIRoute } from "astro";
import { addBooking } from "../../lib/db";
import { bus } from "../../lib/events";
import { ROOMS, SLOTS } from "../../lib/options";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// The write half of the demo: a plain HTML form POSTs here, the booking goes
// into SQLite (or is refused if the slot is taken), and a new one is
// broadcast to every open SSE connection. The 303 redirect makes the form
// work with no client-side JavaScript at all — the submitting tab re-renders
// from the database; every *other* tab hears about it over the stream.
export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const room = form.get("room");
  const date = form.get("date");
  const slot = form.get("slot");
  const name = form.get("name");

  if (
    typeof room !== "string" ||
    typeof date !== "string" ||
    typeof slot !== "string" ||
    typeof name !== "string"
  ) {
    return redirect("/?error=invalid", 303);
  }

  const trimmedName = name.trim();
  const valid =
    (ROOMS as readonly string[]).includes(room) &&
    (SLOTS as readonly string[]).includes(slot) &&
    DATE_RE.test(date) &&
    trimmedName.length >= 1 &&
    trimmedName.length <= 60;

  if (!valid) {
    return redirect("/?error=invalid", 303);
  }

  const booking = addBooking({ room, date, slot, name: trimmedName });
  if (!booking) {
    return redirect("/?error=taken", 303);
  }

  bus.emit("booking", booking);
  return redirect("/", 303);
};
