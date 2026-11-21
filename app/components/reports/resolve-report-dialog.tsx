import { type SubmitEvent, useState } from "react";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { QueryErrorBanner } from "~/components/error/query-error-banner";
import { useResolveReportMutation } from "~/hooks/use-reports";
import {
  formatDate,
  getDateInDays,
  MAX_BAN_DAYS,
  toDotNetTimeSpanUntilEndOfDay,
} from "~/lib/date";

interface ResolveReportDialogProps {
  readonly reportId: string;
  readonly reportedUserName: string;
  readonly defaultReason: string;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onResolved: () => void;
}

type DecisionType = "reject" | "ban";
type BanDurationType = "temporary" | "permanent";

export function ResolveReportDialog({
  reportId,
  reportedUserName,
  defaultReason,
  open,
  onOpenChange,
  onResolved,
}: ResolveReportDialogProps) {
  const [decision, setDecision] = useState<DecisionType>("ban");
  const [durationType, setDurationType] =
    useState<BanDurationType>("temporary");

  const [banUntilDate, setBanUntilDate] = useState<Date | undefined>(() =>
    getDateInDays(7),
  );

  const [reason, setReason] = useState(defaultReason);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const { mutate, isPending, error, reset } = useResolveReportMutation();

  const isBan = decision === "ban";
  const isTemporaryBan = isBan && durationType === "temporary";
  const isFormInvalid =
    isBan && (reason.trim().length < 5 || (isTemporaryBan && !banUntilDate));

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      reset();
    }
    onOpenChange(nextOpen);
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isFormInvalid) return;

    let duration: string | null = null;
    if (isTemporaryBan && banUntilDate) {
      duration = toDotNetTimeSpanUntilEndOfDay(banUntilDate);
    }

    mutate(
      {
        id: reportId,
        isBanned: isBan,
        duration,
        reason: isBan ? reason.trim() : null,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          onResolved();
        },
      },
    );
  }

  const tomorrow = getDateInDays(1);
  const maxBanDate = getDateInDays(MAX_BAN_DAYS);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="space-y-5">
          <DialogHeader>
            <DialogTitle>Rozpatrz zgłoszenie</DialogTitle>
            <DialogDescription>
              Podejmij decyzję w sprawie zgłoszenia użytkownika{" "}
              <span className="font-medium text-foreground">
                {reportedUserName}
              </span>
              .
            </DialogDescription>
          </DialogHeader>

          <QueryErrorBanner
            error={error}
            fallbackMessage="Nie udało się rozpatrzyć zgłoszenia."
          />

          <div className="grid gap-2">
            <Label>Decyzja</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDecision("ban")}
                className={`cursor-pointer rounded-md border px-3 py-2.5 text-left text-sm transition-colors ${
                  isBan
                    ? "border-destructive bg-destructive/10 font-medium text-destructive"
                    : "border-input bg-background text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                Zatwierdź i zbanuj
              </button>

              <button
                type="button"
                onClick={() => setDecision("reject")}
                className={`cursor-pointer rounded-md border px-3 py-2.5 text-left text-sm transition-colors ${
                  !isBan
                    ? "border-primary bg-primary/10 font-medium text-foreground"
                    : "border-input bg-background text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                Odrzuć zgłoszenie
              </button>
            </div>
          </div>

          {isBan && (
            <>
              <div className="grid gap-2">
                <Label>Czas trwania blokady</Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDurationType("temporary")}
                    className={`cursor-pointer rounded-md border px-3 py-2 text-sm transition-colors ${
                      durationType === "temporary"
                        ? "border-primary bg-primary/10 font-medium text-foreground"
                        : "border-input bg-background text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    Czasowa
                  </button>
                  <button
                    type="button"
                    onClick={() => setDurationType("permanent")}
                    className={`cursor-pointer rounded-md border px-3 py-2 text-sm transition-colors ${
                      durationType === "permanent"
                        ? "border-destructive bg-destructive/10 font-medium text-destructive"
                        : "border-input bg-background text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    Permanentna
                  </button>
                </div>
              </div>

              {isTemporaryBan && (
                <div className="grid gap-2">
                  <Label htmlFor="ban-until-trigger">
                    Blokada obowiązuje do końca dnia
                  </Label>
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger
                      render={
                        <Button
                          id="ban-until-trigger"
                          type="button"
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                          {banUntilDate ? (
                            <span>{formatDate(banUntilDate)} (23:59)</span>
                          ) : (
                            <span className="text-muted-foreground">
                              Wybierz datę zakończenia...
                            </span>
                          )}
                        </Button>
                      }
                    />
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={banUntilDate}
                        onSelect={(date) => {
                          setBanUntilDate(date);
                          setCalendarOpen(false);
                        }}
                        disabled={(date) =>
                          date < tomorrow || date > maxBanDate
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="ban-reason">
                  Powód blokady (widoczny w powiadomieniu e-mail)
                </Label>
                <textarea
                  id="ban-reason"
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Podaj powód nałożenia blokady (min. 5 znaków)..."
                  required
                  minLength={5}
                  maxLength={500}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                />
              </div>
            </>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
            >
              Anuluj
            </Button>
            <Button
              type="submit"
              variant={isBan ? "destructive" : "default"}
              disabled={isPending || isFormInvalid}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isBan ? "Zatwierdź i zbanuj" : "Odrzuć zgłoszenie"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
