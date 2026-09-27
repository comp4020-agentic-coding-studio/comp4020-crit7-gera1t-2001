import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import Database from "better-sqlite3";
import { desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { type Booking, bookings } from "./schema";

// One SQLite file is the app's whole persistent state. In production
// fly.toml points DATABASE_PATH at the machine's volume (/data), which is
// how state survives a reload and a redeploy; locally it defaults to an
// untracked file in .data/.
const path = process.env.DATABASE_PATH ?? "./.data/app.db";
mkdirSync(dirname(path), { recursive: true });

const client = new Database(path);
client.pragma("journal_mode = WAL");

export const db = drizzle(client);

// Migrations run at boot, on whatever machine holds the volume — the
// recommended shape for SQLite on Fly, where there's no separate machine to
// run them from. The flow: edit src/lib/schema.ts, `pnpm db:generate`,
// commit the migration it writes to drizzle/.
migrate(db, { migrationsFolder: "./drizzle" });

export type { Booking };

export function listBookings(): Booking[] {
  return db.select().from(bookings).orderBy(desc(bookings.id)).limit(50).all();
}

export function addBooking(input: {
  room: string;
  date: string;
  slot: string;
  name: string;
}): Booking | null {
  try {
    return db.insert(bookings).values(input).returning().get();
  } catch (err) {
    if (err instanceof Database.SqliteError && err.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return null;
    }
    throw err;
  }
}
