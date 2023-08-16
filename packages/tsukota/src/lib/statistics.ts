import { Transaction } from "@bouzuya/tsukota-models";

// string: YYYY-MM-DD
export function getYearMonths(
  today: string,
  transactions: Transaction[],
): string[] {
  const maxYearMonth = today.slice(0, 7);
  const minYearMonth = transactions[0]?.date.slice(0, 7) ?? maxYearMonth;
  const [maxYearAsString, maxMonthAsString] = maxYearMonth.split("-");
  if (maxYearAsString === undefined || maxMonthAsString === undefined)
    throw new Error("assert maxMonth format is not YYYY-MM");
  const [minYearAsString, minMonthAsString] = minYearMonth.split("-");
  if (minYearAsString === undefined || minMonthAsString === undefined)
    throw new Error("assert minMonth format is not YYYY-MM");
  const months = [];
  let year = parseInt(maxYearAsString, 10);
  let month = parseInt(maxMonthAsString, 10);
  const minYear = parseInt(minYearAsString, 10);
  const minMonth = parseInt(minMonthAsString, 10);
  while (year != minYear || month != minMonth) {
    months.push(
      `${year.toString().padStart(4, "0")}-${month
        .toString()
        .padStart(2, "0")}`,
    );
    if (month == 1) {
      year -= 1;
      month = 12;
    } else {
      month -= 1;
    }
  }
  months.push(
    `${year.toString().padStart(4, "0")}-${month.toString().padStart(2, "0")}`,
  );
  return months;
}

export type MonthlyStatistics = {
  balance: number;
  count: number;
  countIncome: number;
  countOutgo: number;
  countZero: number;
  income: number;
  outgo: number;
  yearMonth: string;
};

export function getStatistics(
  yearMonths: string[],
  transactions: Transaction[],
): MonthlyStatistics[] {
  const defaultRecord: MonthlyStatistics = {
    balance: 0,
    count: 0,
    countIncome: 0,
    countOutgo: 0,
    countZero: 0,
    income: 0,
    outgo: 0,
    yearMonth: "1970-01",
  };
  const records: Record<string, MonthlyStatistics> = {};
  for (const transaction of transactions) {
    const yearMonth = transaction.date.slice(0, 7);
    const amount = parseInt(transaction.amount, 10);
    const record = records[yearMonth] ?? {
      ...defaultRecord,
      yearMonth,
    };
    if (amount === 0) {
      record.countZero += 1;
    } else if (amount > 0) {
      record.income += amount;
      record.countIncome += 1;
    } else {
      record.outgo += amount;
      record.countOutgo += 1;
    }
    record.balance += amount;
    record.count += 1;
    records[yearMonth] = record;
  }
  return yearMonths.map(
    (yearMonth) =>
      records[yearMonth] ?? {
        ...defaultRecord,
        yearMonth,
      },
  );
}
