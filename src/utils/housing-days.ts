import {
    type HouseUnit
} from "@prisma/client"
import { differenceInDays } from "date-fns";

const getDayDifference = (date1: Date | null, date2: Date | null) => {
    if (!date1 || !date2) return null;
    return differenceInDays(date1, date2);
}

export const processDays = (houses: HouseUnit[] | HouseUnit) => {
    // ensure houses is actually an array, or convert
    houses = Array.isArray(houses) ? houses : [houses];
    const processingDays = houses.map((house) => {
        return {
            ...house,
            totalDaysToCompleteHousingDuties: getDayDifference(house.dateSubmittedToCleaning, house.dateCompletedGardening),
            totalDaysToSubmitToCommittee: getDayDifference(house.dateSubmittedToCleaning, house.dateSubmitedToCommittee),
            totalDaysInMaintenance: getDayDifference(house.dateReceivedFromMaintenance, house.dateReceivedByMaintenance),
            daysHouseReceivedLaterThanPlanned: getDayDifference(new Date(), house.dateRequiredByPersonnel),
            totalDaysToPrepareTheHouse: getDayDifference(house.dateReceivedByMaintenance, house.dateSubmitedToCommittee),
            maintenanceHouseSubmissionStatus: (() => {
                const dayDiff = getDayDifference(new Date(), house.dateRequiredByPersonnel);
                if (!house.dateReceivedFromMaintenance || !dayDiff) return "PENDING_MAINTENANCE";
                else if (dayDiff === 1) return "DONE_ON_TARGET";
                else if (dayDiff > 1) return "LATE_SUBMISSION";
                else if (dayDiff < 1) return "EARLY_SUBMISSION";
                else return "PENDING_MAINTENANCE";
            })(),
        }
    });

    return processingDays;
}

