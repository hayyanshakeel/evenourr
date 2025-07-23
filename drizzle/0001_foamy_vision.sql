CREATE TABLE `collections` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`handle` text NOT NULL,
	`description` text,
	`imageUrl` text,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `products_to_collections` (
	`product_id` integer NOT NULL,
	`collection_id` integer NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`collection_id`) REFERENCES `collections`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
DROP TABLE `coupons`;--> statement-breakpoint
DROP TABLE `customers`;--> statement-breakpoint
DROP TABLE `order_items`;--> statement-breakpoint
DROP TABLE `orders`;--> statement-breakpoint
DROP TABLE `variants`;--> statement-breakpoint
/*
 SQLite does not support "Dropping foreign key" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html

 Due to that we don't generate migration automatically and it has to be done manually
*/--> statement-breakpoint
DROP INDEX IF EXISTS `products_slug_unique`;--> statement-breakpoint
/*
You're trying to delete PRIMARY KEY(cart_id,product_id) from 'cart_items' table
SQLite does not supportprimary key deletion from existing table
You can do it in 3 steps with drizzle orm:
 - create new mirror table table without pk, rename current table to old_table, generate SQL
 - migrate old data from one table to another
 - delete old_table in schema, generate sql

or create manual migration like below:

ALTER TABLE table_name RENAME TO old_table;
CREATE TABLE table_name (
	column1 datatype [ NULL | NOT NULL ],
	column2 datatype [ NULL | NOT NULL ],
	...
	PRIMARY KEY (pk_col1, pk_col2, ... pk_col_n)
 );
INSERT INTO table_name SELECT * FROM old_table;

Due to that we don't generate migration automatically and it has to be done manually
*/
--> statement-breakpoint
/*
 SQLite does not support "Changing existing column type" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html
                  https://stackoverflow.com/questions/2083543/modify-a-columns-type-in-sqlite3

 Due to that we don't generate migration automatically and it has to be done manually
*/--> statement-breakpoint
/*
 SQLite does not support "Drop not null from column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html
                  https://stackoverflow.com/questions/2083543/modify-a-columns-type-in-sqlite3

 Due to that we don't generate migration automatically and it has to be done manually
*/--> statement-breakpoint
ALTER TABLE `cart_items` ADD `id` integer PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE `cart_items` ADD `created_at` integer;--> statement-breakpoint
ALTER TABLE `carts` ADD `session_id` text;--> statement-breakpoint
ALTER TABLE `products` ADD `image_url` text;--> statement-breakpoint
CREATE UNIQUE INDEX `collections_handle_unique` ON `collections` (`handle`);--> statement-breakpoint
CREATE UNIQUE INDEX `unique_product_per_cart` ON `cart_items` (`cart_id`,`product_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `carts_session_id_unique` ON `carts` (`session_id`);--> statement-breakpoint
/*
 SQLite does not support "Creating foreign key on existing column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html

 Due to that we don't generate migration automatically and it has to be done manually
*/--> statement-breakpoint
ALTER TABLE `products` DROP COLUMN `slug`;--> statement-breakpoint
ALTER TABLE `products` DROP COLUMN `imageUrl`;--> statement-breakpoint
ALTER TABLE `products` DROP COLUMN `status`;