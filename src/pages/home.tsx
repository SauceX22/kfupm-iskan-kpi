import { type NextPage } from "next";
import { HousingUnitsTableLatest } from "~/components/core/HousingUnitsTable";
import BaseLayout from "~/components/sidebar/BaseLayout";

import HousingUnitsSummaryTableLatest from "../components/core/HousingUnitsSummaryTable";

const Home: NextPage = (props) => {
  return (
    <BaseLayout pageTitle="Home" className="flex flex-col gap-4">
      <HousingUnitsTableLatest />
      <HousingUnitsSummaryTableLatest />
    </BaseLayout>
  );
};

export default Home;
