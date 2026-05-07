import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";

import { userAdminServices } from "@/api-services/user/user-admin-services";
import type {
  TAdminUserCreatePayload,
  TAdminUserListResponse,
  TAdminUserPatchPayload,
  TAdminUserRow,
} from "@/api-services/user/user-admin-definations";

const STALE_MS = 1000 * 60 * 2;
const GC_MS = 1000 * 60 * 15;

export const ADMIN_USER_KEYS = {
  list: (page: number, search: string, role: string, status: string) =>
    ["admin", "users", page, search, role, status] as const,
};

/** Must match `AdminUserPagination.page_size` in `accounts/admin_views.py`. */
export const USER_ADMIN_PAGE_SIZE = 9;

export function useAdminUsersPaginated(
  page: number,
  search?: string,
  role?: string,
  status?: string
) {
  const searchKey = search?.trim() ?? "";
  const roleKey = role ?? "all";
  const statusKey = status ?? "all";

  return useQuery<TAdminUserListResponse>({
    queryKey: ADMIN_USER_KEYS.list(page, searchKey, roleKey, statusKey),
    queryFn: () =>
      userAdminServices.fetchUsersPaginated({
        page,
        search: searchKey || undefined,
        role: roleKey,
        status: statusKey,
      }),
    staleTime: STALE_MS,
    gcTime: GC_MS,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  });
}

export function useCreateAdminUser(): UseMutationResult<
  TAdminUserRow,
  Error,
  TAdminUserCreatePayload
> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: TAdminUserCreatePayload) =>
      userAdminServices.createUser(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

export function useUpdateAdminUser(): UseMutationResult<
  TAdminUserRow,
  Error,
  { id: number; body: TAdminUserPatchPayload }
> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: TAdminUserPatchPayload }) =>
      userAdminServices.updateUser(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

export function useDeleteAdminUser(): UseMutationResult<void, Error, number> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => userAdminServices.deleteUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}
