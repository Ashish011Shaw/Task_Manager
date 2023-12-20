/*
  Warnings:

  - You are about to drop the column `created_by` on the `Task` table. All the data in the column will be lost.
  - Added the required column `admin_id` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Task` DROP FOREIGN KEY `Task_created_by_fkey`;

-- AlterTable
ALTER TABLE `Task` DROP COLUMN `created_by`,
    ADD COLUMN `admin_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `Admin`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
