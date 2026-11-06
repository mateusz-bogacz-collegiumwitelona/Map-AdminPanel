export type ApiResult<T = unknown> = {
  isSuccess: boolean;
  message: string;
  errorCode: string | null;
  statusCode: number;
  errors: string[] | null;
  data: T;
};
