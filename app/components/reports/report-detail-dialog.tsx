import { Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { QueryErrorBanner } from "~/components/error/query-error-banner";
import { ReportStatusBadge } from "~/components/reports/report-status-badge";
import { useReportDetail } from "~/hooks/use-reports";
import { formatDateTime } from "~/lib/date";
import type { ReportDetail } from "~/types/report";

interface ReportDetailDialogProps {
  readonly reportId: string | null;
  readonly onClose: () => void;
}

function renderReportContent(
  isLoading: boolean,
  error: Error | null,
  data: ReportDetail | undefined,
) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="mb-3 h-7 w-7 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          Wczytywanie szczegółów zgłoszenia...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <QueryErrorBanner
        error={error}
        fallbackMessage="Nie udało się pobrać szczegółów zgłoszenia."
      />
    );
  }

  if (!data) {
    return null;
  }

  const hasAdminName =
    data.resolvedByAdminFirstName || data.resolvedByAdminLastName;
  const resolvedByName = hasAdminName
    ? `${data.resolvedByAdminFirstName ?? ""} ${data.resolvedByAdminLastName ?? ""}`.trim()
    : "Administrator";

  return (
    <div className="space-y-5 text-sm">
      <div className="grid gap-4 rounded-lg border bg-muted/30 p-4 sm:grid-cols-2">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">
            Zgłoszony użytkownik
          </p>
          <p className="font-medium text-foreground">
            {data.reportedFirstName} {data.reportedLastName}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">
            Zgłaszający
          </p>
          <p className="font-medium text-foreground">
            {data.reporterFirstName} {data.reporterLastName}
          </p>
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground">
          Powód zgłoszenia
        </p>
        <div className="max-h-48 overflow-y-auto rounded-lg border bg-background p-3.5 leading-relaxed whitespace-pre-wrap text-foreground">
          {data.reason}
        </div>
      </div>

      <div className="grid gap-4 border-t pt-4 sm:grid-cols-2">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">
            Data zgłoszenia
          </p>
          <p className="text-foreground">{formatDateTime(data.createdAt)}</p>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">
            Data rozpatrzenia
          </p>
          <p className="text-foreground">
            {data.resolvedAt ? (
              formatDateTime(data.resolvedAt)
            ) : (
              <span className="text-muted-foreground/70 italic">
                Nierozpatrzone
              </span>
            )}
          </p>
        </div>

        {data.resolvedAt && (
          <div className="space-y-1 sm:col-span-2">
            <p className="text-xs font-medium text-muted-foreground">
              Rozpatrzone przez
            </p>
            <p className="font-medium text-foreground">{resolvedByName}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function ReportDetailDialog({
  reportId,
  onClose,
}: ReportDetailDialogProps) {
  const { data, isLoading, error } = useReportDetail(reportId);

  return (
    <Dialog
      open={Boolean(reportId)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3 pr-6">
            <DialogTitle>Szczegóły zgłoszenia</DialogTitle>
            {data && <ReportStatusBadge status={data.status} />}
          </div>
        </DialogHeader>

        {renderReportContent(isLoading, error, data)}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Zamknij
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
