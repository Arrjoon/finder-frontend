# Global client state (`stores/`)

## Auth user — Zustand (`auth-user-store.ts`)

We keep the logged-in user from `GET /api/accounts/me/` in a small Zustand store so **any client component** (marketing header, dashboard header, etc.) can read `username`, `role`, and profile fields without prop drilling.

### What gets stored

- `user`: full `TCurrentUser` (`@/api-services/user/user-dashboard-definations`) or `null`
- `isLoading`: `refreshUser()` in flight
- Actions: `setUser`, `clearUser`, `refreshUser`

`refreshUser` also writes the same object into **React Query** (`USER_DASHBOARD_KEYS.me`), so hooks like `useCurrentUser()` stay in sync with the store.

### When to refresh or clear

| Event | What to call |
|--------|----------------|
| App first load (cookies may exist) | `AuthUserInitializer` runs `refreshUser()` once |
| After successful **login** / **register** | `await useAuthUserStore.getState().refreshUser()` (or call `refreshUser` from a hook) |
| After **logout** | `await logout()` then `useAuthUserStore.getState().clearUser()` |

### Usage in a component

```tsx
"use client";

import { useAuthUserStore } from "@/stores";
import { authUserDisplayName, authUserInitials } from "@/lib/auth-user-display";

export function Greeting() {
  const user = useAuthUserStore((s) => s.user);

  if (!user) return <p>Guest</p>;

  return (
    <p>
      Hi, {authUserDisplayName(user)} ({authUserInitials(user)})
    </p>
  );
}
```

Pick **only the slice** you need so the component re-renders less often:

```tsx
const displayName = useAuthUserStore((s) =>
  s.user ? [s.user.first_name, s.user.last_name].filter(Boolean).join(" ") || s.user.username : ""
);
```

### Outside React (e.g. mutation `onSuccess`)

```ts
import { useAuthUserStore } from "@/stores";

await useAuthUserStore.getState().refreshUser();
useAuthUserStore.getState().clearUser();
```

### Zustand basics (this project)

- **Store**: `create((set, get) => ({ ... }))` returns a hook `useAuthUserStore`.
- **Updates**: `set({ user: next })` merges into state.
- **No provider required** for the store itself (unlike Context). We still mount `AuthUserInitializer` in `app/layout.tsx` to load the session once.
- **DevTools**: optional `zustand/middleware` `devtools` — add later if you want time-travel debugging.

### Files

| File | Role |
|------|------|
| `stores/auth-user-store.ts` | Zustand store + React Query sync |
| `lib/auth-user-display.ts` | Pure helpers: display name, initials, dashboard path |
| `components/auth/AuthUserInitializer.tsx` | Client bootstrap: `refreshUser()` on load |
