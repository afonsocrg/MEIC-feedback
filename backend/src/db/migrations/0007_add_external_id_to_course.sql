-- Make degrees.external_id nullable
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_degrees` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`external_id` text,
	`type` text NOT NULL,
	`name` text NOT NULL,
	`acronym` text NOT NULL,
	`campus` text NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
INSERT INTO `__new_degrees`("id", "external_id", "type", "name", "acronym", "campus", "created_at", "updated_at") SELECT "id", "external_id", "type", "name", "acronym", "campus", "created_at", "updated_at" FROM `degrees`;--> statement-breakpoint
DROP TABLE `degrees`;--> statement-breakpoint
ALTER TABLE `__new_degrees` RENAME TO `degrees`;--> statement-breakpoint

PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `courses` ADD `external_id` text;