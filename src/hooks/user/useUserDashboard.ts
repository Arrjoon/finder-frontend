import { useQuery } from "@tanstack/react-query";

import { userDashboardServices } from "@/api-services/user/user-dashboard-services";
import type {
  TCurrentUser,
  TDrfPaginated,
  TMyActivityRow,
  TMyReviewRow,
  TMySavedPlaceRow,
} from "@/api-services/user/user-dashboard-definations";

const STALE_MS = 1000 * 60 * 5;
const GC_MS = 1000 * 60 * 30;

export const USER_DASHBOARD_KEYS = {
  me: ["user", "me"] as const,
  reviews: (page: number) => ["user", "me", "reviews", page] as const,
  activities: (page: number) => ["user", "me", "activities", page] as const,
  savedPlaces: (page: number) =>
    ["user", "me", "saved-places", page] as const,
};

/** Must match `UserDashboardPagination.page_size` in `accounts/dashboard_views.py`. */
export const USER_DASHBOARD_PAGE_SIZE = 5;

export function useCurrentUser() {
  return useQuery<TCurrentUser>({
    queryKey: USER_DASHBOARD_KEYS.me,
    queryFn: () => userDashboardServices.fetchMe(),
    staleTime: STALE_MS,
    gcTime: GC_MS,
    refetchOnWindowFocus: false,
  });
}

export function useMyReviewsPaginated(page: number) {
  return useQuery<TDrfPaginated<TMyReviewRow>>({
    queryKey: USER_DASHBOARD_KEYS.reviews(page),
    queryFn: () => userDashboardServices.fetchMyReviews(page),
    staleTime: STALE_MS,
    gcTime: GC_MS,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  });
}

export function useMyActivitiesPaginated(page: number) {
  return useQuery<TDrfPaginated<TMyActivityRow>>({
    queryKey: USER_DASHBOARD_KEYS.activities(page),
    queryFn: () => userDashboardServices.fetchMyActivities(page),
    staleTime: STALE_MS,
    gcTime: GC_MS,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  });
}

export function useMySavedPlacesPaginated(page: number) {
  return useQuery<TDrfPaginated<TMySavedPlaceRow>>({
    queryKey: USER_DASHBOARD_KEYS.savedPlaces(page),
    queryFn: () => userDashboardServices.fetchMySavedPlaces(page),
    staleTime: STALE_MS,
    gcTime: GC_MS,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  });
}
