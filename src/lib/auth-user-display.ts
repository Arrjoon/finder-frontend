import type { TCurrentUser } from "@/api-services/user/user-dashboard-definations";

/** Display name for nav / dashboard (first + last, else username). */
export function authUserDisplayName(user: TCurrentUser | null | undefined): string {
  if (!user) return "";
  const n = [user.first_name, user.last_name].filter(Boolean).join(" ").trim();
  return n || user.username;
}

/** Two-letter avatar initials from display name. */
export function authUserInitials(user: TCurrentUser | null | undefined): string {
  const name = authUserDisplayName(user);
  if (!name) return "?";
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    const a = parts[0][0] ?? "";
    const b = parts[1][0] ?? "";
    return (a + b).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

/** Default dashboard home by role (adjust paths if your routes change). */
export function authUserDashboardHref(role: string | undefined): string {
  switch (role) {
    case "admin":
      return "/dashboard/admin";
    case "business":
      return "/dashboard/business";
    default:
      return "/dashboard/user";
  }
}
