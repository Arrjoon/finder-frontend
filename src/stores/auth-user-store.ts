import { create } from "zustand";

import type { TCurrentUser } from "@/api-services/user/user-dashboard-definations";
import { userDashboardServices } from "@/api-services/user/user-dashboard-services";
import { queryClient } from "@/providers/ReactQueryProvider";
import { USER_DASHBOARD_KEYS } from "@/hooks/user/useUserDashboard";

type AuthUserState = {
  /** Current user from `GET accounts/me/`; `null` when logged out or not yet loaded. */
  user: TCurrentUser | null;
  /** True while `refreshUser` is in flight. */
  isLoading: boolean;
  setUser: (user: TCurrentUser | null) => void;
  clearUser: () => void;
  /**
   * Fetches `/accounts/me/` and updates this store + React Query cache (`useCurrentUser`).
   * Call after login/register and on app load (see `AuthUserInitializer`).
   */
  refreshUser: () => Promise<void>;
};

export const useAuthUserStore = create<AuthUserState>((set) => ({
  user: null,
  isLoading: false,

  setUser: (user) => {
    set({ user });
    if (user) {
      queryClient.setQueryData(USER_DASHBOARD_KEYS.me, user);
    } else {
      queryClient.removeQueries({ queryKey: USER_DASHBOARD_KEYS.me });
    }
  },

  clearUser: () => {
    set({ user: null });
    queryClient.removeQueries({ queryKey: USER_DASHBOARD_KEYS.me });
  },

  refreshUser: async () => {
    set({ isLoading: true });
    try {
      const user = await userDashboardServices.fetchMe();
      set({ user, isLoading: false });
      queryClient.setQueryData(USER_DASHBOARD_KEYS.me, user);
    } catch {
      set({ user: null, isLoading: false });
      queryClient.removeQueries({ queryKey: USER_DASHBOARD_KEYS.me });
    }
  },
}));
