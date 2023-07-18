import { z } from "zod";
import { processDays } from '~/utils/housing-days';

import {
    createTRPCRouter,
    publicProcedure,
} from "~/server/api/trpc";


export const houseRouter = createTRPCRouter({
    getHouseUnit: publicProcedure
        .input(z.object({
            id: z.string()
        }))
        .query(async ({ input, ctx }) => {
            const unit = await ctx.prisma.houseUnit.findUniqueOrThrow({
                where: {
                    id: input.id
                }
            });
            return processDays(unit);
        }),
    getHouseUnits: publicProcedure
        .input(z.object({
            limit: z.number().optional(),
            skip: z.number().optional(),
        }))
        .query(async ({ input, ctx }) => {
            const allUnits = await ctx.prisma.houseUnit.findMany({
                take: input.limit,
                skip: input.skip
            });
            return processDays(allUnits);
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
        .mutation(async ({ input, ctx }) => {
            const allUnits = await ctx.prisma.houseUnit.createMany({
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
        .mutation(async ({ input, ctx }) => {
            const updatedUnit = await ctx.prisma.houseUnit.update({
                where: {
                    id: input.id
                },
                data: input
            });
            return processDays(updatedUnit);
        }),
    deleteHouseUnit: publicProcedure
        .input(z.object({
            id: z.string()
        }))
        .mutation(async ({ input, ctx }) => {
            const deletedUnit = await ctx.prisma.houseUnit.delete({
                where: {
                    id: input.id
                }
            });
            return processDays(deletedUnit);
        }),
});
