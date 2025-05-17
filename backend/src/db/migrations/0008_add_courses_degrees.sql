CREATE TABLE `courses_degrees` (
	`course_id` integer NOT NULL,
	`degree_id` integer NOT NULL,
	PRIMARY KEY(`course_id`, `degree_id`),
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`degree_id`) REFERENCES `degrees`(`id`) ON UPDATE no action ON DELETE cascade
);
