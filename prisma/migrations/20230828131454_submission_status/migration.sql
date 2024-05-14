/*
  Warnings:

  - The values [PENDING_MAINTENANCE,PENDING_CLEANING,PENDING_FURNISHING,PENDING_GARDENING] on the enum `HouseSubmissionStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "HouseSubmissionStatus_new" AS ENUM ('NOT_STARTED', 'PENDING_MAINTENANCE_COMPLETION', 'PENDING_CLEANING_SUBMISSION', 'PENDING_CLEANING_COMPLETION', 'PENDING_FURNISHING_SUBMISSION', 'PENDING_FURNISHING_COMPLETION', 'PENDING_GARDENING_SUBMISSION', 'PENDING_GARDENING_COMPLETION', 'PENDING_FINAL_INSPECTION', 'PENDING_TENANT_ASSIGNMENT', 'EARLY_SUBMISSION', 'DONE_ON_TARGET', 'LATE_SUBMISSION');
ALTER TABLE "HouseUnit" ALTER COLUMN "submissionStatus" DROP DEFAULT;
ALTER TABLE "HouseUnit" ALTER COLUMN "submissionStatus" TYPE "HouseSubmissionStatus_new" USING ("submissionStatus"::text::"HouseSubmissionStatus_new");
ALTER TYPE "HouseSubmissionStatus" RENAME TO "HouseSubmissionStatus_old";
ALTER TYPE "HouseSubmissionStatus_new" RENAME TO "HouseSubmissionStatus";
DROP TYPE "HouseSubmissionStatus_old";
ALTER TABLE "HouseUnit" ALTER COLUMN "submissionStatus" SET DEFAULT 'NOT_STARTED';
COMMIT;

-- AlterTable
ALTER TABLE "HouseUnit" ALTER COLUMN "submissionStatus" SET DEFAULT 'NOT_STARTED';
