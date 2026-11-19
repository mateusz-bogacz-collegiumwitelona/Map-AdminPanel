import {
  flexRender,
  type RowData,
  type Table as ReactTableInstance,
  type TableFeatures,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  TableEmptyState,
  TableLoadingState,
} from "~/components/table/table-state-views";

interface ResponsiveDataTableProps<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  readonly table: ReactTableInstance<TFeatures, TData>;
  readonly isLoading: boolean;
  readonly isError: boolean;
  readonly isFetching: boolean;
  readonly pageNumber: number;
  readonly pageSize: number;
  readonly totalPages: number;
  readonly totalItems: number;
  readonly onPageSizeChange: (newSize: number) => void;
  readonly onPageChange: (newPage: number) => void;
  readonly pageSizeOptions?: number[];
  readonly emptyMessage?: string;
  readonly loadingMessage?: string;
}

export function ResponsiveDataTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
>({
  table,
  isLoading,
  isError,
  isFetching,
  pageNumber,
  pageSize,
  totalPages,
  totalItems,
  onPageSizeChange,
  onPageChange,
  pageSizeOptions = [10, 25, 50],
  emptyMessage = "Brak wyników do wyświetlenia.",
  loadingMessage = "Ładowanie danych...",
}: ResponsiveDataTableProps<TFeatures, TData>) {
  if (isLoading) {
    return <TableLoadingState message={loadingMessage} />;
  }

  const rows = table.getRowModel().rows;

  if (rows.length === 0 && !isError) {
    return <TableEmptyState message={emptyMessage} />;
  }

  const safeTotalPages = Math.max(totalPages, 1);
  const startItem =
    totalItems === 0
      ? 0
      : Math.min((pageNumber - 1) * pageSize + 1, totalItems);
  const endItem = Math.min(pageNumber * pageSize, totalItems);

  return (
    <div className="space-y-4">
      <div className="relative overflow-x-auto rounded-lg border bg-card text-card-foreground shadow-xs">
        {isFetching && (
          <div className="absolute inset-x-0 top-0 h-0.5 animate-pulse bg-primary" />
        )}

        <table className="w-full min-w-175 border-collapse text-left">
          <thead className="border-b bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-3 py-3 text-xs font-medium whitespace-nowrap text-muted-foreground sm:px-4 sm:text-sm lg:px-6 lg:py-3.5"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => (
              <tr key={row.id} className="transition-colors hover:bg-muted/40">
                {row.getAllCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-3 py-3 align-middle text-xs sm:px-4 sm:text-sm lg:px-6 lg:py-4"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 rounded-lg border bg-card p-3 text-card-foreground shadow-xs sm:flex-row sm:p-4">
        <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-start">
          <span className="text-xs text-muted-foreground sm:text-sm">
            Pozycji na stronie:
          </span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="h-9 rounded-md border border-input bg-background px-2.5 text-xs text-foreground shadow-xs focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:text-sm"
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="text-center text-xs text-muted-foreground sm:text-sm">
          Wyświetlanie{" "}
          <span className="font-medium text-foreground">{startItem}</span> do{" "}
          <span className="font-medium text-foreground">{endItem}</span> z{" "}
          <span className="font-medium text-foreground">{totalItems}</span>{" "}
          wyników
        </div>

        <div className="flex w-full items-center justify-center gap-2 sm:w-auto">
          <Button
            type="button"
            onClick={() => onPageChange(Math.max(pageNumber - 1, 1))}
            disabled={pageNumber === 1 || isFetching}
            variant="outline"
            size="icon"
            className="h-8 w-8 sm:h-9 sm:w-9"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="px-2 text-xs font-medium whitespace-nowrap text-foreground sm:text-sm">
            Strona {pageNumber} z {safeTotalPages}
          </span>

          <Button
            type="button"
            onClick={() =>
              onPageChange(Math.min(pageNumber + 1, safeTotalPages))
            }
            disabled={pageNumber >= safeTotalPages || isFetching}
            variant="outline"
            size="icon"
            className="h-8 w-8 sm:h-9 sm:w-9"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
