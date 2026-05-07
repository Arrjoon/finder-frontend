"use client";

import { useEffect, useRef } from "react";

import { useAuthUserStore } from "@/stores/auth-user-store";

/**
 * Loads the current user (if auth cookies exist) into Zustand + React Query.
 * Mount once under the root layout inside `ReactQueryProvider`.
 */
export function AuthUserInitializer() {
  const refreshUser = useAuthUserStore((s) => s.refreshUser);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    void refreshUser();
  }, [refreshUser]);

  return null;
}
