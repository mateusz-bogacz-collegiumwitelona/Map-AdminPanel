import axios, { isAxiosError } from "axios";
import { clearSession, getSession, setSession } from "~/lib/auth";
import type { ApiResult } from "~/types/api";
import type { AuthSession } from "~/types/auth";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({ baseURL });

let refreshing: Promise<AuthSession> | undefined;

function refreshSession(refreshToken: string) {
  refreshing ??= axios
    .post<ApiResult<AuthSession>>(
      "/api/auth/refresh",
      { refreshToken },
      { baseURL },
    )
    .then(({ data }) => {
      setSession(data.data);
      return data.data;
    })
    .finally(() => {
      refreshing = undefined;
    });
  return refreshing;
}

api.interceptors.request.use((config) => {
  const session = getSession();
  if (session) config.headers.Authorization = `Bearer ${session.accessToken}`;
  return config;
});

api.interceptors.response.use(undefined, async (error) => {
  const refreshToken = getSession()?.refreshToken;
  if (
    !isAxiosError(error) ||
    error.response?.status !== 401 ||
    !error.config ||
    !refreshToken
  ) {
    throw error;
  }
  try {
    const { accessToken } = await refreshSession(refreshToken);
    error.config.headers.Authorization = `Bearer ${accessToken}`;
  } catch (refreshError) {
    if (
      isAxiosError(refreshError) &&
      refreshError.response &&
      getSession()?.refreshToken === refreshToken
    ) {
      clearSession();
      window.location.replace("/login");
    }
    throw error;
  }
  return axios.request(error.config);
});
