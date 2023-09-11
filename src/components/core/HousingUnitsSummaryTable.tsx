import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { cn } from "~/lib/utils";
import { api } from "~/utils/api";
import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";

import MonthIntervalSelector from "../graphs/utils/month-selector";

type HousingUnitsTableProps = {
  monthsBack?: number;
} & React.ComponentProps<typeof Card>;

// TODO: change to the last six months
const HousingUnitsSummaryTableLatest = ({
  className,
  monthsBack = 6,
  ...props
}: HousingUnitsTableProps) => {
  // jan 2023 as default start month (because it's the earliest month with the data we have)
  const [startMonth, setStartMonth] = useState(
    startOfMonth(subMonths(new Date(), monthsBack))
  );
  // inclusive of the end month
  const [endMonth, setEndMonth] = useState(endOfMonth(new Date()));

  const {
    data: housingUnits,
    isLoading,
    isFetching,
    error,
    refetch,
  } = api.housing.getHouseUnitsProcessedDays.useQuery(
    {
      startMonth: startMonth,
      endMonth: endMonth,
    },
    {
      refetchOnMount: false,
      queryKey: [
        "housing.getHouseUnitsProcessedDays",
        { startMonth: startMonth, endMonth: endMonth },
      ],
    }
  );

  const handleIntervalChange = async (start: Date, end: Date) => {
    setStartMonth(start);
    setEndMonth(end);
    await refetch({
      queryKey: [
        "housing.getProductivityStats",
        { startMonth: startMonth, endMonth: endMonth },
      ],
    });
    console.log(format(start, "MMM-yyyy"), format(end, "MMM-yyyy"));
  };

  return (
    <Card className={cn("w-fit h-fit", className)} {...props}>
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>Housing Units Monthly Summary</CardTitle>
          <CardDescription>Data per Month</CardDescription>
        </div>
        <MonthIntervalSelector
          onValueChange={async (startMonth, endMonth) =>
            // eslint-disable-next-line @typescript-eslint/await-thenable
            await handleIntervalChange(startMonth, endMonth)
          }
        />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {/* row with headers of months starting by "Jan-23" up to current month, 
                            you can use date-fns to parse and loop over months till current one */}
              {/* get months from "Jan-23" till current one */}
              {/* loop over months and create table headers */}
              <TableHead className="text-center font-bold border-r">
                #
              </TableHead>
              <TableHead className="text-center font-bold border-r">
                Month-Year
              </TableHead>
              {housingUnits?.stats.map((stat, idx) => (
                <TableHead
                  key={idx}
                  className={cn(
                    "text-center w-32",
                    idx !== housingUnits?.stats.length - 1 && "border-r"
                  )}>
                  {stat.month}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="text-center">
            {/* column for every month, for every property there should be a row */}
            <TableRow className="bg-muted/30">
              <TableHead className="text-center font-bold border-r">
                2
              </TableHead>
              <TableHead className="text-center font-bold border-r">
                Units Submitted To Maintenance
              </TableHead>
              {housingUnits?.stats.map((stat, idx) => (
                <TableCell
                  key={idx}
                  className={cn(
                    "font-bold",
                    idx !== housingUnits?.stats.length - 1 && "border-r"
                  )}>
                  {stat.monthStats.unitsRequiredByHousing.length}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableHead className="text-center font-bold border-r">
                1
              </TableHead>
              <TableHead className="text-center font-bold border-r">
                Units Received From Maintenance
              </TableHead>
              {housingUnits?.stats.map((stat, idx) => (
                <TableCell
                  key={idx}
                  className={cn(
                    "font-bold",
                    idx !== housingUnits?.stats.length - 1 && "border-r"
                  )}>
                  {stat.monthStats.unitsReceivedFromMaintenance.length}
                  <span className="ml-2 text-xs font-semibold">
                    (
                    {Math.round(
                      (stat.monthStats.unitsReceivedFromMaintenance.length /
                        stat.monthStats.unitsRequiredByHousing.length) *
                        1000
                    ) / 10}
                    %)
                  </span>
                </TableCell>
              ))}
            </TableRow>
            <TableRow className="bg-muted/30">
              <TableHead className="text-center font-bold border-r">
                3
              </TableHead>
              <TableHead className="text-center font-bold border-r">
                Units Submitted To Cleaning
              </TableHead>
              {housingUnits?.stats.map((stat, idx) => (
                <TableCell
                  key={idx}
                  className={cn(
                    "font-bold",
                    idx !== housingUnits?.stats.length - 1 && "border-r"
                  )}>
                  {stat.monthStats.unitsSubmittedToCleaning.length}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableHead className="text-center font-bold border-r">
                4
              </TableHead>
              <TableHead className="text-center font-bold border-r">
                Units Submitted To Furniture
              </TableHead>
              {housingUnits?.stats.map((stat, idx) => (
                <TableCell
                  key={idx}
                  className={cn(
                    "font-bold",
                    idx !== housingUnits?.stats.length - 1 && "border-r"
                  )}>
                  {stat.monthStats.unitsSubmittedToFurniture.length}
                </TableCell>
              ))}
            </TableRow>
            <TableRow className="bg-muted/30">
              <TableHead className="text-center font-bold border-r">
                5
              </TableHead>
              <TableHead className="text-center font-bold border-r">
                Units Submitted To Gardening
              </TableHead>
              {housingUnits?.stats.map((stat, idx) => (
                <TableCell
                  key={idx}
                  className={cn(
                    "font-bold",
                    idx !== housingUnits?.stats.length - 1 && "border-r"
                  )}>
                  {stat.monthStats.unitsSubmittedToGardening.length}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableHead className="text-center font-bold border-r">
                6
              </TableHead>
              <TableHead className="text-center font-bold border-r">
                Units Cleaned
              </TableHead>
              {housingUnits?.stats.map((stat, idx) => (
                <TableCell
                  key={idx}
                  className={cn(
                    "font-bold",
                    idx !== housingUnits?.stats.length - 1 && "border-r"
                  )}>
                  {stat.monthStats.unitsCleaned.length}
                </TableCell>
              ))}
            </TableRow>
            <TableRow className="bg-muted/30">
              <TableHead className="text-center font-bold border-r">
                7
              </TableHead>
              <TableHead className="text-center font-bold border-r">
                Units Furnished
              </TableHead>
              {housingUnits?.stats.map((stat, idx) => (
                <TableCell
                  key={idx}
                  className={cn(
                    "font-bold",
                    idx !== housingUnits?.stats.length - 1 && "border-r"
                  )}>
                  {stat.monthStats.unitsFurnished.length}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableHead className="text-center font-bold border-r">
                8
              </TableHead>
              <TableHead className="text-center font-bold border-r">
                Units Gardened
              </TableHead>
              {housingUnits?.stats.map((stat, idx) => (
                <TableCell
                  key={idx}
                  className={cn(
                    "font-bold",
                    idx !== housingUnits?.stats.length - 1 && "border-r"
                  )}>
                  {stat.monthStats.unitsGardened.length}
                </TableCell>
              ))}
            </TableRow>
            <TableRow className="bg-muted/30">
              <TableHead className="text-center font-bold border-r">
                9
              </TableHead>
              <TableHead className="text-center font-bold border-r">
                Units Completed & Inspected
              </TableHead>
              {housingUnits?.stats.map((stat, idx) => (
                <TableCell
                  key={idx}
                  className={cn(
                    "font-bold",
                    idx !== housingUnits?.stats.length - 1 && "border-r"
                  )}>
                  {stat.monthStats.unitsCompleted.length}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableHead className="text-center font-bold border-r">
                10
              </TableHead>
              <TableHead className="text-center font-bold border-r">
                Units Received From Maintenance On Target
              </TableHead>
              {housingUnits?.stats.map((stat, idx) => (
                <TableCell
                  key={idx}
                  className={cn(
                    "font-bold",
                    idx !== housingUnits?.stats.length - 1 && "border-r"
                  )}>
                  {stat.monthStats.unitsReceivedFromMaintenanceOnTarget.length}
                </TableCell>
              ))}
            </TableRow>
            <TableRow className="bg-muted/30">
              <TableHead className="text-center font-bold border-r">
                11
              </TableHead>
              <TableHead className="text-center font-bold border-r">
                Units Received From Maintenance Late
              </TableHead>
              {housingUnits?.stats.map((stat, idx) => (
                <TableCell
                  key={idx}
                  className={cn(
                    "font-bold",
                    idx !== housingUnits?.stats.length - 1 && "border-r"
                  )}>
                  {stat.monthStats.unitsReceivedFromMaintenanceLate.length}
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableHead className="text-center font-bold border-r">
                12
              </TableHead>
              <TableHead className="text-center font-bold border-r">
                Units Received From Maintenance Early
              </TableHead>
              {housingUnits?.stats.map((stat, idx) => (
                <TableCell
                  key={idx}
                  className={cn(
                    "font-bold",
                    idx !== housingUnits?.stats.length - 1 && "border-r"
                  )}>
                  {stat.monthStats.unitsReceivedFromMaintenanceEarly.length}
                </TableCell>
              ))}
            </TableRow>
            {/* <TableRow>
                            <TableHead className="text-center font-bold border-r">
                                13
                            </TableHead>
                            <TableHead className="text-center font-bold border-r">
                                Units Received From Maintenance (Percentage)
                            </TableHead>
                            {housingUnits?.stats.map((stat, idx) => (
                                <TableCell key={idx} className={cn("font-bold",
                                    idx !== housingUnits?.stats.length - 1 && "border-r")}>
                                    {stat.percentageUnitsReceivedFromMaintenance}
                                </TableCell>
                            ))}
                        </TableRow> */}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default HousingUnitsSummaryTableLatest;
