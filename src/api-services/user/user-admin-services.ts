import { apiClient } from "@/api/api-client";
import { ADMIN_USER_DETAIL, ADMIN_USERS_LIST } from "@/lib/end-points";
import type {
  TAdminUserListResponse,
  TAdminUserRow,
  TAdminUserCreatePayload,
  TAdminUserPatchPayload,
} from "./user-admin-definations";

function withListParams(params: {
  page: number;
  search?: string;
  role?: string;
  status?: string;
}): string {
  const sp = new URLSearchParams();
  sp.set("page", String(Math.max(1, params.page)));
  const q = params.search?.trim();
  if (q) sp.set("search", q);
  if (params.role && params.role !== "all") sp.set("role", params.role);
  if (params.status && params.status !== "all") sp.set("status", params.status);
  return `${ADMIN_USERS_LIST}?${sp.toString()}`;
}

class UserAdminServices {
  async fetchUsersPaginated(params: {
    page: number;
    search?: string;
    role?: string;
    status?: string;
  }): Promise<TAdminUserListResponse> {
    const response = await apiClient.get<TAdminUserListResponse>(
      withListParams(params)
    );
    return response.data;
  }

  async createUser(body: TAdminUserCreatePayload): Promise<TAdminUserRow> {
    const response = await apiClient.post<TAdminUserRow>(ADMIN_USERS_LIST, body);
    return response.data;
  }

  async updateUser(
    id: number,
    body: TAdminUserPatchPayload
  ): Promise<TAdminUserRow> {
    const response = await apiClient.patch<TAdminUserRow>(
      ADMIN_USER_DETAIL(id),
      body
    );
    return response.data;
  }

  async deleteUser(id: number): Promise<void> {
    await apiClient.delete<void>(ADMIN_USER_DETAIL(id));
  }
}

export const userAdminServices = new UserAdminServices();
