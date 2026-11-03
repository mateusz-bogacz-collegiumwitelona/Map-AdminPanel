import { isAxiosError } from "axios";
import type { ApiResult } from "~/types/api";

export class AuthError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly errors: string[] = [],
  ) {
    super(message);
  }
}

export const accessDeniedError = () =>
  new AuthError(
    "ACCESS_DENIED",
    "Access denied. This panel is available to administrators only.",
  );

export function toAuthError(error: unknown) {
  const result = isAxiosError<ApiResult>(error)
    ? error.response?.data
    : undefined;
  return result?.errorCode
    ? new AuthError(result.errorCode, result.message, result.errors ?? [])
    : new AuthError(
        "NETWORK_ERROR",
        "Unable to connect to the server. Please try again.",
      );
}
