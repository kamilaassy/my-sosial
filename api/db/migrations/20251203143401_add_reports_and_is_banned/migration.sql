/*
  Warnings:

  - You are about to drop the column `userId` on the `notification` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `notification` DROP FOREIGN KEY `Notification_userId_fkey`;

-- DropIndex
DROP INDEX `Notification_userId_fkey` ON `notification`;

-- AlterTable
ALTER TABLE `notification` DROP COLUMN `userId`,
    ADD COLUMN `commentText` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `isBanned` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `Report` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reporterId` INTEGER NOT NULL,
    `reportedId` INTEGER NOT NULL,
    `reason` VARCHAR(191) NOT NULL,
    `details` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'REVIEWED', 'ACTION_TAKEN', 'DISMISSED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Report_reportedId_idx`(`reportedId`),
    INDEX `Report_reporterId_idx`(`reporterId`),
    INDEX `Report_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_reporterId_fkey` FOREIGN KEY (`reporterId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_reportedId_fkey` FOREIGN KEY (`reportedId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
