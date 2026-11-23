export type ApiResult<T = unknown> = {
  isSuccess: boolean;
  message: string;
  errorCode: string | null;
  statusCode: number;
  errors: string[] | null;
  data: T;
};

export type PagedResult<T> = {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};
