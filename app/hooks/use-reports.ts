import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getReportDetail, getReports, resolveReport } from "~/api/report.api";
import type { ReportListParams, ResolveReportPayload } from "~/types/report";

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

export function useResolveReportMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ResolveReportPayload) => resolveReport(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: reportKeys.all });
      queryClient.invalidateQueries({
        queryKey: reportKeys.detail(variables.id),
      });
    },
  });
}