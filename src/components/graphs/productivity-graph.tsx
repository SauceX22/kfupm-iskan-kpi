import React, { useState } from "react";
import MonthIntervalSelector from "~/components/graphs/utils/month-selector";
import { Button } from "~/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { api } from "~/utils/api";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { Loader2, RefreshCwIcon } from "lucide-react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ProductivityGraphProps = {
  // ...
};

const ProductivityGraph = ({}: ProductivityGraphProps) => {
  // jan 2023 as default start month (because it's the earliest month with the data we have)
  const [startMonth, setStartMonth] = useState(
    startOfMonth(new Date("2023-01-01"))
  );
  // inclusive of the end month
  const [endMonth, setEndMonth] = useState(endOfMonth(new Date()));

  const {
    data: unitStats,
    refetch,
    isFetching,
  } = api.housing.getProductivityStats.useQuery(
    {
      startMonth: startMonth,
      endMonth: endMonth,
    },
    {
      refetchOnMount: false,
      queryKey: [
        "housing.getProductivityStats",
        { startMonth: startMonth, endMonth: endMonth },
      ],
    }
  );

  const handleIntervalChange = async (start: Date, end: Date) => {
    setStartMonth(start);
    setEndMonth(end);
    await refetch({
      queryKey: [
        "housing.getProductivityStats",
        { startMonth: startMonth, endMonth: endMonth },
      ],
    });
    console.log(format(start, "MMM-yyyy"), format(end, "MMM-yyyy"));
  };

  return (
    <Card className="w-fit p-4">
      <CardHeader>
        <CardTitle>Productivity Change Graph</CardTitle>
      </CardHeader>
      <LineChart
        width={800}
        height={500}
        data={unitStats?.stats.map((stat) => ({
          month: stat.month,
          units: stat.monthStats.unitsCompleted.length,
        }))}>
        <XAxis dataKey="month" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="units"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>

      <CardFooter className="w-full flex flex-col gap-4">
        {/* This component deals with (start as startOfMonth) and (end as endOfMonth) to ensure full interval */}
        <MonthIntervalSelector
          startMonth={startOfMonth(new Date("2023-01-01"))}
          endMonth={endOfMonth(new Date())}
          onValueChange={async (startMonth, endMonth) =>
            // eslint-disable-next-line @typescript-eslint/await-thenable
            await handleIntervalChange(startMonth, endMonth)
          }
        />
      </CardFooter>
    </Card>
  );
};

export default ProductivityGraph;
