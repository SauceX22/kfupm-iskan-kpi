import { type NextPage } from "next";
import { HousingUnitsTable } from "~/components/home/HousingUnitsTable";
import BaseLayout from "~/components/sidebar/BaseLayout";

const DATA: NextPage = () => {

  return (
    <BaseLayout pageTitle="Housing Data">
      <HousingUnitsTable />
    </BaseLayout>
  );
};

export default DATA;
