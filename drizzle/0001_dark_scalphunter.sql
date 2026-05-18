CREATE TABLE `cars` (
	`id` int AUTO_INCREMENT NOT NULL,
	`brand` varchar(100) NOT NULL,
	`model` varchar(100) NOT NULL,
	`year` int NOT NULL,
	`price` int NOT NULL,
	`mileage` int NOT NULL,
	`engine` varchar(100) NOT NULL,
	`transmission` varchar(50) NOT NULL,
	`fuel` varchar(50) NOT NULL,
	`color` varchar(50) NOT NULL,
	`description` text,
	`images` text NOT NULL DEFAULT ('[]'),
	`featured` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cars_id` PRIMARY KEY(`id`)
);
