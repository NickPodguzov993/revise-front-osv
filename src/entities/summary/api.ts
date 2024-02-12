import { getMonthDate } from "@/shared/utils";

export function summaryUrl(date: Date, page: number) {
  return `/api/${getMonthDate(date)}/data?page=${page}&size=5`;
}
