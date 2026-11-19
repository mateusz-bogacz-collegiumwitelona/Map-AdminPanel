import { useMemo, useState } from "react";
import {
  type ColumnDef,
  createColumnHelper,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import { ArrowDownWideNarrow, ArrowUpNarrowWide, Filter } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ResponsiveDataTable } from "~/components/table/responsive-data-table";
import { QueryErrorBanner } from "~/components/error/query-error-banner";
import { ReportStatusBadge } from "~/components/reports/report-status-badge";
import { ReportDetailDialog } from "~/components/reports/report-detail-dialog";
import { useReportsList } from "~/hooks/use-reports";
import { useDebounce } from "~/hooks/use-debounce";
import { formatDateTime } from "~/lib/date";
import type { ReportListItem } from "~/types/report";
import { Link } from "react-router";

const _features = tableFeatures({});
const columnHelper = createColumnHelper<typeof _features, ReportListItem>();

export default function ReportList() {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortDescending, setSortDescending] = useState<boolean>(true);
  const [isShowAll, setIsShowAll] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchTerm, 300);

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error: queryError,
  } = useReportsList({
    pageNumber,
    pageSize,
    searchTerm: debouncedSearch,
    sortBy,
    sortDescending,
    isShowAll,
  });

  const columns = useMemo(
    () =>
      [
        columnHelper.accessor((row) => `${row.firstName} ${row.lastName}`, {
          id: "user",
          header: "Zgłoszony użytkownik",
          cell: (info) => {
            const row = info.row.original;
            return (
              <Link
                to={`/users/${row.reportedUserId}`}
                className="font-medium whitespace-nowrap text-foreground underline-offset-4 hover:text-primary hover:underline"
              >
                {row.firstName} {row.lastName}
              </Link>
            );
          },
        }),
        columnHelper.accessor("reason", {
          header: "Powód zgłoszenia",
          cell: (info) => (
            <p
              className="line-clamp-2 max-w-xs min-w-48 text-foreground/90 sm:max-w-sm lg:max-w-md"
              title={info.getValue()}
            >
              {info.getValue()}
            </p>
          ),
        }),
        columnHelper.accessor("status", {
          header: "Status",
          cell: (info) => <ReportStatusBadge status={info.getValue()} />,
        }),
        columnHelper.accessor("createdAt", {
          header: "Data zgłoszenia",
          cell: (info) => (
            <span className="whitespace-nowrap text-muted-foreground">
              {formatDateTime(info.getValue())}
            </span>
          ),
        }),
        columnHelper.accessor("resolvedAt", {
          header: "Data rozpatrzenia",
          cell: (info) => {
            const value = info.getValue();
            if (!value) {
              return (
                <span className="whitespace-nowrap text-muted-foreground/70 italic">
                  Nierozpatrzone
                </span>
              );
            }
            return (
              <span className="whitespace-nowrap text-muted-foreground">
                {formatDateTime(value)}
              </span>
            );
          },
        }),
        columnHelper.display({
          id: "actions",
          header: "Akcje",
          cell: (info) => (
            <button
              type="button"
              onClick={() => setSelectedReportId(info.row.original.id)}
              className="cursor-pointer font-medium whitespace-nowrap text-primary underline-offset-4 hover:underline"
            >
              Szczegóły
            </button>
          ),
        }),
      ] as ColumnDef<typeof _features, ReportListItem, unknown>[],
    [],
  );

  const reports = useMemo(() => data?.items || [], [data]);
  const totalPages = data?.totalPages || 1;
  const totalItems = data?.totalCount ?? reports.length;

  const table = useTable<typeof _features, ReportListItem>({
    features: _features,
    data: reports,
    columns,
  });

  return (
    <main className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-1 border-b pb-4">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Zgłoszenia użytkowników
        </h1>
        <p className="text-sm text-muted-foreground">
          Przeglądaj i rozpatruj zgłoszenia naruszeń regulaminu.
        </p>
      </div>

      <div className="flex flex-col items-stretch justify-between gap-3 rounded-lg border bg-card p-3 shadow-xs sm:gap-4 sm:p-4 md:flex-row md:items-center">
        <div className="w-full shrink-0 md:w-80">
          <Input
            type="search"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPageNumber(1);
            }}
            placeholder="Wyszukaj (Imię, Nazwisko, Powód)..."
            aria-label="Wyszukaj zgłoszenia"
          />
        </div>

        <div className="flex w-full flex-wrap items-center gap-2 sm:gap-3 md:w-auto">
          <span className="hidden text-sm text-muted-foreground sm:block">
            Sortuj po:
          </span>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPageNumber(1);
            }}
            className="h-9 flex-1 rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-xs focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:flex-initial"
          >
            <option value="createdAt">Data zgłoszenia</option>
            <option value="resolvedAt">Data rozpatrzenia</option>
            <option value="firstName">Imię</option>
            <option value="lastName">Nazwisko</option>
            <option value="status">Status</option>
          </select>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => {
              setSortDescending(!sortDescending);
              setPageNumber(1);
            }}
            aria-label={sortDescending ? "Sortuj rosnąco" : "Sortuj malejąco"}
            className="shrink-0"
          >
            {sortDescending ? (
              <ArrowDownWideNarrow className="h-4 w-4" />
            ) : (
              <ArrowUpNarrowWide className="h-4 w-4" />
            )}
          </Button>

          <div className="relative">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filtry</span>
              {isShowAll && (
                <span className="relative -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
                </span>
              )}
            </Button>

            {showFilters && (
              <div className="absolute top-full right-0 z-50 mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-lg border bg-popover p-4 text-popover-foreground shadow-md">
                <h3 className="mb-4 text-sm font-medium">Filtruj zgłoszenia</h3>
                <div className="space-y-4">
                  <div className="grid gap-1.5">
                    <Label
                      htmlFor="report-status-filter"
                      className="text-xs text-muted-foreground"
                    >
                      Zakres zgłoszeń
                    </Label>
                    <select
                      id="report-status-filter"
                      value={String(isShowAll)}
                      onChange={(e) => {
                        setIsShowAll(e.target.value === "true");
                        setPageNumber(1);
                      }}
                      className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-xs focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      <option value="false">Tylko oczekujące</option>
                      <option value="true">
                        Wszystkie (w tym rozpatrzone)
                      </option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between border-t pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsShowAll(false);
                        setPageNumber(1);
                      }}
                      className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                    >
                      Wyczyść
                    </button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => setShowFilters(false)}
                    >
                      Zamknij
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <QueryErrorBanner
        error={queryError}
        fallbackMessage="Nie udało się pobrać listy zgłoszeń."
      />

      <ResponsiveDataTable
        table={table}
        isLoading={isLoading}
        isError={isError}
        isFetching={isFetching}
        pageNumber={data?.pageNumber ?? pageNumber}
        pageSize={pageSize}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPageNumber(1);
        }}
        onPageChange={setPageNumber}
        emptyMessage="Brak zgłoszeń do wyświetlenia."
        loadingMessage="Wczytywanie zgłoszeń..."
      />

      <ReportDetailDialog
        reportId={selectedReportId}
        onClose={() => setSelectedReportId(null)}
      />
    </main>
  );
}
