import { apiClient } from "@/api/api-client";
import {
  USER_ME,
  USER_ME_ACTIVITIES,
  USER_ME_REVIEWS,
  USER_ME_SAVED_PLACES,
} from "@/lib/end-points";
import type {
  TCurrentUser,
  TDrfPaginated,
  TMyActivityRow,
  TMyReviewRow,
  TMySavedPlaceRow,
} from "./user-dashboard-definations";

function withPage(path: string, page: number): string {
  const sp = new URLSearchParams();
  sp.set("page", String(Math.max(1, page)));
  return `${path}?${sp.toString()}`;
}

class UserDashboardServices {
  async fetchMe(): Promise<TCurrentUser> {
    const response = await apiClient.get<TCurrentUser>(USER_ME);
    return response.data;
  }

  async fetchMyReviews(page: number): Promise<TDrfPaginated<TMyReviewRow>> {
    const response = await apiClient.get<TDrfPaginated<TMyReviewRow>>(
      withPage(USER_ME_REVIEWS, page)
    );
    return response.data;
  }

  async fetchMyActivities(page: number): Promise<TDrfPaginated<TMyActivityRow>> {
    const response = await apiClient.get<TDrfPaginated<TMyActivityRow>>(
      withPage(USER_ME_ACTIVITIES, page)
    );
    return response.data;
  }

  async fetchMySavedPlaces(
    page: number
  ): Promise<TDrfPaginated<TMySavedPlaceRow>> {
    const response = await apiClient.get<TDrfPaginated<TMySavedPlaceRow>>(
      withPage(USER_ME_SAVED_PLACES, page)
    );
    return response.data;
  }
}

export const userDashboardServices = new UserDashboardServices();
