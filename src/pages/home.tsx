import { type NextPage } from "next";
import { HousingUnitsTableLatest } from "~/components/core/HousingUnitsTable";
import BaseLayout from "~/components/sidebar/BaseLayout";


const Home: NextPage = (props) => {

  return (
    <BaseLayout pageTitle="Home">
      <HousingUnitsTableLatest />
    </BaseLayout>
  );
};

export default Home;

