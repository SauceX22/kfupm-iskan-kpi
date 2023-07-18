import { z } from "zod";

import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure
} from "~/server/api/trpc";


export const houseRouter = createTRPCRouter({
    allHouseUnits: publicProcedure
        .query(({ input, ctx }) => {
            const allUnits = ctx.prisma.houseUnit.findMany({});
            return allUnits;
        }),
    importExcelFileData: publicProcedure
        .input(z.object({
            houseUnits: z.array(z.object({
                unitNumber: z.number(),
                court: z.string(),
                bedrooms: z.number(),
                extended: z.boolean().default(false),
                area: z.number().default(0),

                dateSubmittedToMaintenance: z.date().optional(),
                dateReceivedByMaintenance: z.date().optional(),
                dateReceivedFromMaintenance: z.date().optional(),
                dateRequiredByPersonnel: z.date().optional(),

                dateSubmittedToCleaning: z.date().optional(),
                dateExpectedCleaningCompletion: z.date().optional(),
                dateCompletedCleaning: z.date().optional(),

                dateSubmittedToFurnishing: z.date().optional(),
                dateExpectedFurnishingCompletion: z.date().optional(),
                dateCompletedFurnishing: z.date().optional(),

                dateSubmittedToGardening: z.date().optional(),
                dateExpectedGardeningCompletion: z.date().optional(),
                dateCompletedGardening: z.date().optional(),

                dateSubmitedToCommittee: z.date().optional(),
                comment: z.string().optional(),
            }))
        }))
        .query(({ input, ctx }) => {
            const allUnits = ctx.prisma.houseUnit.createMany({
                data: {
                    ...input.houseUnits
                },
            });
            return allUnits;
        }),
    updateHouseUnit: publicProcedure
        .input(z.object({
            id: z.string(),
            unitNumber: z.number().optional(),
            court: z.string().optional(),
            bedrooms: z.number().optional(),
            extended: z.boolean().default(false).optional(),
            area: z.number().optional(),

            dateSubmittedToMaintenance: z.date().optional(),
            dateReceivedByMaintenance: z.date().optional(),
            dateReceivedFromMaintenance: z.date().optional(),
            dateRequiredByPersonnel: z.date().optional(),

            dateSubmittedToCleaning: z.date().optional(),
            dateExpectedCleaningCompletion: z.date().optional(),
            dateCompletedCleaning: z.date().optional(),

            dateSubmittedToFurnishing: z.date().optional(),
            dateExpectedFurnishingCompletion: z.date().optional(),
            dateCompletedFurnishing: z.date().optional(),

            dateSubmittedToGardening: z.date().optional(),
            dateExpectedGardeningCompletion: z.date().optional(),
            dateCompletedGardening: z.date().optional(),

            dateCheckedAndSubmitedToTenant: z.date().optional(),
            dateTenantSurveyFilled: z.date().optional(),
        }))
        .query(({ input, ctx }) => {
            const updatedUnit = ctx.prisma.houseUnit.update({
                where: {
                    id: input.id
                },
                data: input
            });
            return updatedUnit;
        }),
    deleteHouseUnit: publicProcedure
        .input(z.object({
            id: z.string()
        }))
        .query(({ input, ctx }) => {
            const deletedUnit = ctx.prisma.houseUnit.delete({
                where: {
                    id: input.id
                }
            });
            return deletedUnit;
        }),
    getHouseUnit: publicProcedure
        .input(z.object({
            id: z.string()
        }))
        .query(({ input, ctx }) => {
            const unit = ctx.prisma.houseUnit.findUnique({
                where: {
                    id: input.id
                }
            });
            return unit;
        }),
});
