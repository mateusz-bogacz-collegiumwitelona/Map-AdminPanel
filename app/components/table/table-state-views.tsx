import React from "react";
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
