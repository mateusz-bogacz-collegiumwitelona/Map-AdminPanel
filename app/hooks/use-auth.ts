import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { login, logout } from "~/api/auth.api";
import { accessDeniedError, AuthError, toAuthError } from "~/lib/auth-mapper";
import { clearSession, getSession, isAdmin, setSession } from "~/lib/auth";
import type { AuthSession, LoginPayload } from "~/types/auth";

export function useLoginMutation() {
  const navigate = useNavigate();

  return useMutation<AuthSession, AuthError, LoginPayload>({
    mutationFn: async (payload) => {
      const session = await login(payload).catch((error) => {
        throw toAuthError(error);
      });
      if (!isAdmin(session)) throw accessDeniedError();
      return session;
    },
    onSuccess: (session) => {
      setSession(session);
      navigate("/", { replace: true });
    },
  });
}

export function useLogoutMutation() {
  const navigate = useNavigate();

  return useMutation<void, AuthError>({
    mutationFn: async () => {
      const session = getSession();
      if (session) {
        await logout(session.refreshToken).catch((error) => {
          throw toAuthError(error);
        });
      }
    },
    onSuccess: () => {
      clearSession();
      navigate("/login", { replace: true });
    },
  });
}
