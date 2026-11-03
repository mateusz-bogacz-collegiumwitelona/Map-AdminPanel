import { Outlet, redirect } from "react-router";
import { Button } from "~/components/ui/button";
import { useLogoutMutation } from "~/hooks/use-auth";
import { getSession, isAdmin } from "~/lib/auth";

export function clientLoader() {
  return isAdmin(getSession()) ? null : redirect("/login");
}

export function HydrateFallback() {
  return null;
}

export default function Protected() {
  const { mutate: logout, isPending, error } = useLogoutMutation();

  return (
    <>
      <header className="flex items-center justify-end gap-4 border-b p-4">
        {error && (
          <p role="alert" className="text-sm text-destructive">
            Logout failed: {error.message}
          </p>
        )}
        <Button variant="outline" onClick={() => logout()} disabled={isPending}>
          Log out
        </Button>
      </header>
      <Outlet />
    </>
  );
}
