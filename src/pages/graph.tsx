import React from "react";
import MonthIntervalSelector from "~/components/graphs/month-selector";
import BaseLayout from "~/components/sidebar/BaseLayout";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { endOfMonth, format, getMonth, isDate, startOfMonth } from "date-fns";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { name: "Jan", units: 4000 },
  { name: "Feb", units: 3000 },
  { name: "Mar", units: 2000 },
  { name: "Apr", units: 2780 },
  { name: "May", units: 1890 },
  { name: "Jun", units: 2390 },
  { name: "Jul", units: 3490 },
];

type ProductivityGraphProps = {
  // ...
};

const ProductivityGraph = (props: ProductivityGraphProps) => {
  // jan 2023 as default start month (because it's the earliest month with the data we have)
  const [startMonth, setStartMonth] = React.useState(
    startOfMonth(new Date("2023-01-01"))
  );
  // inclusive of the end month
  const [endMonth, setEndMonth] = React.useState(endOfMonth(new Date()));

  const handleIntervalChange = (start: Date, end: Date) => {
    setStartMonth(start);
    setEndMonth(end);
    console.log(format(start, "MMM-yyyy"), format(end, "MMM-yyyy"));
  };

  return (
    <Card className="w-fit p-4">
      <CardHeader>
        <CardTitle>Productivity Change Graph</CardTitle>
      </CardHeader>
      <LineChart width={800} height={500} data={data}>
        <XAxis dataKey="name" />
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

      <CardFooter>
        {/* This component deals with (start as startOfMonth) and (end as endOfMonth) to ensure full interval */}
        <MonthIntervalSelector
          startMonth={startOfMonth(new Date("2023-01-01"))}
          endMonth={endOfMonth(new Date())}
          onValueChange={handleIntervalChange}
        />
      </CardFooter>
    </Card>
  );
};

export default function GraphPage() {
  return (
    <BaseLayout
      pageTitle="graph"
      className="flex justify-center items-center p-4">
      <ProductivityGraph />
    </BaseLayout>
  );
}
