export type ReportStatus = "Pending" | "Approved" | "Rejected";

export type ReportListItem = {
  id: string;
  reportedUserId: string;
  firstName: string;
  lastName: string;
  reason: string;
  status: ReportStatus;
  createdAt: string;
  resolvedAt: string | null;
};

export type ReportListParams = {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDescending?: boolean;
  searchTerm?: string;
  isShowAll?: boolean;
};

export type ReportDetail = {
  id: string;
  reportedUserId: string;
  reportedFirstName: string;
  reportedLastName: string;
  reporterUserId: string;
  reporterFirstName: string;
  reporterLastName: string;
  reason: string;
  status: ReportStatus;
  resolvedByAdminId: string | null;
  resolvedByAdminFirstName: string | null;
  resolvedByAdminLastName: string | null;
  resolvedAt: string | null;
  createdAt: string;
};

export type ResolveReportPayload = {
  id: string;
  isBanned: boolean;
  duration: string | null;
  reason: string | null;
};
