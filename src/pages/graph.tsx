import React from "react";
import ProductivityGraph from "~/components/graphs/productivity-graph";
import BaseLayout from "~/components/sidebar/BaseLayout";

export default function GraphPage() {
  return (
    <BaseLayout
      pageTitle="graph"
      className="flex justify-center items-center p-4">
      <ProductivityGraph />
    </BaseLayout>
  );
}
