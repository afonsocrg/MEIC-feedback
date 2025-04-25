CREATE TABLE `specializations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `specializations_name_unique` ON `specializations` (`name`);
--> statement-breakpoint
CREATE TABLE `course_specializations` (
	`course_id` integer NOT NULL,
	`specialization_id` integer NOT NULL,
	PRIMARY KEY(`course_id`, `specialization_id`),
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`specialization_id`) REFERENCES `specializations`(`id`) ON UPDATE no action ON DELETE cascade
);