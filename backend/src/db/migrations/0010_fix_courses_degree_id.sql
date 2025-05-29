PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_courses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`external_id` text,
	`name` text NOT NULL,
	`acronym` text NOT NULL,
	`degree_id` integer,
	`description` text,
	`url` text,
	`created_at` integer,
	`updated_at` integer,
	`period` text,
	`evaluation_method` text,
	FOREIGN KEY (`degree_id`) REFERENCES `degrees`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_courses`("id", "external_id", "name", "acronym", "degree_id", "description", "url", "created_at", "updated_at", "period", "evaluation_method") SELECT "id", "external_id", "name", "acronym", NULL, "description", "url", "created_at", "updated_at", "period", "evaluation_method" FROM `courses`;--> statement-breakpoint


DROP TABLE `__new_feedback`;
CREATE TABLE `__new_feedback` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text,
	`school_year` integer,
	`course_id` integer NOT NULL,
	`rating` integer NOT NULL,
	`workload_rating` integer,
	`comment` text,
	`original_comment` text,
	`approved_at` integer,
	`created_at` integer,
	FOREIGN KEY (`course_id`) REFERENCES `__new_courses`(`id`) ON UPDATE no action ON DELETE no action
);
INSERT INTO `__new_feedback`
	  ("id", "email", "school_year", "course_id", "rating", "workload_rating", "comment", "original_comment", "approved_at", "created_at")
SELECT "id", "email", "school_year", "course_id", "rating", "workload_rating", "comment", "original_comment", "approved_at", "created_at"
FROM `feedback`;--> statement-breakpoint

DROP TABLE `feedback`;--> statement-breakpoint
DROP TABLE `courses`;--> statement-breakpoint
ALTER TABLE `__new_courses` RENAME TO `courses`;--> statement-breakpoint
ALTER TABLE `__new_feedback` RENAME TO `feedback`;--> statement-breakpoint

PRAGMA foreign_keys=ON;