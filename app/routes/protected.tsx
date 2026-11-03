import { Outlet, redirect, useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { api } from "~/lib/api";
import { clearSession, getSession, isAdmin } from "~/lib/auth";

export function clientLoader() {
  return isAdmin(getSession()) ? null : redirect("/login");
}

export function HydrateFallback() {
  return null;
}

export default function Protected() {
  const navigate = useNavigate();

  async function logout() {
    await api
      .post("/api/auth/logout", { refreshToken: getSession()?.refreshToken })
      .catch(() => undefined);
    clearSession();
    navigate("/login", { replace: true });
  }

  return (
    <>
      <header className="flex justify-end border-b p-4">
        <Button variant="outline" onClick={logout}>
          Log out
        </Button>
      </header>
      <Outlet />
    </>
  );
}
