/*
  Warnings:

  - You are about to drop the column `comments` on the `houseunitstatus` table. All the data in the column will be lost.
  - You are about to drop the column `dateCheckedAndSubmitedToTenant` on the `houseunitstatus` table. All the data in the column will be lost.
  - You are about to drop the column `dateTenantSurveyFilled` on the `houseunitstatus` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `houseunitstatus` DROP COLUMN `comments`,
    DROP COLUMN `dateCheckedAndSubmitedToTenant`,
    DROP COLUMN `dateTenantSurveyFilled`,
    ADD COLUMN `comment` VARCHAR(191) NULL,
    ADD COLUMN `dateCheckedAndSubmitedToCommittee` DATETIME(3) NULL,
    ADD COLUMN `satisfactionStatus` ENUM('NONE', 'SATISFIED', 'PARTIALLY_SATISFIED', 'UNSATISFIED') NOT NULL DEFAULT 'NONE',
    MODIFY `submissionStatus` ENUM('NOT_STARTED', 'PENDING_MAINTENANCE', 'PENDING_CLEANING', 'PENDING_FURNISHING', 'PENDING_GARDENING', 'PENDING_FINAL_INSPECTION', 'PENDING_TENANT_ASSIGNMENT', 'EARLY_SUBMISSION', 'DONE_ON_TARGET', 'LATE_SUBMISSION') NOT NULL DEFAULT 'PENDING_MAINTENANCE';
