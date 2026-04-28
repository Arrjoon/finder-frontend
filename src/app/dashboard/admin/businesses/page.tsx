"use client";

import React, { useEffect, useMemo, useState } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import BusinessFormSidebar from "@/components/business/BusinessFormSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ListPagination } from "@/components/ui/list-pagination";
import { drfTotalPages } from "@/lib/pagination";
import { useClampPageToTotalPages } from "@/hooks/usePagination";
import {
  Building2,
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  Filter,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useBusinessPaginated,
  useCreateBusiness,
  useUpdateBusiness,
  useDeleteBusiness,
} from "@/hooks/business/useBusiness";
import {
  TBusinessReq,
  TBusinessResponse,
  mapBusinessReqToWritePayload,
} from "@/api-services/business/business-definations";
import { useCategories } from "@/hooks/category/useCategory";

/** Must match `BusinessPagination.page_size` in `django-finder-backend/businesses/views.py`. */
const BUSINESS_LIST_PAGE_SIZE = 3;

export default function BusinessesPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 350);
    return () => clearTimeout(t);
  }, [searchQuery]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useBusinessPaginated(page, debouncedSearch);
  const businesses = data?.results ?? [];
  const totalCount = data?.count ?? 0;
  const hasPrev = Boolean(data?.previous);
  const hasNext = Boolean(data?.next);
  const totalPages = drfTotalPages(totalCount, BUSINESS_LIST_PAGE_SIZE);

  useClampPageToTotalPages(totalPages, setPage);

  const { data: categoryList = [] } = useCategories();
  const createBusiness = useCreateBusiness();
  const updateBusiness = useUpdateBusiness();
  const deleteBusiness = useDeleteBusiness();

  const mutating =
    createBusiness.isPending ||
    updateBusiness.isPending ||
    deleteBusiness.isPending;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<TBusinessResponse | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  useEffect(() => {
    setPage(1);
  }, [statusFilter, categoryFilter]);

  const handleCreate = () => {
    setEditingBusiness(null);
    setIsFormOpen(true);
  };

  const handleEdit = (business: TBusinessResponse) => {
    setEditingBusiness(business);
    setIsFormOpen(true);
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this business?")) return;
    try {
      await deleteBusiness.mutateAsync(slug);
    } catch {
      /* Error surfaced via mutation state if needed */
    }
  };

  const handleSave = async (req: TBusinessReq, coverFile?: File | null) => {
    const payload = mapBusinessReqToWritePayload(req, categoryList);
    if (editingBusiness) {
      await updateBusiness.mutateAsync({
        data: payload,
        slug: editingBusiness.slug,
        coverFile,
      });
    } else {
      await createBusiness.mutateAsync({ data: payload, coverFile });
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
      case "pending":
        return (
          <Badge className="bg-yellow-600 text-white">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-red-600 text-white">
            <XCircle className="h-3 w-3 mr-1" />
            Inactive
          </Badge>
        );
      default:
        return null;
    }
  };

  /** Search is server-side (`?search=`). Status/category narrow the current page only until the API supports those query params. */
  const filteredBusinesses = businesses.filter((business) => {
    const matchesStatus = statusFilter === "all" || business.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || business.primary_category_name === categoryFilter;
    return matchesStatus && matchesCategory;
  });

  const categoryFilterOptions = useMemo(() => {
    return [...categoryList]
      .map((c) => c.name)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
  }, [categoryList]);

  const pageFilterActive = statusFilter !== "all" || categoryFilter !== "all";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <DashboardSidebar role="admin" />
        <main className="flex-1 overflow-x-hidden flex items-center justify-center p-8">
          <div className="text-center space-y-3">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            <p className="text-gray-600">Loading businesses…</p>
          </div>
        </main>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <DashboardSidebar role="admin" />
        <main className="flex-1 overflow-x-hidden flex items-center justify-center p-8">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6 text-center space-y-4">
              <p className="text-red-600">
                {error instanceof Error ? error.message : "Failed to load businesses."}
              </p>
              <Button type="button" onClick={() => refetch()}>
                Try again
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar role="admin" />
      <main className="flex-1 overflow-x-hidden">
        <DashboardHeader
          title="Business Management"
          subtitle="Manage all businesses on the platform"
        />

        <div className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">All Businesses</h2>
              <p className="text-sm text-gray-600 mt-1">
                {isLoading
                  ? "Loading…"
                  : `${totalCount} business${totalCount !== 1 ? "es" : ""}${
                      debouncedSearch ? " matching search" : ""
                    }`}
                {pageFilterActive && !isLoading ? (
                  <span className="block text-xs text-gray-500 mt-0.5">
                    {filteredBusinesses.length} on this page after status/category filters
                  </span>
                ) : null}
              </p>
            </div>
            <Button
              onClick={handleCreate}
              disabled={mutating}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Business
            </Button>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search name, description, city, address…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    disabled={mutating || isLoading}
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter} disabled={mutating}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter} disabled={mutating}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categoryFilterOptions.map((name) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses.map((business) => (
              <Card key={business.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative h-48 bg-gradient-to-br from-blue-400 to-green-400 overflow-hidden">
                    {business.cover_image ? (
                      <img
                        src={business.cover_image}
                        alt={business.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Building2 className="h-16 w-16 text-white/50" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      {getStatusBadge(business?.status || "pending")}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{business.name}</h3>
                      {business.primary_category_name ? (
                        <Badge variant="outline" className="text-xs">
                          {business.primary_category_name}
                        </Badge>
                      ) : null}
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        <span>{business.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">📞</span>
                        <span>{business.phone}</span>
                      </div>
                      {business.rating ? (
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-500">⭐</span>
                          <span>
                            {business.rating} (
                            {business.review_count ? business.review_count : 0} reviews)
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">No rating</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleEdit(business)}
                        disabled={mutating}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(business.slug)}
                        disabled={mutating}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {!isLoading && !isError && totalCount > 0 && (
            <ListPagination
              page={page}
              totalPages={totalPages}
              totalCount={totalCount}
              hasPrevious={hasPrev}
              hasNext={hasNext}
              onPageChange={setPage}
              disabled={mutating}
              isFetching={isFetching && !isLoading}
            />
          )}

          {!isLoading && !isError && filteredBusinesses.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No businesses found</h3>
                <p className="text-gray-600 mb-4">
                  {businesses.length > 0 && pageFilterActive
                    ? "Nothing on this page matches status/category filters — try another page or clear filters."
                    : totalCount === 0 && !debouncedSearch
                      ? "Get started by creating your first business"
                      : "Try adjusting your search or filters"}
                </p>
                {!debouncedSearch &&
                  statusFilter === "all" &&
                  categoryFilter === "all" &&
                  totalCount === 0 && (
                  <Button
                    onClick={handleCreate}
                    disabled={mutating}
                    className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Business
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <BusinessFormSidebar
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingBusiness(null);
        }}
        business={editingBusiness}
        onSave={handleSave}
        isSaving={mutating}
      />
    </div>
  );
}
