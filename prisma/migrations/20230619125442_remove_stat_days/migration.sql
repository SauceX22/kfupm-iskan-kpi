/*
  Warnings:

  - You are about to drop the column `daysLaterThanPlanned` on the `houseunitstatus` table. All the data in the column will be lost.
  - You are about to drop the column `daysToCompleteCleaning` on the `houseunitstatus` table. All the data in the column will be lost.
  - You are about to drop the column `daysToCompleteFurnishing` on the `houseunitstatus` table. All the data in the column will be lost.
  - You are about to drop the column `daysToCompleteGardening` on the `houseunitstatus` table. All the data in the column will be lost.
  - You are about to drop the column `totalDaysToCompleteAll` on the `houseunitstatus` table. All the data in the column will be lost.
  - You are about to drop the column `totalDaysToSubmitToTenant` on the `houseunitstatus` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `houseunitstatus` DROP COLUMN `daysLaterThanPlanned`,
    DROP COLUMN `daysToCompleteCleaning`,
    DROP COLUMN `daysToCompleteFurnishing`,
    DROP COLUMN `daysToCompleteGardening`,
    DROP COLUMN `totalDaysToCompleteAll`,
    DROP COLUMN `totalDaysToSubmitToTenant`;
