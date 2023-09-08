import { useRouter } from "next/router";
import { HouseUnit } from "@prisma/client";
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
  type ColumnDef,
} from "@tanstack/react-table";
import ImportSheet from "~/components/core/ImportSheet";
import { HouseSubmissionStatusText } from "~/components/HouseUnitStatus";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Separator } from "~/components/ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { cn } from "~/lib/utils";
import { api } from "~/utils/api";
import { exportExcel } from "~/utils/io-excel";
import { format } from "date-fns";
import {
  ArrowRight,
  ArrowUpDown,
  FileDown,
  MoreHorizontal,
} from "lucide-react";

type HousingUnitsTableProps = {
  // Custom props here
} & React.ComponentProps<typeof Card>;

// export const columns: ColumnDef<HouseUnit>[] = [
//   {
//     id: "select",
//     header: ({ table }) => (
//       <Checkbox
//         checked={table.getIsAllPageRowsSelected()}
//         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//         aria-label="Select all"
//       />
//     ),
//     cell: ({ row }) => (
//       <Checkbox
//         checked={row.getIsSelected()}
//         onCheckedChange={(value) => row.toggleSelected(!!value)}
//         aria-label="Select row"
//       />
//     ),
//     enableSorting: false,
//     enableHiding: false,
//   },
// ];

export const HousingUnitsTableLatest = ({
  className,
  ...props
}: HousingUnitsTableProps) => {
  const router = useRouter();

  const {
    data: housingUnits,
    isLoading,
    error,
  } = api.housing.getHouseUnitsProcessedDays.useQuery({});

  // TODO: fix these into a proper error component
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Card className={cn("h-fit w-fit", className)} {...props}>
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <div>
          <CardTitle>Latest Housing Units</CardTitle>
          <CardDescription>Housing units highlights</CardDescription>
        </div>
        <Button variant="link" onClick={() => void router.push("/data")}>
          <ArrowRight className="mr-1 h-4 w-4" /> View All
        </Button>
      </CardHeader>
      <Separator />
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[3rem] text-center">#</TableHead>
              <TableHead className="text-center">House S/N</TableHead>
              <TableHead className="text-center">Court</TableHead>
              <TableHead className="text-center">Last Update</TableHead>
              <TableHead className="text-center">Submission Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {housingUnits.houses
              .slice(0, 5)
              // TODO: ensure this shows the last updated house first
              .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
              .map((house, idx) => (
                <TableRow key={house.id} highlightHover>
                  <TableCell className="w-[50px] text-center">
                    {idx + 1}
                  </TableCell>
                  <TableCell className="text-center">
                    {house.unitNumber}
                  </TableCell>
                  <TableCell className="text-center">{house.court}</TableCell>
                  <TableCell className="text-center">
                    {format(house.updatedAt, "dd/MM/yy | HH:mm")}
                  </TableCell>
                  <TableCell className="text-center">
                    <HouseSubmissionStatusText
                      status={house.submissionStatus}
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
          <TableCaption hidden={housingUnits.houses.length > 0}>
            No data added.
          </TableCaption>
        </Table>
      </CardContent>
    </Card>
  );
};

export const HousingUnitsTable = ({
  className,
  ...props
}: HousingUnitsTableProps) => {
  const {
    data: housingUnits,
    isLoading,
    error,
  } = api.housing.getHouseUnitsProcessedDays.useQuery(
    {},
    {
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  );
  // TODO fix this
  // const table = useReactTable<HouseUnit>({
  //   data: housingUnits?.houses ?? [],
  //   columns,
  //   // onSortingChange: setSorting,
  //   // onColumnFiltersChange: setColumnFilters,
  //   getCoreRowModel: getCoreRowModel(),
  //   getPaginationRowModel: getPaginationRowModel(),
  //   getSortedRowModel: getSortedRowModel(),
  //   getFilteredRowModel: getFilteredRowModel(),
  //   // onColumnVisibilityChange: setColumnVisibility,
  //   // onRowSelectionChange: setRowSelection,
  //   // state: {
  //   //   sorting,
  //   //   columnFilters,
  //   //   columnVisibility,
  //   //   rowSelection,
  //   // },
  // });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Card className={cn("", className)} {...props}>
      <CardHeader className="flex flex-row items-center justify-between py-4">
        {/* create a top bar with buttons for import/export excel files */}
        <div className="space-y-0.5">
          <CardTitle>All Housing Units</CardTitle>
          <CardDescription>Housing units data</CardDescription>
        </div>
        <div className="h-full w-fit space-x-2">
          <Button variant="outline" onClick={() => exportExcel()}>
            <FileDown className="mr-2" /> Export
          </Button>
          <ImportSheet />
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="">
        {/* {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                {column.id}
              </DropdownMenuCheckboxItem>
            );
          })} */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] text-center">#</TableHead>
              <TableHead className="text-center">House S/N</TableHead>
              <TableHead className="text-center">Court</TableHead>
              <TableHead className="text-center">BR</TableHead>
              <TableHead className="text-center">Maintenance Status</TableHead>
              <TableHead className="text-center">Cleaning Status</TableHead>
              <TableHead className="text-center">Furnishing Status</TableHead>
              <TableHead className="text-center">Gardening Status</TableHead>
              <TableHead className="text-center">Final Check Status</TableHead>
              <TableHead className="text-center">Submission Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {housingUnits.houses.map((house, idx) => (
              <TableRow key={house.id} highlightHover>
                <TableCell className="w-[50px] text-center">
                  {idx + 1}
                </TableCell>
                <TableCell className="text-center">
                  {house.unitNumber}
                </TableCell>
                <TableCell className="text-center">{house.court}</TableCell>
                <TableCell className="text-center">{house.bedrooms}</TableCell>
                <TableCell className="text-center">
                  {house.dateReceivedFromMaintenance?.toLocaleDateString() ??
                    "Not Yet"}
                </TableCell>
                <TableCell className="text-center">
                  {house.dateCompletedCleaning?.toLocaleDateString() ??
                    "Not Yet"}
                </TableCell>
                <TableCell className="text-center">
                  {house.dateCompletedFurnishing?.toLocaleDateString() ??
                    "Not Yet"}
                </TableCell>
                <TableCell className="text-center">
                  {house.dateCompletedGardening?.toLocaleDateString() ??
                    "Not Yet"}
                </TableCell>
                <TableCell className="text-center">
                  {house.dateSubmitedToCommittee?.toLocaleDateString() ??
                    "Not Yet"}
                </TableCell>
                <TableCell className="text-center">
                  <HouseSubmissionStatusText status={house.submissionStatus} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableCaption hidden={housingUnits.houses.length > 0}>
            No data added.
          </TableCaption>
        </Table>
      </CardContent>
    </Card>
  );
};
