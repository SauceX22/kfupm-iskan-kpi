import React from "react";
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
import { compareAsc, format, startOfMonth, subMonths } from "date-fns";

type HousingUnitsTableProps = {
  monthsBack?: number;
} & React.ComponentProps<typeof Card>;

// TODO: change to the last six months
const HousingUnitsSummaryTableLatest = ({
  className,
  monthsBack = 7,
  ...props
}: HousingUnitsTableProps) => {
  const {
    data: housingUnits,
    isLoading,
    error,
  } = api.housing.getHouseUnits.useQuery({});

  const lastXMonths = Array.from({ length: monthsBack }, (_, i) => {
    const date = subMonths(startOfMonth(new Date()), i);
    // if the date is before "Jan-23", return nothing and
    // filter out any empty values at the end
    if (compareAsc(date, new Date(2023, 0, 1)) === -1) return;
    return format(date, "MMM-yy");
  })
    .filter(Boolean)
    .reverse();

  // TODO: fix these into a proper error component
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // if no data, return saying no data
  if (!housingUnits.houses.length) {
    return <div>No data</div>;
  }

  return (
    <Card className={cn("w-fit h-fit", className)} {...props}>
      <CardHeader>
        <CardTitle>Housing Units Monthly Summary</CardTitle>
        <CardDescription>Data per Month</CardDescription>
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
              {housingUnits.stats.map((stat, idx) => (
                <TableHead
                  key={idx}
                  className={cn(
                    "text-center w-32",
                    idx !== housingUnits.stats.length - 1 && "border-r"
                  )}>
                  {stat.month}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="text-center">
            {/* column for every month, for every property there should be a row */}
            <TableRow className="bg-gray-100">
              <TableHead className="text-center font-bold border-r">
                1
              </TableHead>
              <TableHead className="text-center font-bold border-r">
                Units Received From Maintenance
              </TableHead>
              {housingUnits.stats.map((stat, idx) => (
                <TableCell
                  key={idx}
                  className={cn(
                    "font-bold",
                    idx !== housingUnits.stats.length - 1 && "border-r"
                  )}>
                  {stat.monthStats.unitsReceivedFromMaintenance.length}
                  <span className="ml-2 text-xs font-semibold">
                    ({stat.monthStats.unitsReceivedFromMaintenancePercentage}%)
                  </span>
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <TableHead className="text-center font-bold border-r">
                2
              </TableHead>
              <TableHead className="text-center font-bold border-r">
                Units Required By Housing
              </TableHead>
              {housingUnits.stats.map((stat, idx) => (
                <TableCell
                  key={idx}
                  className={cn(
                    "font-bold",
                    idx !== housingUnits.stats.length - 1 && "border-r"
                  )}>
                  {stat.monthStats.unitsRequiredByHousing.length}
                </TableCell>
              ))}
            </TableRow>
            <TableRow className="bg-gray-100">
              <TableHead className="text-center font-bold border-r">
                3
              </TableHead>
              <TableHead className="text-center font-bold border-r">
                Units Submitted To Cleaning
              </TableHead>
              {housingUnits.stats.map((stat, idx) => (
                <TableCell
                  key={idx}
                  className={cn(
                    "font-bold",
                    idx !== housingUnits.stats.length - 1 && "border-r"
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
              {housingUnits.stats.map((stat, idx) => (
                <TableCell
                  key={idx}
                  className={cn(
                    "font-bold",
                    idx !== housingUnits.stats.length - 1 && "border-r"
                  )}>
                  {stat.monthStats.unitsSubmittedToFurniture.length}
                </TableCell>
              ))}
            </TableRow>
            <TableRow className="bg-gray-100">
              <TableHead className="text-center font-bold border-r">
                5
              </TableHead>
              <TableHead className="text-center font-bold border-r">
                Units Submitted To Gardening
              </TableHead>
              {housingUnits.stats.map((stat, idx) => (
                <TableCell
                  key={idx}
                  className={cn(
                    "font-bold",
                    idx !== housingUnits.stats.length - 1 && "border-r"
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
              {housingUnits.stats.map((stat, idx) => (
                <TableCell
                  key={idx}
                  className={cn(
                    "font-bold",
                    idx !== housingUnits.stats.length - 1 && "border-r"
                  )}>
                  {stat.monthStats.unitsCleaned.length}
                </TableCell>
              ))}
            </TableRow>
            <TableRow className="bg-gray-100">
              <TableHead className="text-center font-bold border-r">
                7
              </TableHead>
              <TableHead className="text-center font-bold border-r">
                Units Furnished
              </TableHead>
              {housingUnits.stats.map((stat, idx) => (
                <TableCell
                  key={idx}
                  className={cn(
                    "font-bold",
                    idx !== housingUnits.stats.length - 1 && "border-r"
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
              {housingUnits.stats.map((stat, idx) => (
                <TableCell
                  key={idx}
                  className={cn(
                    "font-bold",
                    idx !== housingUnits.stats.length - 1 && "border-r"
                  )}>
                  {stat.monthStats.unitsGardened.length}
                </TableCell>
              ))}
            </TableRow>
            <TableRow className="bg-gray-100">
              <TableHead className="text-center font-bold border-r">
                9
              </TableHead>
              <TableHead className="text-center font-bold border-r">
                Units Completed & Inspected
              </TableHead>
              {housingUnits.stats.map((stat, idx) => (
                <TableCell
                  key={idx}
                  className={cn(
                    "font-bold",
                    idx !== housingUnits.stats.length - 1 && "border-r"
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
              {housingUnits.stats.map((stat, idx) => (
                <TableCell
                  key={idx}
                  className={cn(
                    "font-bold",
                    idx !== housingUnits.stats.length - 1 && "border-r"
                  )}>
                  {stat.monthStats.unitsReceivedFromMaintenanceOnTarget.length}
                </TableCell>
              ))}
            </TableRow>
            <TableRow className="bg-gray-100">
              <TableHead className="text-center font-bold border-r">
                11
              </TableHead>
              <TableHead className="text-center font-bold border-r">
                Units Received From Maintenance Late
              </TableHead>
              {housingUnits.stats.map((stat, idx) => (
                <TableCell
                  key={idx}
                  className={cn(
                    "font-bold",
                    idx !== housingUnits.stats.length - 1 && "border-r"
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
              {housingUnits.stats.map((stat, idx) => (
                <TableCell
                  key={idx}
                  className={cn(
                    "font-bold",
                    idx !== housingUnits.stats.length - 1 && "border-r"
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
                            {housingUnits.stats.map((stat, idx) => (
                                <TableCell key={idx} className={cn("font-bold",
                                    idx !== housingUnits.stats.length - 1 && "border-r")}>
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
