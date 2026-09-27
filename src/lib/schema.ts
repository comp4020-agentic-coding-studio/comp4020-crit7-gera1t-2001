import { sql } from "drizzle-orm";
import { int, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

// The schema is the ground truth for the database. To change it: edit here,
// run `pnpm db:generate` to turn the diff into a migration under drizzle/,
// and commit both — the migration applies automatically when the server
// boots (see src/lib/db.ts), locally and deployed. Never edit the database
// by hand: state on the deployed volume outlives every deploy, and the
// migration trail is what keeps old state and new code compatible.
export const bookings = sqliteTable(
  "bookings",
  {
    id: int().primaryKey({ autoIncrement: true }),
    room: text().notNull(),
    date: text().notNull(),
    slot: text().notNull(),
    name: text().notNull(),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (table) => [uniqueIndex("bookings_room_date_slot_unique").on(table.room, table.date, table.slot)],
);

export type Booking = typeof bookings.$inferSelect;
