import type { FormEvent } from "react";
import { redirect } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useLoginMutation } from "~/hooks/use-auth";
import { getSession, isAdmin } from "~/lib/auth";

export function meta() {
  return [{ title: "Sign in" }];
}

export function clientLoader() {
  return isAdmin(getSession()) ? redirect("/") : null;
}

export function HydrateFallback() {
  return null;
}

export default function Login() {
  const { mutate, isPending, error } = useLoginMutation();
  const invalidCredentials = error?.code === "AUTH_001";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    mutate({
      email: String(form.get("email")),
      password: String(form.get("password")),
    });
  }

  return (
    <main className="flex min-h-svh items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4"
      >
        <h1 className="text-2xl font-semibold">Admin Panel</h1>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            aria-invalid={invalidCredentials}
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
            aria-invalid={invalidCredentials}
            required
          />
        </div>
        {error && (
          <div role="alert" className="text-sm text-destructive">
            <p>{error.message}</p>
            {error.errors.length > 0 && (
              <ul className="list-disc pl-5">
                {error.errors.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            )}
          </div>
        )}
        <Button type="submit" disabled={isPending}>
          Sign in
        </Button>
      </form>
    </main>
  );
}
