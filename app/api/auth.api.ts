import { api } from "~/api/client";
import type { ApiResult } from "~/types/api";
import type { AuthSession, LoginPayload } from "~/types/auth";

export async function login(payload: LoginPayload) {
  const { data } = await api.post<ApiResult<AuthSession>>(
    "/api/auth/login",
    payload,
  );
  return data.data;
}

export async function logout(refreshToken: string) {
  await api.post<ApiResult>("/api/auth/logout", { refreshToken });
}
