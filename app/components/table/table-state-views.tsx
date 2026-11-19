import React from "react";
import { Button } from "~/components/ui/button";
import { Loader2 } from "lucide-react";

export const TableLoadingState: React.FC<{ readonly message?: string }> = ({
  message = "Wczytywanie danych...",
}) => (
  <div className="flex flex-col items-center justify-center py-20">
    <Loader2 className="mb-3 h-8 w-8 animate-spin text-primary" />
    <p className="text-sm font-medium text-muted-foreground">{message}</p>
  </div>
);

export const TableEmptyState: React.FC<{ readonly message?: string }> = ({
  message = "Brak danych do wyświetlenia.",
}) => (
  <div className="rounded-lg border bg-card py-16 text-center text-card-foreground shadow-xs">
    <p className="text-sm font-medium text-muted-foreground">{message}</p>
  </div>
);

export const MobileLoadMoreButton: React.FC<{
  readonly isFetching: boolean;
  readonly onClick: () => void;
  readonly label?: string;
}> = ({ isFetching, onClick, label = "Pokaż więcej wyników" }) => (
  <div className="mt-6 flex justify-center pt-2">
    <Button
      type="button"
      onClick={onClick}
      disabled={isFetching}
      className="flex h-11 w-full items-center justify-center gap-2 bg-blue-900 text-white transition-all hover:bg-blue-800"
    >
      {isFetching ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" /> Wczytywanie...
        </>
      ) : (
        label
      )}
    </Button>
  </div>
);
