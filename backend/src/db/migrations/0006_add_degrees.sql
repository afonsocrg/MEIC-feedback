CREATE TABLE `degrees` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`external_id` text NOT NULL,
	`type` text NOT NULL,
	`name` text NOT NULL,
	`acronym` text NOT NULL,
	`campus` text NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
