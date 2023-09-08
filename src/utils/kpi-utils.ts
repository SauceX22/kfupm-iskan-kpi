import {
  compareAsc,
  differenceInDays,
  startOfMonth,
  subMonths,
} from "date-fns";

export const getDayDifference = (date1: Date | null, date2: Date | null) => {
  if (!date1 || !date2) return null;
  return differenceInDays(date1, date2);
};

export const getLastXMonths = (monthsBack: number) =>
  Array.from({ length: (monthsBack = 6) }, (_, i) => {
    const date = subMonths(startOfMonth(new Date()), i);
    // if the date is before "Jan-23", return nothing and
    // filter out any empty values at the end
    if (compareAsc(date, new Date(2023, 0, 1)) === -1) return;
    return date;
  })
    .filter(Date)
    .reverse() as Date[];
