import type { ReportStatus } from "~/types/report";

export const STATUS_BADGE: Record<
  ReportStatus,
  { label: string; className: string }
> = {
  Pending: {
    label: "Oczekujące",
    className:
      "border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  },
  Approved: {
    label: "Zatwierdzone",
    className:
      "border border-destructive/30 bg-destructive/10 text-destructive",
  },
  Rejected: {
    label: "Odrzucone",
    className: "border border-border bg-muted text-muted-foreground",
  },
};

export function ReportStatusBadge({
  status,
}: {
  readonly status: ReportStatus;
}) {
  const badge = STATUS_BADGE[status];

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${badge.className}`}
    >
      {badge.label}
    </span>
  );
}
