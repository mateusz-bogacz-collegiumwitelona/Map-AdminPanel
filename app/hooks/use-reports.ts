import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getReportDetail, getReports } from "~/api/report.api";
import type { ReportListParams } from "~/types/report";

export const reportKeys = {
  all: ["reports"] as const,
  list: (params: ReportListParams) =>
    [...reportKeys.all, "list", params] as const,
  detail: (id: string) => [...reportKeys.all, "detail", id] as const,
};

export function useReportsList(params: ReportListParams) {
  return useQuery({
    queryKey: reportKeys.list(params),
    queryFn: () => getReports(params),
    placeholderData: keepPreviousData,
  });
}

export function useReportDetail(reportId: string | null) {
  return useQuery({
    queryKey: reportKeys.detail(reportId ?? ""),
    queryFn: () => getReportDetail(reportId!),
    enabled: Boolean(reportId),
  });
}