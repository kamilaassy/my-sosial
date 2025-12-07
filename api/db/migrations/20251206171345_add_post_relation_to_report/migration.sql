-- DropIndex
DROP INDEX `Report_status_idx` ON `report`;

-- AlterTable
ALTER TABLE `report` ADD COLUMN `postId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
