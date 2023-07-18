import { type NextPage } from "next";
import { HousingUnitsTable } from "~/components/home/HousingUnitsTable";
import BaseLayout from "~/components/sidebar/BaseLayout";

const DATA: NextPage = () => {

  return (
    <BaseLayout pageTitle="all-data-page">
      <HousingUnitsTable />
    </BaseLayout>
  );
};

export default DATA;
