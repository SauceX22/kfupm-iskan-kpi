-- CreateTable
CREATE TABLE `Example` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Account` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `refresh_token` VARCHAR(191) NULL,
    `access_token` VARCHAR(191) NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` VARCHAR(191) NULL,
    `session_state` VARCHAR(191) NULL,

    INDEX `Account_userId_idx`(`userId`),
    UNIQUE INDEX `Account_provider_providerAccountId_key`(`provider`, `providerAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `sessionToken` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Session_sessionToken_key`(`sessionToken`),
    INDEX `Session_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `emailVerified` DATETIME(3) NULL,
    `image` VARCHAR(191) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VerificationToken` (
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `VerificationToken_token_key`(`token`),
    UNIQUE INDEX `VerificationToken_identifier_token_key`(`identifier`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HouseUnitStatus` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `unitNumber` INTEGER NOT NULL,
    `court` VARCHAR(191) NOT NULL,
    `bedrooms` INTEGER NOT NULL,
    `extended` BOOLEAN NOT NULL,
    `area` DOUBLE NOT NULL,
    `dateSubmittedToMaintenance` DATETIME(3) NULL,
    `dateReceivedByMaintenance` DATETIME(3) NULL,
    `dateReceivedFromMaintenance` DATETIME(3) NULL,
    `dateRequiredByPersonnel` DATETIME(3) NULL,
    `dateSubmittedToCleaning` DATETIME(3) NULL,
    `dateExpectedCleaningCompletion` DATETIME(3) NULL,
    `dateCompletedCleaning` DATETIME(3) NULL,
    `dateSubmittedToFurnishing` DATETIME(3) NULL,
    `dateExpectedFurnishingCompletion` DATETIME(3) NULL,
    `dateCompletedFurnishing` DATETIME(3) NULL,
    `dateSubmittedToGardening` DATETIME(3) NULL,
    `dateExpectedGardeningCompletion` DATETIME(3) NULL,
    `dateCompletedGardening` DATETIME(3) NULL,
    `dateCheckedAndSubmitedToTenant` DATETIME(3) NULL,
    `dateTenantSurveyFilled` DATETIME(3) NULL,
    `daysToCompleteCleaning` INTEGER NULL,
    `daysToCompleteFurnishing` INTEGER NULL,
    `daysToCompleteGardening` INTEGER NULL,
    `totalDaysToCompleteAll` INTEGER NULL,
    `totalDaysToSubmitToTenant` INTEGER NULL,
    `daysLaterThanPlanned` INTEGER NULL,
    `houseSubmissionStatus` ENUM('EARLY_SUBMISSION', 'DONE_ON_TARGET', 'LATE_SUBMISSION', 'PENDING_MAINTENANCE', 'PENDING_CLEANING', 'PENDING_FURNISHING', 'PENDING_GARDENING', 'PENDING_FINAL_INSPECTION', 'PENDING_TENANT_ASSIGNMENT') NOT NULL DEFAULT 'PENDING_MAINTENANCE',
    `comments` VARCHAR(191) NULL,

    UNIQUE INDEX `HouseUnitStatus_unitNumber_key`(`unitNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
