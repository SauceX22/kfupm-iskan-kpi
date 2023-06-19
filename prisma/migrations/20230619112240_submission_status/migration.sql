/*
  Warnings:

  - You are about to drop the column `houseSubmissionStatus` on the `houseunitstatus` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `houseunitstatus` DROP COLUMN `houseSubmissionStatus`,
    ADD COLUMN `submissionStatus` ENUM('EARLY_SUBMISSION', 'DONE_ON_TARGET', 'LATE_SUBMISSION', 'PENDING_MAINTENANCE', 'PENDING_CLEANING', 'PENDING_FURNISHING', 'PENDING_GARDENING', 'PENDING_FINAL_INSPECTION', 'PENDING_TENANT_ASSIGNMENT') NOT NULL DEFAULT 'PENDING_MAINTENANCE';
