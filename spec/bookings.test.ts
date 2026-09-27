import { beforeAll, describe, expect, inject, it } from "vitest";

// Crit 7's own contract: a slot can be booked once, the database enforces it
// (not the page), and every open tab hears about a new booking over SSE.
const baseUrl = inject("baseUrl");

describe("bookings", () => {
  let room: string;
  let date: string;
  let slot: string;
  let name: string;

  beforeAll(() => {
    room = "Chifley 2.01";
    date = "2099-01-01";
    slot = "09:00";
    name = `spec probe ${process.hrtime.bigint()}`;
  });

  // Astro checks form POSTs carry a same-origin Origin header (CSRF
  // protection); browsers send it automatically, a bare fetch doesn't.
  const post = (path: string, body: URLSearchParams) =>
    fetch(new URL(path, baseUrl), {
      method: "POST",
      headers: { origin: baseUrl },
      body,
      redirect: "manual",
    });

  it("accepts a valid booking and redirects back to the page", async () => {
    const res = await post("/api/bookings", new URLSearchParams({ room, date, slot, name }));
    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toBe("/");

    const page = await fetch(baseUrl);
    expect(await page.text()).toContain(name);
  });

  it("refuses the same room/date/slot again, and doesn't duplicate the first booking", async () => {
    const res = await post(
      "/api/bookings",
      new URLSearchParams({ room, date, slot, name: `${name} again` }),
    );
    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toBe("/?error=taken");

    const page = await fetch(baseUrl);
    const text = await page.text();
    expect(text.split(name).length - 1).toBe(1);
  });

  it("refuses a slot outside the fixed list", async () => {
    const res = await post(
      "/api/bookings",
      new URLSearchParams({
        room,
        date,
        slot: "10:30",
        name: `spec probe ${process.hrtime.bigint()}`,
      }),
    );
    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toBe("/?error=invalid");
  });

  it("broadcasts a new booking over the SSE stream", async () => {
    const liveName = `live probe ${process.hrtime.bigint()}`;

    // subscribe first, then post, then read until the event arrives
    const stream = await fetch(new URL("/api/events", baseUrl));
    expect(stream.headers.get("content-type")).toContain("text/event-stream");
    const reader = stream.body?.getReader();
    if (!reader) throw new Error("no response body");

    await post(
      "/api/bookings",
      new URLSearchParams({ room, date, slot: "11:00", name: liveName }),
    );

    const decoder = new TextDecoder();
    let received = "";
    while (!received.includes(liveName)) {
      const { value, done } = await reader.read();
      if (done) throw new Error("stream ended before the event arrived");
      received += decoder.decode(value, { stream: true });
    }
    await reader.cancel();
    expect(received).toContain(`data: `);
    expect(received).toContain(liveName);
  }, 10_000);
});
