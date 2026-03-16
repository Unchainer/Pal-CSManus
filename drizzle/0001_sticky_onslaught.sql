CREATE TABLE `campaignMedia` (
	`id` int AUTO_INCREMENT NOT NULL,
	`campaignId` int NOT NULL,
	`mediaId` int NOT NULL,
	`order` int NOT NULL,
	`durationOverride` int,
	CONSTRAINT `campaignMedia_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `campaigns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`status` enum('draft','active','paused','archived') NOT NULL DEFAULT 'draft',
	`scheduledStart` timestamp,
	`scheduledEnd` timestamp,
	`loop` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `campaigns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `media` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`filename` varchar(255) NOT NULL,
	`url` text NOT NULL,
	`fileKey` text NOT NULL,
	`mimeType` varchar(50) NOT NULL,
	`sizeBytes` bigint NOT NULL,
	`durationSeconds` int,
	`thumbnailUrl` text,
	`status` enum('uploading','ready','failed') NOT NULL DEFAULT 'uploading',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `media_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`playerId` int,
	`userId` int,
	`type` enum('campaign_assigned','content_updated','offline_alert','sync_error','system') NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`sentAt` timestamp NOT NULL DEFAULT (now()),
	`readAt` timestamp,
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `playerCampaigns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`playerId` int NOT NULL,
	`campaignId` int NOT NULL,
	`assignedAt` timestamp NOT NULL DEFAULT (now()),
	`status` enum('pending','synced','playing','failed') NOT NULL DEFAULT 'pending',
	CONSTRAINT `playerCampaigns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `players` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`pairingCode` varchar(10) NOT NULL,
	`deviceId` varchar(255),
	`status` enum('online','offline','pairing') NOT NULL DEFAULT 'pairing',
	`lastSync` timestamp,
	`currentCampaignId` int,
	`location` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `players_id` PRIMARY KEY(`id`),
	CONSTRAINT `players_pairingCode_unique` UNIQUE(`pairingCode`),
	CONSTRAINT `players_deviceId_unique` UNIQUE(`deviceId`)
);
--> statement-breakpoint
CREATE TABLE `syncLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`playerId` int NOT NULL,
	`campaignId` int,
	`syncTimestamp` timestamp NOT NULL DEFAULT (now()),
	`status` enum('success','failed','partial') NOT NULL,
	`errorMessage` text,
	CONSTRAINT `syncLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `avatarUrl` text;