import { AlertCircle } from "lucide-react";
import {
  getApiErrorMessage,
  getApiValidationErrors,
} from "~/lib/error-translator";

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

  const message = getApiErrorMessage(error, fallbackMessage);
  const validationErrors = getApiValidationErrors(error);

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive ${className}`}
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="space-y-1">
        <p>{message}</p>
        {validationErrors.length > 0 && (
          <ul className="list-disc pl-5 text-xs">
            {validationErrors.map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
