import { Form, redirect, useNavigation } from "react-router";
import type { Route } from "./+types/login";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { api, getErrorMessage, type ApiResult } from "~/lib/api";
import { getSession, isAdmin, setSession, type AuthSession } from "~/lib/auth";

export function meta() {
  return [{ title: "Sign in" }];
}

export function clientLoader() {
  return isAdmin(getSession()) ? redirect("/") : null;
}

export function HydrateFallback() {
  return null;
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const form = await request.formData();
  try {
    const { data } = await api.post<ApiResult<AuthSession>>("/api/auth/login", {
      email: form.get("email"),
      password: form.get("password"),
    });
    if (!isAdmin(data.data)) {
      return {
        error: "Access denied. This panel is available to administrators only.",
      };
    }
    setSession(data.data);
    return redirect("/");
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export default function Login({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();

  return (
    <main className="flex min-h-svh items-center justify-center p-4">
      <Form method="post" className="flex w-full max-w-sm flex-col gap-4">
        <h1 className="text-2xl font-semibold">Admin Panel</h1>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>
        {actionData?.error && (
          <p role="alert" className="text-sm text-destructive">
            {actionData.error}
          </p>
        )}
        <Button type="submit" disabled={navigation.state !== "idle"}>
          Sign in
        </Button>
      </Form>
    </main>
  );
}
