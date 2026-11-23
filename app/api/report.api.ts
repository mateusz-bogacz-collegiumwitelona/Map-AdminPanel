import type {
  ReportDetail,
  ReportListItem,
  ReportListParams,
  ResolveReportPayload,
} from "~/types/report";
import type { ApiResult, PagedResult } from "~/types/api";
import { api } from "~/api/client";

export async function getReports(
  params: ReportListParams,
): Promise<PagedResult<ReportListItem>> {
  const { data } = await api.get<ApiResult<PagedResult<ReportListItem>>>(
    "/api/ban/reports",
    {
      params: {
        pageNumber: params.pageNumber,
        pageSize: params.pageSize,
        sortBy: params.sortBy || undefined,
        sortDescending: params.sortDescending,
        searchTerm: params.searchTerm?.trim() || undefined,
        isShowAll: params.isShowAll,
      },
    },
  );

  return data.data;
}

export async function getReportDetail(id: string): Promise<ReportDetail> {
  const { data } = await api.get<ApiResult<ReportDetail>>(
    `/api/ban/report/${id}`,
  );

  return data.data;
}

export async function resolveReport(
  payload: ResolveReportPayload,
): Promise<void> {
  await api.post<ApiResult>("/api/ban/report/resolve", payload);
}
