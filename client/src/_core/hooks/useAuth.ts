import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { TRPCClientError } from "@trpc/client";
import { useCallback, useEffect, useMemo } from "react";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

function isInvalidUrlError(error: unknown): boolean {
  return (
    error instanceof TypeError &&
    String(error.message).includes("Invalid URL")
  );
}

export function useAuth(options?: UseAuthOptions) {
  let skipAuth = false;
  let redirectPath: string;
  if (options?.redirectPath !== undefined) {
    redirectPath = options.redirectPath;
  } else {
    try {
      redirectPath = getLoginUrl();
    } catch (error: unknown) {
      if (isInvalidUrlError(error)) {
        skipAuth = true;
        redirectPath = "";
      } else {
        throw error;
      }
    }
  }

  const redirectOnUnauthenticated =
    options?.redirectOnUnauthenticated ?? false;
  const utils = trpc.useUtils();

  const meQuery = trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !skipAuth,
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      utils.auth.me.setData(undefined, null);
    },
  });

  const logout = useCallback(async () => {
    if (skipAuth) return;
    try {
      await logoutMutation.mutateAsync();
    } catch (error: unknown) {
      if (
        error instanceof TRPCClientError &&
        error.data?.code === "UNAUTHORIZED"
      ) {
        return;
      }
      throw error;
    } finally {
      utils.auth.me.setData(undefined, null);
      await utils.auth.me.invalidate();
    }
  }, [logoutMutation, skipAuth, utils]);

  const state = useMemo(() => {
    if (skipAuth) {
      return {
        user: null as typeof meQuery.data | null,
        loading: false,
        error: null as typeof meQuery.error | null,
        isAuthenticated: false,
      };
    }
    localStorage.setItem(
      "manus-runtime-user-info",
      JSON.stringify(meQuery.data)
    );
    return {
      user: meQuery.data ?? null,
      loading: meQuery.isLoading || logoutMutation.isPending,
      error: meQuery.error ?? logoutMutation.error ?? null,
      isAuthenticated: Boolean(meQuery.data),
    };
  }, [
    skipAuth,
    meQuery.data,
    meQuery.error,
    meQuery.isLoading,
    logoutMutation.error,
    logoutMutation.isPending,
  ]);

  useEffect(() => {
    if (skipAuth) return;
    if (!redirectOnUnauthenticated) return;
    if (meQuery.isLoading || logoutMutation.isPending) return;
    if (state.user) return;
    if (typeof window === "undefined") return;
    if (window.location.pathname === redirectPath) return;

    window.location.href = redirectPath;
  }, [
    skipAuth,
    redirectOnUnauthenticated,
    redirectPath,
    logoutMutation.isPending,
    meQuery.isLoading,
    state.user,
  ]);

  if (skipAuth) {
    return {
      user: null,
      loading: false,
      error: null,
      isAuthenticated: false,
      logout: () => {},
      refresh: () => {},
    };
  }

  return {
    ...state,
    refresh: () => meQuery.refetch(),
    logout,
  };
}
