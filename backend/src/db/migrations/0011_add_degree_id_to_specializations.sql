ALTER TABLE `specializations` ADD `degree_id` integer REFERENCES degrees(id);--> statement-breakpoint
update specializations set degree_id = 60;