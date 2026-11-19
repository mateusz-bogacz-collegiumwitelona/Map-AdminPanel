import { NavLink } from "react-router";
import { Button } from "~/components/ui/button";
import { useLogoutMutation } from "~/hooks/use-auth";

const NAV_ITEMS = [
  { to: "/", label: "Panel główny", end: true },
  { to: "/reports", label: "Zgłoszenia", end: false },
] as const;

export function Header() {
  const { mutate: logout, isPending, error } = useLogoutMutation();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-xs">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <NavLink
            to="/"
            className="text-sm font-semibold tracking-tight text-foreground"
          >
            Panel administratora
          </NavLink>

          <nav
            aria-label="Nawigacja główna"
            className="flex items-center gap-1"
          >
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {error && (
            <p role="alert" className="text-xs text-destructive sm:text-sm">
              Błąd wylogowania: {error.message}
            </p>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => logout()}
            disabled={isPending}
          >
            Wyloguj się
          </Button>
        </div>
      </div>
    </header>
  );
}
