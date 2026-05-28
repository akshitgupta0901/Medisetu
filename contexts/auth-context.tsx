"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useRouter } from "next/navigation";
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";

import type { SafeUser, UserRole } from "@/types/auth";

import { authFetch } from "@/lib/fetch-auth";

import {
  TOKEN_COOKIE_NAME,
  USER_STORAGE_KEY,
  TOKEN_STORAGE_KEY,
} from "@/lib/constants";

interface AuthContextValue {
  user: SafeUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  refetch: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: SafeUser | null) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredUser(): SafeUser | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);

    if (!raw) return null;

    return JSON.parse(raw) as SafeUser;
  } catch {
    return null;
  }
}

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { status: sessionStatus } = useSession();

  const [user, setUser] = useState<SafeUser | null>(null);

  const [loading, setLoading] = useState(true);

  const persistUser = useCallback((next: SafeUser | null) => {
    setUser(next);

    if (next) {
      localStorage.setItem(
        USER_STORAGE_KEY,
        JSON.stringify(next)
      );
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, []);

  const refetch = useCallback(async () => {
    try {
      const hasCustomToken =
        !!localStorage.getItem(TOKEN_STORAGE_KEY);

      const hasNextAuthSession =
        sessionStatus === "authenticated";

      if (!hasCustomToken && !hasNextAuthSession) {
        persistUser(null);
        return;
      }

      const res = await authFetch("/api/me");

      const data = await res.json();

      if (res.ok && data.success) {
        persistUser(data.user);
      } else {
        persistUser(null);
      }
    } catch (error) {
      console.error("Auth refetch error:", error);

      persistUser(null);
    }
  }, [persistUser, sessionStatus]);

  useEffect(() => {
    if (sessionStatus === "loading") {
      return;
    }

    const stored = readStoredUser();

    if (stored) {
      setUser(stored);
    }

    refetch().finally(() => {
      setLoading(false);
    });
  }, [refetch, sessionStatus]);

  const logout = useCallback(async () => {
    // CLEAR LOCAL USER
    localStorage.removeItem(USER_STORAGE_KEY);

    // CLEAR CUSTOM TOKEN
    localStorage.removeItem(TOKEN_STORAGE_KEY);

    // CLEAR COOKIE
    document.cookie = `${TOKEN_COOKIE_NAME}=; path=/; max-age=0`;

    // CLEAR STATE
    setUser(null);

    // NEXTAUTH LOGOUT
    if (sessionStatus === "authenticated") {
      await nextAuthSignOut({
        redirect: false,
      });
    }
  }, [sessionStatus]);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      refetch,
      logout,
      setUser: persistUser,
    }),
    [user, loading, refetch, logout, persistUser]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return ctx;
}

export function useRequireAuth(
  requiredRoles?: UserRole[]
) {
  const auth = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (auth.loading) return;

    if (!auth.user) {
      const redirect =
        typeof window !== "undefined"
          ? window.location.pathname
          : "/";

      router.replace(
        `/login?redirect=${encodeURIComponent(redirect)}`
      );

      return;
    }

    if (
      requiredRoles &&
      !requiredRoles.includes(auth.user.role)
    ) {
      router.replace("/login?error=unauthorized");
    }
  }, [
    auth.loading,
    auth.user,
    requiredRoles,
    router,
  ]);

  return auth;
}