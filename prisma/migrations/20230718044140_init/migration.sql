-- CreateEnum
CREATE TYPE "HouseSatisfactionStatus" AS ENUM ('NONE', 'SATISFIED', 'PARTIALLY_SATISFIED', 'UNSATISFIED');

-- CreateEnum
CREATE TYPE "HouseSubmissionStatus" AS ENUM ('NOT_STARTED', 'PENDING_MAINTENANCE', 'PENDING_CLEANING', 'PENDING_FURNISHING', 'PENDING_GARDENING', 'PENDING_FINAL_INSPECTION', 'PENDING_TENANT_ASSIGNMENT', 'EARLY_SUBMISSION', 'DONE_ON_TARGET', 'LATE_SUBMISSION');

-- CreateTable
CREATE TABLE "Example" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Example_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "HouseUnit" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "unitNumber" INTEGER NOT NULL,
    "court" TEXT NOT NULL,
    "bedrooms" INTEGER NOT NULL,
    "extended" BOOLEAN NOT NULL DEFAULT false,
    "area" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dateSubmittedToMaintenance" TIMESTAMP(3),
    "dateReceivedByMaintenance" TIMESTAMP(3),
    "dateReceivedFromMaintenance" TIMESTAMP(3),
    "dateRequiredByPersonnel" TIMESTAMP(3),
    "dateSubmittedToCleaning" TIMESTAMP(3),
    "dateExpectedCleaningCompletion" TIMESTAMP(3),
    "dateCompletedCleaning" TIMESTAMP(3),
    "dateSubmittedToFurnishing" TIMESTAMP(3),
    "dateExpectedFurnishingCompletion" TIMESTAMP(3),
    "dateCompletedFurnishing" TIMESTAMP(3),
    "dateSubmittedToGardening" TIMESTAMP(3),
    "dateExpectedGardeningCompletion" TIMESTAMP(3),
    "dateCompletedGardening" TIMESTAMP(3),
    "dateSubmitedToCommittee" TIMESTAMP(3),
    "submissionStatus" "HouseSubmissionStatus" NOT NULL DEFAULT 'PENDING_MAINTENANCE',
    "satisfactionStatus" "HouseSatisfactionStatus" NOT NULL DEFAULT 'NONE',
    "comment" TEXT,

    CONSTRAINT "HouseUnit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "HouseUnit_unitNumber_key" ON "HouseUnit"("unitNumber");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
