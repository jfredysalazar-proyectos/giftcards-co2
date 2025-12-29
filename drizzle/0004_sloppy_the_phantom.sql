CREATE TABLE `announcements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`text` text NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`backgroundColor` varchar(50) NOT NULL DEFAULT '#7c3aed',
	`textColor` varchar(50) NOT NULL DEFAULT '#ffffff',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `announcements_id` PRIMARY KEY(`id`)
);
