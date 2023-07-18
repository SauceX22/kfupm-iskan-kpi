import {
    PrismaClient,
    type HouseSubmissionStatus,
    type HouseSatisfactionStatus
} from "@prisma/client";
import { join } from 'path';
import { readFileSync } from "fs";

const prisma = new PrismaClient()

async function createData() {
    const data = JSON.parse(readFileSync(join(__dirname, 'seed-data.json'), 'utf8')) as {
        values: {
            unitNumber: number,
            court: string,
            bedrooms: number,
            extended: boolean,
            dateSubmittedToMaintenance: string | null,
            dateReceivedByMaintenance: string | null,
            dateReceivedFromMaintenance: string | null,
            dateRequiredByPersonnel: string | null,
            dateSubmittedToCleaning: string | null,
            dateExpectedCleaningCompletion: string | null,
            dateCompletedCleaning: string | null,
            dateSubmittedToFurnishing: string | null,
            dateExpectedFurnishingCompletion: string | null,
            dateCompletedFurnishing: string | null,
            dateSubmittedToGardening: string | null,
            dateExpectedGardeningCompletion: string | null,
            dateCompletedGardening: string | null,
            dateSubmitedToCommittee: string | null,
            submissionStatus: HouseSubmissionStatus,
            satisfactionStatus: HouseSatisfactionStatus,
        }[]
    };

    await prisma.houseUnit.createMany({
        data: data.values.map((value) => {
            return {
                ...value,
                dateSubmittedToMaintenance: value.dateSubmittedToMaintenance ?
                    new Date(value.dateSubmittedToMaintenance) : null,
                dateReceivedByMaintenance: value.dateReceivedByMaintenance ?
                    new Date(value.dateReceivedByMaintenance) : null,
                dateReceivedFromMaintenance: value.dateReceivedFromMaintenance ?
                    new Date(value.dateReceivedFromMaintenance) : null,
                dateRequiredByPersonnel: value.dateRequiredByPersonnel ?
                    new Date(value.dateRequiredByPersonnel) : null,
                dateSubmittedToCleaning: value.dateSubmittedToCleaning ?
                    new Date(value.dateSubmittedToCleaning) : null,
                dateExpectedCleaningCompletion: value.dateExpectedCleaningCompletion ?
                    new Date(value.dateExpectedCleaningCompletion) : null,
                dateCompletedCleaning: value.dateCompletedCleaning ?
                    new Date(value.dateCompletedCleaning) : null,
                dateSubmittedToFurnishing: value.dateSubmittedToFurnishing ?
                    new Date(value.dateSubmittedToFurnishing) : null,
                dateExpectedFurnishingCompletion: value.dateExpectedFurnishingCompletion ?
                    new Date(value.dateExpectedFurnishingCompletion) : null,
                dateCompletedFurnishing: value.dateCompletedFurnishing ?
                    new Date(value.dateCompletedFurnishing) : null,
                dateSubmittedToGardening: value.dateSubmittedToGardening ?
                    new Date(value.dateSubmittedToGardening) : null,
                dateExpectedGardeningCompletion: value.dateExpectedGardeningCompletion ?
                    new Date(value.dateExpectedGardeningCompletion) : null,
                dateCompletedGardening: value.dateCompletedGardening ?
                    new Date(value.dateCompletedGardening) : null,
                dateSubmitedToCommittee: value.dateSubmitedToCommittee ?
                    new Date(value.dateSubmitedToCommittee) : null,
            }
        }),
    });
}


async function main() {
    const TIMER = 3
    console.warn('----------------------------------------')
    console.warn('ATTENTION: This script will CLEAR the database and re-seed it with test data.')
    console.warn(`Press Ctrl + C to cancel, clearing within ${TIMER} seconds...`)
    console.warn('----------------------------------------')

    // clear the database within TIMER (3) seconds
    await new Promise(resolve => setTimeout(resolve, TIMER * 1000)).then(async () => {
        console.log('Clearing database...')
        // await prisma.user.deleteMany({})
        await prisma.houseUnit.deleteMany({})
    })

    console.log('Seeding database...')

    await createData();
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(() => {
        void prisma.$disconnect()
    })
