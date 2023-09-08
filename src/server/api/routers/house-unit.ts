import { HouseSubmissionStatus, type HouseUnit } from "@prisma/client";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { processDays } from "~/utils/kpi-calculator";
import { z } from "zod";

export const houseRouter = createTRPCRouter({
  getHouseUnit: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const unit = await ctx.prisma.houseUnit.findUniqueOrThrow({
        where: {
          id: input.id,
        },
      });
      return unit;
    }),
  getHouseUnits: publicProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        skip: z.number().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const allUnits = await ctx.prisma.houseUnit.findMany({
        take: input.limit,
        skip: input.skip,
      });
      return allUnits;
    }),
  getHouseUnitProcessedDays: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const unit = await ctx.prisma.houseUnit.findUniqueOrThrow({
        where: {
          id: input.id,
        },
      });
      return processDays({ houses: unit });
    }),
  getHouseUnitsProcessedDays: publicProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        skip: z.number().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const allUnits = await ctx.prisma.houseUnit.findMany({
        take: input.limit,
        skip: input.skip,
      });
      return processDays({ houses: allUnits });
    }),
    }),
  importExcelFileData: publicProcedure
    .input(
      z.object({
        houseUnits: z.array(
          z.object({
            unitNumber: z.number(),
            court: z.string(),
            bedrooms: z.number(),
            extended: z.boolean().default(false),
            area: z.number().default(0),

            dateSubmittedToMaintenance: z.date().nullable(),
            dateReceivedByMaintenance: z.date().nullable(),
            dateReceivedFromMaintenance: z.date().nullable(),
            dateRequiredByPersonnel: z.date().nullable(),

            dateSubmittedToCleaning: z.date().nullable(),
            dateExpectedCleaningCompletion: z.date().nullable(),
            dateCompletedCleaning: z.date().nullable(),

            dateSubmittedToFurnishing: z.date().nullable(),
            dateExpectedFurnishingCompletion: z.date().nullable(),
            dateCompletedFurnishing: z.date().nullable(),

            dateSubmittedToGardening: z.date().nullable(),
            dateExpectedGardeningCompletion: z.date().nullable(),
            dateCompletedGardening: z.date().nullable(),

            dateSubmitedToCommittee: z.date().nullable(),
            submissionStatus: z
              .nativeEnum(HouseSubmissionStatus)
              .default("NOT_STARTED"),
            comment: z.string().nullable(),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const allUnits: HouseUnit[] = [];
      for (const unit of input.houseUnits) {
        const resUnit = await ctx.prisma.houseUnit.upsert({
          where: {
            unitNumber: unit.unitNumber,
          },
          update: {
            ...unit,
          },
          create: {
            ...unit,
          },
        });
        allUnits.push(resUnit);
      }
      return allUnits;
    }),
  updateHouseUnit: publicProcedure
    .input(
      z.object({
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
      })
    )
    .mutation(async ({ input, ctx }) => {
      const updatedUnit = await ctx.prisma.houseUnit.update({
        where: {
          id: input.id,
        },
        data: input,
      });
      return processDays({ houses: updatedUnit });
    }),
  deleteHouseUnit: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const deletedUnit = await ctx.prisma.houseUnit.delete({
        where: {
          id: input.id,
        },
      });
      return processDays({ houses: deletedUnit });
    }),
});
