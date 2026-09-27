CREATE TABLE `bookings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`room` text NOT NULL,
	`date` text NOT NULL,
	`slot` text NOT NULL,
	`name` text NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `bookings_room_date_slot_unique` ON `bookings` (`room`,`date`,`slot`);