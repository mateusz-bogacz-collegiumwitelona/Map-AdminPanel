import { isAxiosError } from "axios";
import { AlertCircle } from "lucide-react";
import type { ApiResult } from "~/types/api";

interface QueryErrorBannerProps {
  readonly error: unknown;
  readonly fallbackMessage?: string;
  readonly className?: string;
}

export function QueryErrorBanner({
  error,
  fallbackMessage = "Wystąpił błąd podczas pobierania danych.",
  className = "",
}: QueryErrorBannerProps) {
  if (!error) return null;

  let message = fallbackMessage;

  if (isAxiosError<ApiResult>(error)) {
    message = error.response?.data?.message || error.message || fallbackMessage;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div
      role="alert"
      className={`flex items-center gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive ${className}`}
    >
      <AlertCircle className="h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
