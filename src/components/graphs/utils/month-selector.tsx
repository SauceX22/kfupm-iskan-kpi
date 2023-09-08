import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { endOfMonth, format, startOfMonth } from "date-fns";

interface MonthIntervalSelectorProps {
  startMonth: Date;
  endMonth: Date;
  onValueChange: (startMonth: Date, endMonth: Date) => Promise<void> | void;
}

const MonthIntervalSelector: React.FC<MonthIntervalSelectorProps> = ({
  startMonth,
  endMonth,
  onValueChange,
}) => {
  const [selectedStartMonth, setSelectedStartMonth] = React.useState(
    startOfMonth(new Date("2023-01-01"))
  );
  const [selectedEndMonth, setSelectedEndMonth] = React.useState(
    endOfMonth(new Date())
  );

  const handleStartMonthChange = async (value: string) => {
    const monthStart = startOfMonth(new Date(value));
    setSelectedStartMonth(monthStart);
    await onValueChange(monthStart, selectedEndMonth);
  };

  const handleEndMonthChange = async (value: string) => {
    const monthEnd = endOfMonth(new Date(value));
    setSelectedEndMonth(monthEnd);
    await onValueChange(selectedStartMonth, monthEnd);
  };

  return (
    <div className="flex flex-row w-full justify-between gap-4">
      <Select
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onValueChange={async (value) => await handleStartMonthChange(value)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a start month" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Start Month</SelectLabel>
            {/* cycle through all months from end month back to jan using date-fns lib */}
            {Array.from(
              { length: endMonth.getMonth() - startMonth.getMonth() + 1 },
              (_, i) => {
                const date = endOfMonth(
                  new Date(endMonth.getFullYear(), endMonth.getMonth() - i, 1)
                );
                const dateStr = format(date, "MMM-yyyy");
                return (
                  <SelectItem
                    key={dateStr}
                    value={dateStr}
                    disabled={date > selectedEndMonth}>
                    {dateStr}
                  </SelectItem>
                );
              }
            ).reverse()}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onValueChange={async (value) => await handleEndMonthChange(value)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an end month" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>End Month</SelectLabel>
            {/* cycle through all months from end month back to jan using date-fns lib */}
            {Array.from(
              { length: endMonth.getMonth() - startMonth.getMonth() + 1 },
              (_, i) => {
                const date = endOfMonth(
                  new Date(endMonth.getFullYear(), endMonth.getMonth() - i, 1)
                );
                const dateStr = format(date, "MMM-yyyy");
                return (
                  <SelectItem
                    key={dateStr}
                    value={dateStr}
                    disabled={date < selectedStartMonth}>
                    {dateStr}
                  </SelectItem>
                );
              }
            ).reverse()}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default MonthIntervalSelector;
