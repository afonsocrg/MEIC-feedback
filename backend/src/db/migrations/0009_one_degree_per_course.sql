DROP TABLE `courses_degrees`;--> statement-breakpoint
DROP INDEX `courses_acronym_unique`;--> statement-breakpoint
ALTER TABLE `courses` ADD `degree_id` text REFERENCES degrees(id);