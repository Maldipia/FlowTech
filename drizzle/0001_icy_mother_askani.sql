CREATE TABLE `audit_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`userId` int,
	`action` varchar(100) NOT NULL,
	`entity` varchar(50) NOT NULL,
	`entityId` int,
	`meta` json,
	`ipAddress` varchar(45),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `dining_tables` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`name` varchar(50) NOT NULL,
	`capacity` int NOT NULL DEFAULT 4,
	`section` varchar(100),
	`status` enum('available','occupied','reserved','cleaning') NOT NULL DEFAULT 'available',
	`isActive` boolean NOT NULL DEFAULT true,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `dining_tables_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `menu_categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`sortOrder` int NOT NULL DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `menu_categories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `menu_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`categoryId` int NOT NULL,
	`name` varchar(200) NOT NULL,
	`description` text,
	`price` decimal(10,2) NOT NULL,
	`imageUrl` text,
	`isAvailable` boolean NOT NULL DEFAULT true,
	`isTaxable` boolean NOT NULL DEFAULT true,
	`taxRate` decimal(5,2) DEFAULT '12.00',
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `menu_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `modifier_groups` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`menuItemId` int NOT NULL,
	`name` varchar(100) NOT NULL,
	`isRequired` boolean NOT NULL DEFAULT false,
	`allowMultiple` boolean NOT NULL DEFAULT false,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `modifier_groups_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `modifier_options` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`groupId` int NOT NULL,
	`name` varchar(100) NOT NULL,
	`priceDelta` decimal(10,2) NOT NULL DEFAULT '0.00',
	`isDefault` boolean NOT NULL DEFAULT false,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `modifier_options_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`orderId` int NOT NULL,
	`menuItemId` int,
	`name` varchar(200) NOT NULL,
	`unitPrice` decimal(10,2) NOT NULL,
	`quantity` int NOT NULL DEFAULT 1,
	`totalPrice` decimal(10,2) NOT NULL,
	`modifiers` json,
	`notes` text,
	`status` enum('pending','preparing','ready','served','voided') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `order_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`tableId` int,
	`cashierId` int,
	`orderType` enum('dine_in','takeout','delivery') NOT NULL DEFAULT 'dine_in',
	`status` enum('open','in_progress','ready','completed','voided','refunded') NOT NULL DEFAULT 'open',
	`customerName` varchar(200),
	`customerCount` int DEFAULT 1,
	`subtotal` decimal(10,2) NOT NULL DEFAULT '0.00',
	`taxAmount` decimal(10,2) NOT NULL DEFAULT '0.00',
	`discountAmount` decimal(10,2) NOT NULL DEFAULT '0.00',
	`totalAmount` decimal(10,2) NOT NULL DEFAULT '0.00',
	`notes` text,
	`voidReason` text,
	`voidedAt` timestamp,
	`voidedBy` int,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`orderId` int NOT NULL,
	`cashierId` int,
	`method` enum('cash','card','gcash','maya','bank_transfer','other') NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`amountTendered` decimal(10,2),
	`changeAmount` decimal(10,2),
	`status` enum('pending','completed','failed','refunded') NOT NULL DEFAULT 'pending',
	`stripePaymentIntentId` varchar(255),
	`stripeChargeId` varchar(255),
	`birReceiptNo` varchar(50),
	`birIssuedAt` timestamp,
	`refundReason` text,
	`refundedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`tenantId` int NOT NULL,
	`role` enum('admin','manager','cashier') NOT NULL DEFAULT 'cashier',
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `profiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tenants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`subdomain` varchar(100) NOT NULL,
	`businessType` enum('RESTAURANT','CAFE','BAR','FOOD_TRUCK','BAKERY','FASTFOOD','OTHER') NOT NULL DEFAULT 'RESTAURANT',
	`addressStreet` text,
	`addressCity` varchar(100),
	`addressProvince` varchar(100),
	`addressPostalCode` varchar(10),
	`contactEmail` varchar(320),
	`contactPhone` varchar(30),
	`currency` varchar(3) NOT NULL DEFAULT 'PHP',
	`timezone` varchar(50) NOT NULL DEFAULT 'Asia/Manila',
	`birTin` varchar(20),
	`birRegisteredName` varchar(255),
	`birAddress` text,
	`birPermitNo` varchar(50),
	`birAccreditationNo` varchar(50),
	`birAccreditationDate` timestamp,
	`birAccreditationExpiry` timestamp,
	`plan` enum('starter','professional','enterprise') NOT NULL DEFAULT 'starter',
	`isActive` boolean NOT NULL DEFAULT true,
	`receiptSequence` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tenants_id` PRIMARY KEY(`id`),
	CONSTRAINT `tenants_subdomain_unique` UNIQUE(`subdomain`)
);
--> statement-breakpoint
CREATE TABLE `z_reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tenantId` int NOT NULL,
	`generatedBy` int,
	`reportDate` timestamp NOT NULL,
	`reportNo` varchar(50) NOT NULL,
	`totalTransactions` int NOT NULL DEFAULT 0,
	`totalSales` decimal(12,2) NOT NULL DEFAULT '0.00',
	`totalVat` decimal(12,2) NOT NULL DEFAULT '0.00',
	`totalDiscount` decimal(12,2) NOT NULL DEFAULT '0.00',
	`totalVoids` decimal(12,2) NOT NULL DEFAULT '0.00',
	`totalRefunds` decimal(12,2) NOT NULL DEFAULT '0.00',
	`cashSales` decimal(12,2) NOT NULL DEFAULT '0.00',
	`cardSales` decimal(12,2) NOT NULL DEFAULT '0.00',
	`otherSales` decimal(12,2) NOT NULL DEFAULT '0.00',
	`openingBalance` decimal(12,2) NOT NULL DEFAULT '0.00',
	`closingBalance` decimal(12,2) NOT NULL DEFAULT '0.00',
	`reportData` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `z_reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_tenantId_tenants_id_fk` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `dining_tables` ADD CONSTRAINT `dining_tables_tenantId_tenants_id_fk` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `menu_categories` ADD CONSTRAINT `menu_categories_tenantId_tenants_id_fk` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `menu_items` ADD CONSTRAINT `menu_items_tenantId_tenants_id_fk` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `menu_items` ADD CONSTRAINT `menu_items_categoryId_menu_categories_id_fk` FOREIGN KEY (`categoryId`) REFERENCES `menu_categories`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `modifier_groups` ADD CONSTRAINT `modifier_groups_tenantId_tenants_id_fk` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `modifier_groups` ADD CONSTRAINT `modifier_groups_menuItemId_menu_items_id_fk` FOREIGN KEY (`menuItemId`) REFERENCES `menu_items`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `modifier_options` ADD CONSTRAINT `modifier_options_tenantId_tenants_id_fk` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `modifier_options` ADD CONSTRAINT `modifier_options_groupId_modifier_groups_id_fk` FOREIGN KEY (`groupId`) REFERENCES `modifier_groups`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_tenantId_tenants_id_fk` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_orderId_orders_id_fk` FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_menuItemId_menu_items_id_fk` FOREIGN KEY (`menuItemId`) REFERENCES `menu_items`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_tenantId_tenants_id_fk` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_tableId_dining_tables_id_fk` FOREIGN KEY (`tableId`) REFERENCES `dining_tables`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_cashierId_users_id_fk` FOREIGN KEY (`cashierId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_voidedBy_users_id_fk` FOREIGN KEY (`voidedBy`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_tenantId_tenants_id_fk` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_orderId_orders_id_fk` FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_cashierId_users_id_fk` FOREIGN KEY (`cashierId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `profiles` ADD CONSTRAINT `profiles_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `profiles` ADD CONSTRAINT `profiles_tenantId_tenants_id_fk` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `z_reports` ADD CONSTRAINT `z_reports_tenantId_tenants_id_fk` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `z_reports` ADD CONSTRAINT `z_reports_generatedBy_users_id_fk` FOREIGN KEY (`generatedBy`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;