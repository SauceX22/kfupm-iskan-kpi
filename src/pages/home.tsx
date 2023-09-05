import { type NextPage } from "next";
import { HousingUnitsTableLatest } from "~/components/core/HousingUnitsTable";
import BaseLayout from "~/components/sidebar/BaseLayout";

import HousingUnitsSummaryTableLatest from "../components/core/HousingUnitsSummaryTable";

const Home: NextPage = (props) => {
  return (
    <BaseLayout pageTitle="Home">
      <HousingUnitsTableLatest />
      <HousingUnitsSummaryTableLatest />
    </BaseLayout>
  );
};

export default Home;
