import { Link } from "react-router";
import { ArrowRight, Clock, Flag, ShieldAlert } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useReportsList } from "~/hooks/use-reports";

export function meta() {
  return [{ title: "Panel główny | Panel administratora" }];
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function Home() {
  const { data: pendingData, isLoading: isPendingLoading } = useReportsList({
    pageNumber: 1,
    pageSize: 5,
    sortBy: "createdAt",
    sortDescending: true,
    isShowAll: false,
  });

  const { data: allData, isLoading: isAllLoading } = useReportsList({
    pageNumber: 1,
    pageSize: 1,
    isShowAll: true,
  });

  const pendingCount = pendingData?.totalCount ?? 0;
  const totalCount = allData?.totalCount ?? 0;
  const resolvedCount = Math.max(totalCount - pendingCount, 0);
  const recentPending = pendingData?.items ?? [];

  return (
    <main className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <div className="flex flex-col justify-between gap-4 border-b pb-4 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Panel główny
          </h1>
          <p className="text-sm text-muted-foreground">
            Przegląd aktywności moderacyjnej i zgłoszeń użytkowników.
          </p>
        </div>

        <Link to="/reports">
          <Button className="w-full gap-2 sm:w-auto">
            <span>Przejdź do zgłoszeń</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <section
        aria-label="Podsumowanie zgłoszeń"
        className="grid gap-4 sm:grid-cols-3"
      >
        <div className="rounded-lg border bg-card p-5 text-card-foreground shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Oczekujące zgłoszenia
            </span>
            <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <p className="mt-3 text-3xl font-semibold tracking-tight">
            {isPendingLoading ? "—" : pendingCount}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Wymagają weryfikacji administratora
          </p>
        </div>

        <div className="rounded-lg border bg-card p-5 text-card-foreground shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Rozpatrzone zgłoszenia
            </span>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-3 text-3xl font-semibold tracking-tight">
            {isPendingLoading || isAllLoading ? "—" : resolvedCount}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Zatwierdzone lub odrzucone
          </p>
        </div>

        <div className="rounded-lg border bg-card p-5 text-card-foreground shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Wszystkie zgłoszenia
            </span>
            <Flag className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-3 text-3xl font-semibold tracking-tight">
            {isAllLoading ? "—" : totalCount}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Łączna liczba w historii systemu
          </p>
        </div>
      </section>

      <section className="rounded-lg border bg-card text-card-foreground shadow-xs">
        <div className="flex items-center justify-between border-b px-4 py-3.5 sm:px-6">
          <div>
            <h2 className="text-base font-semibold">
              Najnowsze oczekujące zgłoszenia
            </h2>
            <p className="text-xs text-muted-foreground">
              Ostatnie 5 zgłoszeń czekających na decyzję.
            </p>
          </div>
          <Link
            to="/reports"
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Zobacz wszystkie
          </Link>
        </div>

        {isPendingLoading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Wczytywanie ostatnich zgłoszeń...
          </div>
        ) : recentPending.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Brak oczekujących zgłoszeń do rozpatrzenia.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {recentPending.map((report) => (
              <li
                key={report.id}
                className="flex flex-col justify-between gap-2 px-4 py-3.5 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center sm:px-6"
              >
                <div className="min-w-0 space-y-0.5">
                  <p className="font-medium text-foreground">
                    {report.firstName} {report.lastName}
                  </p>
                  <p className="truncate text-sm text-muted-foreground">
                    {report.reason}
                  </p>
                </div>

                <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-end">
                  <span className="text-xs whitespace-nowrap text-muted-foreground">
                    {formatDateTime(report.createdAt)}
                  </span>
                  <Link
                    to={`/reports/${report.id}`}
                    className="text-sm font-medium whitespace-nowrap text-primary underline-offset-4 hover:underline"
                  >
                    Szczegóły
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
