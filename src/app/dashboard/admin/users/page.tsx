"use client";

import React, { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import UserFormSidebar from "@/components/user/UserFormSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ListPagination } from "@/components/ui/list-pagination";
import { drfTotalPages } from "@/lib/pagination";
import { useClampPageToTotalPages } from "@/hooks/usePagination";
import {
  USER_ADMIN_PAGE_SIZE,
  useAdminUsersPaginated,
  useCreateAdminUser,
  useDeleteAdminUser,
  useUpdateAdminUser,
} from "@/hooks/admin/useAdminUsers";
import { useCurrentUser } from "@/hooks/user/useUserDashboard";
import {
  adminUserDisplayName,
  buildCreatePayload,
  buildPatchPayload,
  type TAdminUserRow,
  type UserFormValues,
} from "@/api-services/user/user-admin-definations";
import {
  User,
  Plus,
  Search,
  Edit,
  Trash2,
  Mail,
  Phone,
  Shield,
  CheckCircle2,
  XCircle,
  Ban,
  Filter,
  MessageSquare,
  Loader2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function formatError(err: unknown): string {
  if (isAxiosError(err) && err.response?.data) {
    const d = err.response.data as Record<string, unknown>;
    if (typeof d.detail === "string") return d.detail;
    const parts: string[] = [];
    for (const [k, v] of Object.entries(d)) {
      if (Array.isArray(v) && v[0] != null) parts.push(`${k}: ${String(v[0])}`);
      else if (typeof v === "string") parts.push(`${k}: ${v}`);
    }
    if (parts.length) return parts.join(" · ");
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong";
}

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<TAdminUserRow | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 350);
    return () => clearTimeout(t);
  }, [searchQuery]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, roleFilter]);

  const {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useAdminUsersPaginated(page, debouncedSearch, roleFilter, statusFilter);

  const { data: currentUser } = useCurrentUser();
  const createUser = useCreateAdminUser();
  const updateUser = useUpdateAdminUser();
  const deleteUser = useDeleteAdminUser();

  const users = data?.results ?? [];
  const totalCount = data?.count ?? 0;
  const totalPages = drfTotalPages(totalCount, USER_ADMIN_PAGE_SIZE);
  useClampPageToTotalPages(totalPages, setPage);

  const saving = createUser.isPending || updateUser.isPending;

  const handleCreate = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  const handleEdit = (row: TAdminUserRow) => {
    setEditingUser(row);
    setIsFormOpen(true);
  };

  const handleDelete = async (row: TAdminUserRow) => {
    if (!confirm(`Delete user ${adminUserDisplayName(row)}?`)) return;
    try {
      await deleteUser.mutateAsync(row.id);
      toast.success("User deleted");
    } catch (e) {
      toast.error(formatError(e));
    }
  };

  const handleSave = async (values: UserFormValues) => {
    try {
      if (editingUser) {
        await updateUser.mutateAsync({
          id: editingUser.id,
          body: buildPatchPayload(values),
        });
        toast.success("User updated");
      } else {
        await createUser.mutateAsync(buildCreatePayload(values));
        toast.success("User created");
      }
      setIsFormOpen(false);
      setEditingUser(null);
    } catch (e) {
      toast.error(formatError(e));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-600 text-white">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-gray-600 text-white">
            <XCircle className="h-3 w-3 mr-1" />
            Inactive
          </Badge>
        );
      case "suspended":
        return (
          <Badge className="bg-red-600 text-white">
            <Ban className="h-3 w-3 mr-1" />
            Suspended
          </Badge>
        );
      default:
        return null;
    }
  };

  const getRoleBadge = (role: string) => {
    const roleColors: Record<string, string> = {
      admin: "bg-blue-600",
      business: "bg-green-600",
      user: "bg-gray-600",
    };
    return (
      <Badge
        className={`${roleColors[role] ?? "bg-gray-600"} text-white`}
      >
        <Shield className="h-3 w-3 mr-1" />
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar role="admin" />
      <main className="flex-1 overflow-x-hidden">
        <DashboardHeader
          title="User management"
          subtitle="Manage all users on the platform"
        />

        <div className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">All users</h2>
              <p className="text-sm text-gray-600 mt-1">
                {isLoading && !data ? (
                  "Loading…"
                ) : (
                  <>
                    {totalCount} user{totalCount !== 1 ? "s" : ""} total
                    {isFetching ? (
                      <Loader2 className="inline h-4 w-4 ml-2 align-middle animate-spin text-gray-400" />
                    ) : null}
                  </>
                )}
              </p>
            </div>
            <Button
              onClick={handleCreate}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create user
            </Button>
          </div>

          {isError ? (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="py-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                <p className="text-sm text-red-800">
                  Could not load users. You may need admin access.
                </p>
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  Retry
                </Button>
              </CardContent>
            </Card>
          ) : null}

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by name, email, phone…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="All status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="All roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {isLoading && !data ? (
            <div className="flex justify-center py-20 text-gray-500">
              <Loader2 className="h-10 w-10 animate-spin" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((row) => {
                  const name = adminUserDisplayName(row);
                  const isSelf = currentUser?.id === row.id;
                  return (
                    <Card
                      key={row.id}
                      className="hover:shadow-lg transition-shadow"
                    >
                      <CardContent className="p-0">
                        <div className="relative bg-gradient-to-br from-blue-400 to-green-400 p-6">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              {row.photo ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={row.photo}
                                  alt={name}
                                  className="h-16 w-16 rounded-full object-cover border-4 border-white shadow-lg"
                                />
                              ) : (
                                <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white shadow-lg">
                                  <User className="h-8 w-8 text-white" />
                                </div>
                              )}
                              <div className="absolute -bottom-1 -right-1">
                                {getStatusBadge(row.status)}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold text-white mb-1 truncate">
                                {name}
                              </h3>
                              {getRoleBadge(row.role)}
                            </div>
                          </div>
                        </div>

                        <div className="p-5 space-y-3">
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                              <span className="truncate">{row.email}</span>
                            </div>
                            {row.phone ? (
                              <div className="flex items-center gap-2 text-gray-600">
                                <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                                <span>{row.phone}</span>
                              </div>
                            ) : null}
                            {row.address ? (
                              <div className="flex items-center gap-2 text-gray-600">
                                <span className="text-gray-400">📍</span>
                                <span className="truncate">{row.address}</span>
                              </div>
                            ) : null}
                          </div>

                          <div className="flex items-center gap-4 pt-3 border-t border-gray-200 flex-wrap">
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <MessageSquare className="h-4 w-4 text-blue-600" />
                              <span className="font-medium">
                                {row.review_count}
                              </span>
                              <span className="text-gray-500">reviews</span>
                            </div>
                            <div className="text-xs text-gray-500">
                              Joined{" "}
                              {new Date(row.created_at).toLocaleDateString()}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => handleEdit(row)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 disabled:opacity-40"
                              disabled={isSelf}
                              title={
                                isSelf
                                  ? "You cannot delete your own account"
                                  : undefined
                              }
                              onClick={() => handleDelete(row)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {users.length === 0 && !isLoading ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No users found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {debouncedSearch ||
                      statusFilter !== "all" ||
                      roleFilter !== "all"
                        ? "Try adjusting search or filters."
                        : "Create the first user with the button above."}
                    </p>
                    {!debouncedSearch &&
                    statusFilter === "all" &&
                    roleFilter === "all" ? (
                      <Button
                        onClick={handleCreate}
                        className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create user
                      </Button>
                    ) : null}
                  </CardContent>
                </Card>
              ) : null}

              <ListPagination
                page={page}
                totalPages={totalPages}
                hasPrevious={Boolean(data?.previous)}
                hasNext={Boolean(data?.next)}
                onPageChange={setPage}
                totalCount={totalCount}
                isFetching={isFetching}
                className="mt-4"
              />
            </>
          )}
        </div>
      </main>

      <UserFormSidebar
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingUser(null);
        }}
        user={editingUser}
        onSave={handleSave}
        isSaving={saving}
      />
    </div>
  );
}
