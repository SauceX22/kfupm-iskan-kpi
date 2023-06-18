import { z } from "zod";

import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure
} from "~/server/api/trpc";


export const housingRouter = createTRPCRouter({
    allHousingUnits: publicProcedure
        .query(({ input, ctx }) => {
            const allUnits = ctx.prisma.houseUnitStatus.findMany({});
            return allUnits;
        })
});
