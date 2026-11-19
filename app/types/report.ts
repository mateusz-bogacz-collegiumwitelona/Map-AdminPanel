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