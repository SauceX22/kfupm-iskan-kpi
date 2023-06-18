import { Check } from "lucide-react";
import { type NextPage } from "next";
import { Button } from "~/components/ui/button/button";
import BaseLayout from "~/components/sidebar/BaseLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card/card";
import { cn } from "~/lib/utils";
import { api } from "~/utils/api";

type Props = {
  // Custom props here
};

const Home: NextPage = (props: Props) => {

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
  const { data: housingUnitsData, isLoading, error } = api.housing.allHousingUnits.useQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Card className={cn("", className)} {...props}>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>You have 3 unread messages.</CardDescription>
      </CardHeader>
      <CardContent className="">
        Something...
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <Check className="mr-2 h-4 w-4" /> Mark all as read
        </Button>
      </CardFooter>
    </Card>
  );
}
