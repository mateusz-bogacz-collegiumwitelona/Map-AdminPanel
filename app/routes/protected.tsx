import { Outlet, redirect } from "react-router";
import { Header } from "~/components/layout/header";
import { getSession, isAdmin } from "~/lib/auth";

export function clientLoader() {
  return isAdmin(getSession()) ? null : redirect("/login");
}

export function HydrateFallback() {
  return null;
}

export default function Protected() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <Header />
      <Outlet />
    </div>
  );
}
