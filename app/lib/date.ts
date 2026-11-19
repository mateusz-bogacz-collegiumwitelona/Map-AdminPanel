const dateTimeFormatter = new Intl.DateTimeFormat("pl-PL", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const dateFormatter = new Intl.DateTimeFormat("pl-PL", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export function formatDateTime(value: string) {
  return dateTimeFormatter.format(new Date(value));
}

export function formatDate(value: Date) {
  return dateFormatter.format(value);
}


export function toDotNetTimeSpanUntilEndOfDay(targetDate: Date): string {
  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 0);

  const diffMs = Math.max(endOfDay.getTime() - Date.now(), 60_000);
  const totalSeconds = Math.floor(diffMs / 1000);

  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => String(n).padStart(2, "0");
  return `${days}.${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}
