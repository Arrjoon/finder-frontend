"use client";

import React, { useEffect, useState } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import CategoryFormSidebar, {
  CategoryData,
} from "@/components/category/CategoryFormSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Layers,
  Plus,
  Search,
  Edit,
  Trash2,
  Copy,
  Calendar,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  useCategoriesPaginated,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/category/useCategory";
import { TCategoryRes } from "@/api-services/category/category-definations";
import { toast } from "sonner";

const DEFAULT_CATEGORY_ICON = "layers";

function toFormCategory(c: TCategoryRes): CategoryData {
  return {
    id: c.id,
    name: c.name,
    description: c.description,
    image: c.image,
    createdAt: c.createdAt ?? "",
    updatedAt: c.updatedAt ?? "",
  };
}

function categoryRowLabel(c: TCategoryRes): string {
  return c.updatedAt ?? c.createdAt ?? "";
}

export default function CategoriesPage() {
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

  const { data, isLoading, isError, error, refetch, isFetching } =
    useCategoriesPaginated(page, debouncedSearch);
  const categories = data?.results ?? [];
  const totalCount = data?.count ?? 0;
  const hasPrev = Boolean(data?.previous);
  const hasNext = Boolean(data?.next);

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TCategoryRes | null>(
    null
  );

  const mutating =
    createCategory.isPending ||
    updateCategory.isPending ||
    deleteCategory.isPending;

  const handleCreate = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const handleEdit = (category: TCategoryRes) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteCategory.mutateAsync(id);
      toast.success("Category deleted");
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Could not delete category"
      );
    }
  };

  const handleDuplicate = async (category: TCategoryRes) => {
    try {
      await createCategory.mutateAsync({
        name: `${category.name} (copy)`,
        description: category.description,
        icon: category.icon || DEFAULT_CATEGORY_ICON,
        image: category.image || "",
      });
      toast.success("Category duplicated");
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Could not duplicate category"
      );
    }
  };

  const handleSave = async (data: Omit<CategoryData, "id">) => {
    const trimmed = data.image.trim();
    const imagePayload = trimmed || editingCategory?.image?.trim() || undefined;

    try {
      if (editingCategory) {
        await updateCategory.mutateAsync({
          id: editingCategory.id,
          data: {
            name: data.name,
            description: data.description,
            icon: editingCategory.icon || DEFAULT_CATEGORY_ICON,
            ...(imagePayload ? { image: imagePayload } : {}),
          },
        });
        toast.success("Category updated");
      } else {
        await createCategory.mutateAsync({
          name: data.name,
          description: data.description,
          icon: DEFAULT_CATEGORY_ICON,
          ...(imagePayload ? { image: imagePayload } : {}),
        });
        toast.success("Category created");
      }
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Something went wrong"
      );
      throw e;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar role="admin" />
      <main className="flex-1 overflow-x-hidden">
        <DashboardHeader
          title="Category Management"
          subtitle="Manage all categories on the platform"
        />

        <div className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                All Categories
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {isLoading
                  ? "Loading…"
                  : `${totalCount} categor${totalCount !== 1 ? "ies" : "y"}${
                      debouncedSearch ? " matching search" : ""
                    }`}
              </p>
            </div>
            <Button
              onClick={handleCreate}
              disabled={mutating || isLoading}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
            >
              {mutating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Create Category
            </Button>
          </div>

          <Card>
            <CardContent className="pt-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search categories by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>

          {isError && (
            <Card className="border-red-200 bg-red-50/80">
              <CardContent className="py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="text-sm text-red-800">
                  {error instanceof Error
                    ? error.message
                    : "Failed to load categories."}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  className="shrink-0 border-red-300 text-red-900 hover:bg-red-100"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </CardContent>
            </Card>
          )}

          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden animate-pulse">
                  <div className="h-36 bg-gradient-to-br from-gray-200 to-gray-300" />
                  <CardContent className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                    <div className="h-8 bg-gray-100 rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!isLoading && !isError && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Card
                  key={category.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-0">
                    <div className="relative bg-gradient-to-br from-blue-400 to-green-400 p-6">
                      <div className="flex items-center gap-4">
                        <div className="relative shrink-0">
                          {category.image ? (
                            <img
                              src={category.image}
                              alt=""
                              className="h-16 w-16 rounded-xl object-cover border-4 border-white shadow-lg"
                            />
                          ) : (
                            <div className="h-16 w-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white shadow-lg">
                              <Layers className="h-8 w-8 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-white mb-1 truncate">
                            {category.name}
                          </h3>
                          <p className="text-sm text-white/90 line-clamp-2">
                            {category.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
                        <span>
                          {categoryRowLabel(category) ? (
                            <>
                              Updated{" "}
                              {new Date(
                                categoryRowLabel(category)
                              ).toLocaleDateString()}
                            </>
                          ) : (
                            "Recently updated"
                          )}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleEdit(category)}
                          disabled={mutating}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="shrink-0"
                          onClick={() => handleDuplicate(category)}
                          disabled={mutating}
                          title="Duplicate"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0"
                          onClick={() => handleDelete(category.id)}
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
          )}

          {!isLoading && !isError && categories.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
              <p className="text-sm text-gray-600">
                Page {page}
                {isFetching && !isLoading ? (
                  <Loader2 className="inline h-4 w-4 ml-2 animate-spin text-gray-400" />
                ) : null}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!hasPrev || mutating}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!hasNext || mutating}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {!isLoading && !isError && categories.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Layers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No categories found
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery
                    ? "Try adjusting your search"
                    : "Get started by creating your first category"}
                </p>
                {!searchQuery && (
                  <Button
                    onClick={handleCreate}
                    disabled={mutating}
                    className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Category
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <CategoryFormSidebar
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingCategory(null);
        }}
        category={
          editingCategory ? toFormCategory(editingCategory) : undefined
        }
        onSave={handleSave}
      />
    </div>
  );
}
