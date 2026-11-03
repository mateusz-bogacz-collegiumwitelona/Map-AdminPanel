export type AuthSession = {
  userId: string;
  roles: string[];
  accessToken: string;
  accessTokenExpiration: string;
  refreshToken: string;
};

const storageKey = "session";

export function getSession(): AuthSession | null {
  const session = localStorage.getItem(storageKey);
  return session ? JSON.parse(session) : null;
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
