import { isAxiosError } from "axios";
import { translateErrorCode } from "~/lib/error-translator";
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
    translateErrorCode("ACCESS_DENIED") ??
      "Brak dostępu. Ten panel jest przeznaczony wyłącznie dla administratorów.",
  );

export function toAuthError(error: unknown) {
  const result = isAxiosError<ApiResult>(error)
    ? error.response?.data
    : undefined;

  if (result?.errorCode) {
    const translatedMessage =
      translateErrorCode(result.errorCode) ?? result.message;

    return new AuthError(
      result.errorCode,
      translatedMessage,
      result.errors ?? [],
    );
  }

  return new AuthError(
    "NETWORK_ERROR",
    translateErrorCode("NETWORK_ERROR") ??
      "Nie można połączyć się z serwerem. Spróbuj ponownie.",
  );
}
