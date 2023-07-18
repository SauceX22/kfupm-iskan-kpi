import { type NextPage } from "next";
import BaseLayout from "~/components/sidebar/BaseLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "~/components/ui/card/card";
import { cn } from "~/lib/utils";
import { api } from "~/utils/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "~/components/ui/table/table";
import { format } from "date-fns";
import { HouseSubmissionStatusText } from "~/components/HouseUnitStatus";


const Home: NextPage = (props) => {

  return (
    <BaseLayout pageTitle="Home">
      <HousingUnitsLatest />
    </BaseLayout>
  );
};

export default Home;

type HousingUnitsTableProps = {
  // Custom props here
} & React.ComponentProps<typeof Card>;

const HousingUnitsLatest = ({ className, ...props }: HousingUnitsTableProps) => {
  const { data: housingUnits, isLoading, error } = api.housing.getHouseUnits.useQuery({});

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Card className={cn("w-fit", className)} {...props}>
      <CardHeader>
        <CardTitle>Latest Housing Units</CardTitle>
        <CardDescription>Housing units highlights</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-[3rem]">#</TableHead>
              <TableHead className="text-center">House S/N</TableHead>
              <TableHead className="text-center">Court</TableHead>
              <TableHead className="text-center">Last Update</TableHead>
              <TableHead className="text-center">Submission Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {housingUnits
              .slice(0, 5)
              // TODO ensure this shows the last updated house first
              .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
              .map((house, idx) => (
                <TableRow key={house.id} highlightHover>
                  <TableCell className="text-center w-[50px]">{idx + 1}</TableCell>
                  <TableCell className="text-center">{house.unitNumber}</TableCell>
                  <TableCell className="text-center">{house.court}</TableCell>
                  <TableCell className="text-center">{format(house.updatedAt, "dd/MM/yy | HH:mm")}</TableCell>
                  <TableCell className="text-center">
                    <HouseSubmissionStatusText status={house.submissionStatus} />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
