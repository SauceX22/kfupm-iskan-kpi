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
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "~/components/ui/table/table";

type Props = {
  // Custom props here
};

const Home: NextPage = (props) => {

  return (
    <BaseLayout pageTitle="home-page">
      <AllHousingUnits />
    </BaseLayout>
  );
};

export default Home;

type HousingUnitsTableProps = {
  // Custom props here
} & React.ComponentProps<typeof Card>;

const AllHousingUnits = ({ className, ...props }: HousingUnitsTableProps) => {
  const { data: housingUnits, isLoading, error } = api.housing.allHousingUnits.useQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Card className={cn("", className)} {...props}>
      <CardHeader>
        <CardTitle>All Housing Units</CardTitle>
        <CardDescription>Housing units data</CardDescription>
      </CardHeader>
      <CardContent className="">
        <Table>
          <TableCaption>An overview of housing units.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-[50px]">#</TableHead>
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
            {housingUnits.map((house, idx) => (
              <TableRow key={house.id}>
                <TableHead className="text-center w-[50px]">{idx + 1}</TableHead>
                <TableHead className="text-center">{house.unitNumber}</TableHead>
                <TableHead className="text-center">{house.court}</TableHead>
                <TableHead className="text-center">{house.bedrooms}</TableHead>
                <TableHead className="text-center">{house.dateReceivedFromMaintenance?.toLocaleDateString() ?? "Not Yet"}</TableHead>
                <TableHead className="text-center">{house.dateCompletedCleaning?.toLocaleDateString() ?? "Not Yet"}</TableHead>
                <TableHead className="text-center">{house.dateCompletedFurnishing?.toLocaleDateString() ?? "Not Yet"}</TableHead>
                <TableHead className="text-center">{house.dateCompletedGardening?.toLocaleDateString() ?? "Not Yet"}</TableHead>
                <TableHead className="text-center">{house.dateCheckedAndSubmitedToTenant?.toLocaleDateString() ?? "Not Yet"}</TableHead>
                <TableHead className="text-center">{house.submissionStatus}</TableHead>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
