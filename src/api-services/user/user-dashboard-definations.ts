/** Django `UserProfileSerializer` subset on `GET accounts/me/`. */
export type TUserProfileMe = {
  address: string;
  city: string;
  country: string;
  review_count: number;
  helpful_votes: number;
  photos_uploaded: number;
  places_saved: number;
  notification_preferences?: Record<string, unknown>;
};

/** `UserSerializer` response from `GET accounts/me/`. */
export type TCurrentUser = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  status: string;
  phone?: string;
  profile: TUserProfileMe;
};

export type TDashboardBusinessMini = {
  id: number;
  name: string;
  slug: string;
  rating?: number | null;
  primary_category_name?: string | null;
};

export type TMyReviewRow = {
  id: number;
  business: TDashboardBusinessMini;
  rating: number;
  title: string;
  content: string;
  status: string;
  helpful_count: number;
  created_at: string;
};

export type TMyActivityRow = {
  id: number;
  activity_type: string;
  description: string;
  metadata: Record<string, unknown>;
  business: TDashboardBusinessMini | null;
  created_at: string;
};

export type TMySavedPlaceRow = {
  id: number;
  business: TDashboardBusinessMini;
  notes: string;
  created_at: string;
};

export type TDrfPaginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};
