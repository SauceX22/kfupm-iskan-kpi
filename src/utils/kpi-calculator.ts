import { type HouseUnit } from "@prisma/client";
import { getDayDifference, getLastXMonths } from "~/utils/kpi-utils";
import {
  compareAsc,
  eachMonthOfInterval,
  endOfMonth,
  format,
  Interval,
  isWithinInterval,
  startOfMonth,
  subMonths,
} from "date-fns";

/**
 * @description
 * This function takes in a house unit or an array of house units
 * and returns an object containing the house unit(s) and the stats
 * of the house unit(s) for a period of months.
 *
 * **IMPORTANT:** If no period is specified, the method will default to the last 6 months.
 * Otherwise you can specify a start and end month or a number of months back.
 *
 * @param houses - a house unit or an array of house units
 * @param lastXMonths - (defaults to 6) the number of months to go back from the current month
 * @param startMonth - the start month of the period to calculate the stats for
 * @param endMonth - the end month of the period to calculate the stats for
 * @returns an object containing the house unit(s) and the stats of the house unit(s) for a period of months
 */
export const processDays = ({
  houses,
  lastXMonths = 6,
  ...periodProps
}: {
  houses: HouseUnit[] | HouseUnit;
  lastXMonths?: number;
  startMonth?: Date;
  endMonth?: Date;
}) => {
  // ensure houses is actually an array, or convert
  houses = Array.isArray(houses) ? houses : [houses];
  const processingDays = houses.map((house) => {
    return {
      ...house,
      totalDaysToCompleteHousingDuties: getDayDifference(
        house.dateSubmittedToCleaning,
        house.dateCompletedGardening
      ),
      totalDaysToSubmitToCommittee: getDayDifference(
        house.dateSubmittedToCleaning,
        house.dateSubmitedToCommittee
      ),
      totalDaysInMaintenance: getDayDifference(
        house.dateReceivedFromMaintenance,
        house.dateReceivedByMaintenance
      ),
      daysHouseReceivedLaterThanPlanned: getDayDifference(
        new Date(),
        house.dateRequiredByPersonnel
      ),
      totalDaysToPrepareTheHouse: getDayDifference(
        house.dateReceivedByMaintenance,
        house.dateSubmitedToCommittee
      ),
      maintenanceHouseSubmissionStatus: (() => {
        const dayDiff = getDayDifference(
          new Date(),
          house.dateRequiredByPersonnel
        );
        if (!house.dateReceivedFromMaintenance || !dayDiff)
          return "PENDING_MAINTENANCE";
        else if (dayDiff === 1) return "DONE_ON_TARGET";
        else if (dayDiff > 1) return "LATE_SUBMISSION";
        else if (dayDiff < 1) return "EARLY_SUBMISSION";
        else return "PENDING_MAINTENANCE";
      })(),
    };
  });
  // dataMonthStats
  // group 1
  // #01 "Total Units received from Maintenance", // In Date Received from Maintenance, count all units with a given month (compare if within month only)
  // #02 "Total Units required by Housing", (check)
  // group 2
  // #03 "Total Units submitted to Cleaning", // similar to above
  // #04 "Total Units submitted to Furniture", // similar to above
  // #05 "Total Houses submitted to Gardening",
  // group 3
  // #06 "Total Units Cleaned",
  // #07 "Total Units Furnished",
  // #08 "Total Units Gardened",
  // #09 "Total Units Completed and Inspected by Housing",
  // group 4
  // #10 "Total Units Received from Maintenance per target days",
  // #11 "Total Units Recieved Late From Maintenance",
  // #12 "Total Units Recieved Early From Maintenance",
  // group 5
  // #13 "% Units Recieved from Maintenance", (#1 / #2)
  // #14 "% Units Completed by Housing", (#9 / #2)
  // group 6
  // #15 "% Units Received from Maintenance per target days", (#10 / #1)
  // #16 "% Units Received Late from Maintenance", (#11 / #1)
  // #17 "% Units Recieved Early from Maintenance", (#12 / #1)
  // group 7
  // #18 "Avg Total Days Houses Received Maintenance", (check)
  // #19 "Avg Total late Days Houses Received from maintenance", (avg of units received from maintenance for that month)
  // #20 "Avg Total Days to Prepare a House", (avg of (units submitted to committee?) units completed by gardening for that month)
  console.log("processingDays");
  const months =
    // given a start and end month, get all the months in between
    eachMonthOfInterval({
      // use lastXMonths if no start and end month are specified
      start:
        periodProps.startMonth ??
        startOfMonth(subMonths(new Date(), lastXMonths)),
      end: periodProps.endMonth ?? endOfMonth(new Date()),
    });

  const dataMonthStats = months.map((date) => {
    const monthStartEndInterval = {
      start: startOfMonth(date),
      end: endOfMonth(date),
    };
    // group 4
    return {
      month: format(date, "MMM-yy"),
      monthStats: {
        // group 1: n units received from maintenance
        unitsReceivedFromMaintenance: processingDays.filter(
          (house) =>
            house.dateReceivedFromMaintenance &&
            isWithinInterval(
              house.dateReceivedFromMaintenance,
              monthStartEndInterval
            )
        ),
        unitsRequiredByHousing:
          // this is the unitsRequiredOfThisMonth + unitsLeftOfPreviousMonthsThatHaveNotBeenCompleted
          // unitsRequiredOfThisMonth = unitsRequiredByHousing
          processingDays.filter((house) => {
            const requiredThisMonth =
              house.dateRequiredByPersonnel &&
              isWithinInterval(
                house.dateRequiredByPersonnel,
                monthStartEndInterval
              );

            // a unit that is left from previous months is a unit that satisfies all the following conditions:
            // 1- its date required by personnel is before the current month
            // 2- its date received from maintenance is not before the current month or is null
            const unitsLeftOfPreviousMonthsThatHaveNotBeenCompleted =
              house.dateRequiredByPersonnel &&
              compareAsc(
                house.dateRequiredByPersonnel,
                monthStartEndInterval.start
              ) === -1 &&
              (!house.dateReceivedFromMaintenance ||
                compareAsc(
                  house.dateReceivedFromMaintenance,
                  monthStartEndInterval.start
                ) === 1);

            return [
              requiredThisMonth,
              unitsLeftOfPreviousMonthsThatHaveNotBeenCompleted,
            ].some((bool) => bool);
          }),
        // group 2: n units submitted to cleaning, furniture, gardening
        unitsSubmittedToCleaning: processingDays.filter(
          (house) =>
            house.dateSubmittedToCleaning &&
            isWithinInterval(
              house.dateSubmittedToCleaning,
              monthStartEndInterval
            )
        ),
        unitsSubmittedToFurniture: processingDays.filter(
          (house) =>
            house.dateSubmittedToFurnishing &&
            isWithinInterval(
              house.dateSubmittedToFurnishing,
              monthStartEndInterval
            )
        ),
        unitsSubmittedToGardening: processingDays.filter(
          (house) =>
            house.dateSubmittedToGardening &&
            isWithinInterval(
              house.dateSubmittedToGardening,
              monthStartEndInterval
            )
        ),
        // group 3: n units received cleaned, furnished, gardened, completed
        unitsCleaned: processingDays.filter(
          (house) =>
            house.dateCompletedCleaning &&
            isWithinInterval(house.dateCompletedCleaning, monthStartEndInterval)
        ),
        unitsFurnished: processingDays.filter(
          (house) =>
            house.dateCompletedFurnishing &&
            isWithinInterval(
              house.dateCompletedFurnishing,
              monthStartEndInterval
            )
        ),
        unitsGardened: processingDays.filter(
          (house) =>
            house.dateCompletedGardening &&
            isWithinInterval(
              house.dateCompletedGardening,
              monthStartEndInterval
            )
        ),
        unitsCompleted: processingDays.filter(
          (house) =>
            house.dateSubmitedToCommittee &&
            isWithinInterval(
              house.dateSubmitedToCommittee,
              monthStartEndInterval
            )
        ),
        // group 4: (two checks, Check if:
        //  1- filter by received from maintenance WITHIN 1 DAY of expected
        //  2- filter by month matches the current month of loop)
        // totals units received from maintenance per target days
        unitsReceivedFromMaintenanceOnTarget: processingDays.filter((house) => {
          const daysDiff = getDayDifference(
            house.dateReceivedFromMaintenance,
            house.dateRequiredByPersonnel
          );
          // diff is 0, +1, -1, calc using math.abs
          return (
            house.dateReceivedFromMaintenance &&
            daysDiff &&
            Math.abs(daysDiff) <= 1 &&
            isWithinInterval(
              house.dateReceivedFromMaintenance,
              monthStartEndInterval
            )
          );
        }),
        unitsReceivedFromMaintenanceLate: processingDays.filter((house) => {
          const daysDiff = getDayDifference(
            house.dateReceivedFromMaintenance,
            house.dateRequiredByPersonnel
          );
          // anything greater than the on target interval
          return (
            house.dateReceivedFromMaintenance &&
            daysDiff &&
            daysDiff > 1 &&
            isWithinInterval(
              house.dateReceivedFromMaintenance,
              monthStartEndInterval
            )
          );
        }),
        unitsReceivedFromMaintenanceEarly: processingDays.filter((house) => {
          const daysDiff = getDayDifference(
            house.dateReceivedFromMaintenance,
            house.dateRequiredByPersonnel
          );
          return (
            house.dateReceivedFromMaintenance &&
            daysDiff &&
            daysDiff < -1 &&
            isWithinInterval(
              house.dateReceivedFromMaintenance,
              monthStartEndInterval
            )
          );
        }),
        // group 5: percentages units
        unitsReceivedFromMaintenancePercentage: (() => {
          const unitsReceivedFromMaintenance = processingDays.filter(
            (house) =>
              house.dateReceivedFromMaintenance &&
              isWithinInterval(
                house.dateReceivedFromMaintenance,
                monthStartEndInterval
              )
          );
          const unitsRequiredByHousing = processingDays.filter((house) => {
            // FIXME n units required by housing this one is wrong
            return (
              house.dateRequiredByPersonnel &&
              isWithinInterval(
                house.dateRequiredByPersonnel,
                monthStartEndInterval
              )
            );
          });
          return (
            Math.round(
              (unitsReceivedFromMaintenance.length /
                unitsRequiredByHousing.length) *
                10
            ) / 10
          );
        })(),
        unitsCompletedPercentage: (() => {
          const unitsCompleted = processingDays.filter(
            (house) =>
              house.dateSubmitedToCommittee &&
              isWithinInterval(
                house.dateSubmitedToCommittee,
                monthStartEndInterval
              )
          );
          const unitsRequiredByHousing = processingDays.filter((house) => {
            // FIXME n units required by housing this one is wrong
            return (
              house.dateRequiredByPersonnel &&
              isWithinInterval(
                house.dateRequiredByPersonnel,
                monthStartEndInterval
              )
            );
          });
          return (
            Math.round(
              (unitsCompleted.length / unitsRequiredByHousing.length) * 10
            ) / 10
          );
        })(),
        // group 6: percentages units
        unitsReceivedFromMaintenanceOnTargetPercentage: (() => {
          const unitsReceivedFromMaintenanceOnTarget = processingDays.filter(
            (house) => {
              const daysDiff = getDayDifference(
                house.dateReceivedFromMaintenance,
                house.dateRequiredByPersonnel
              );
              // diff is 0, +1, -1, calc using math.abs
              return (
                house.dateReceivedFromMaintenance &&
                daysDiff &&
                Math.abs(daysDiff) <= 1 &&
                isWithinInterval(
                  house.dateReceivedFromMaintenance,
                  monthStartEndInterval
                )
              );
            }
          );
          const unitsReceivedFromMaintenance = processingDays.filter(
            (house) =>
              house.dateReceivedFromMaintenance &&
              isWithinInterval(
                house.dateReceivedFromMaintenance,
                monthStartEndInterval
              )
          );
          return (
            unitsReceivedFromMaintenanceOnTarget.length /
            unitsReceivedFromMaintenance.length
          );
        })(),
        unitsReceivedFromMaintenanceLatePercentage: (() => {
          const unitsReceivedFromMaintenanceLate = processingDays.filter(
            (house) => {
              const daysDiff = getDayDifference(
                house.dateReceivedFromMaintenance,
                house.dateRequiredByPersonnel
              );
              // anything greater than the on target interval
              return (
                house.dateReceivedFromMaintenance &&
                daysDiff &&
                daysDiff > 1 &&
                isWithinInterval(
                  house.dateReceivedFromMaintenance,
                  monthStartEndInterval
                )
              );
            }
          );
          const unitsReceivedFromMaintenance = processingDays.filter(
            (house) =>
              house.dateReceivedFromMaintenance &&
              isWithinInterval(
                house.dateReceivedFromMaintenance,
                monthStartEndInterval
              )
          );
          return (
            unitsReceivedFromMaintenanceLate.length /
            unitsReceivedFromMaintenance.length
          );
        })(),
        unitsReceivedFromMaintenanceEarlyPercentage: (() => {
          const unitsReceivedFromMaintenanceEarly = processingDays.filter(
            (house) => {
              const daysDiff = getDayDifference(
                house.dateReceivedFromMaintenance,
                house.dateRequiredByPersonnel
              );
              return (
                house.dateReceivedFromMaintenance &&
                daysDiff &&
                daysDiff < -1 &&
                isWithinInterval(
                  house.dateReceivedFromMaintenance,
                  monthStartEndInterval
                )
              );
            }
          );
          const unitsReceivedFromMaintenance = processingDays.filter(
            (house) =>
              house.dateReceivedFromMaintenance &&
              isWithinInterval(
                house.dateReceivedFromMaintenance,
                monthStartEndInterval
              )
          );
          return (
            unitsReceivedFromMaintenanceEarly.length /
            unitsReceivedFromMaintenance.length
          );
        })(),
        // group 7: averages units (check no idea)
        // avgTotalDaysHousesReceivedMaintenance: (() => {
        //     const unitsReceivedFromMaintenance = processingDays.filter((house) => house.dateReceivedFromMaintenance &&
        //         isWithinInterval(house.dateReceivedFromMaintenance, monthStartEndInterval));
        //     const totalDays = unitsReceivedFromMaintenance.reduce((acc, curr) => {
        //         const daysDiff = getDayDifference(curr.dateReceivedFromMaintenance, curr.dateRequiredByPersonnel);
        //         return acc + daysDiff;
        //     }, 0);
        //     return totalDays / unitsReceivedFromMaintenance.length;
        // })(),
        avgTotalLateDaysHousesReceivedMaintenance: (() => {
          const unitsReceivedFromMaintenanceLate = processingDays.filter(
            (house) => {
              const daysDiff = getDayDifference(
                house.dateReceivedFromMaintenance,
                house.dateRequiredByPersonnel
              );
              // anything greater than the on target interval
              return (
                house.dateReceivedFromMaintenance &&
                daysDiff &&
                daysDiff > 1 &&
                isWithinInterval(
                  house.dateReceivedFromMaintenance,
                  monthStartEndInterval
                )
              );
            }
          );
          const totalLateDays = unitsReceivedFromMaintenanceLate.reduce(
            (acc, curr) => {
              const daysDiff = getDayDifference(
                curr.dateReceivedFromMaintenance,
                curr.dateRequiredByPersonnel
              );
              if (!daysDiff) return acc;
              return acc + daysDiff;
            },
            0
          );
          return totalLateDays / unitsReceivedFromMaintenanceLate.length;
        })(),
        avgTotalDaysToPrepareAHouse: (() => {
          const unitsCompleted = processingDays.filter(
            (house) =>
              house.dateSubmitedToCommittee &&
              isWithinInterval(
                house.dateSubmitedToCommittee,
                monthStartEndInterval
              )
          );
          const totalDays = unitsCompleted.reduce((acc, curr) => {
            const daysDiff = getDayDifference(
              curr.dateReceivedByMaintenance,
              curr.dateSubmitedToCommittee
            );
            if (!daysDiff) return acc;
            return acc + daysDiff;
          }, 0);
          return totalDays / unitsCompleted.length;
        })(),
      },
    };
  });

  // invert/group table data, so that it's easier to render
  // instead of an array of months, we want an array of stats
  // with each stat containing the months

  return {
    houses: processingDays,
    stats: dataMonthStats,
  };
};
