import type { AuthSession } from "~/types/auth";

const storageKey = "session";

function readSession() {
  try {
    return JSON.parse(localStorage.getItem(storageKey) ?? "null");
  } catch {
    return null;
  }
}

export function getSession(): AuthSession | null {
  const session = readSession();
  if (
    Array.isArray(session?.roles) &&
    session.accessToken &&
    session.refreshToken
  ) {
    return session;
  }
  clearSession();
  return null;
}

export function setSession(session: AuthSession) {
  localStorage.setItem(storageKey, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(storageKey);
}

export function isAdmin(session: AuthSession | null) {
  return session?.roles.includes("Admin") ?? false;
}
