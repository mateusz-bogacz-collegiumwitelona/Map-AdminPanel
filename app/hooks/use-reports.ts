import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getReports } from "~/api/ban.api";
import type { ReportListParams } from "~/types/report";

export const reportKeys = {
  all: ["reports"] as const,
  list: (params: ReportListParams) =>
    [...reportKeys.all, "list", params] as const,
};

export function useReportsList(params: ReportListParams) {
  return useQuery({
    queryKey: reportKeys.list(params),
    queryFn: () => getReports(params),
    placeholderData: keepPreviousData,
  });
}
