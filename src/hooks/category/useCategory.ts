import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryServices } from "@/api-services/category/category-services";
import {
  TCreateCategoryReq,
  TUpdateCategoryReq,
  TCategoryRes,
  TCategoriesPaginatedResponse,
} from "@/api-services/category/category-definations";

/** List cache: fewer refetches → lower server load; data still refreshes after mutations. */
const CATEGORIES_STALE_MS = 5 * 60 * 1000;
const CATEGORIES_GC_MS = 30 * 60 * 1000;

/**
 *  Query Keys (important for caching)
 */
export const CATEGORY_QUERY_KEYS = {
  all: ["categories"] as const,
  paginated: (page: number, search: string) =>
    ["categories", "paginated", page, search] as const,
  detail: (id: number) => ["category", id] as const,
};

/**
 *  Fetch Categories
 */
export const useCategories = () => {
  return useQuery<TCategoryRes[]>({
    queryKey: CATEGORY_QUERY_KEYS.all,
    queryFn: categoryServices.fetchCategories,
    staleTime: CATEGORIES_STALE_MS,
    gcTime: CATEGORIES_GC_MS,
    refetchOnWindowFocus: false,
  });
};

/**
 * Admin list: one page per request; matches DRF `?page=` and `?search=`.
 */
export const useCategoriesPaginated = (
  page: number,
  search?: string
) => {
  const searchKey = search?.trim() ?? "";
  return useQuery<TCategoriesPaginatedResponse>({
    queryKey: CATEGORY_QUERY_KEYS.paginated(page, searchKey),
    queryFn: () =>
      categoryServices.fetchCategoriesPaginated({
        page,
        search: searchKey || undefined,
      }),
    staleTime: CATEGORIES_STALE_MS,
    gcTime: CATEGORIES_GC_MS,
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,
  });
};

/**
 *  Create Category
 */
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TCreateCategoryReq) =>
      categoryServices.createCategory(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CATEGORY_QUERY_KEYS.all,
      });
    },
  });
};

/**
 *  Update Category
 */
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: TUpdateCategoryReq;
    }) => categoryServices.updateCategory(data, id),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: CATEGORY_QUERY_KEYS.all,
      });

      queryClient.invalidateQueries({
        queryKey: CATEGORY_QUERY_KEYS.detail(variables.id),
      });
    },
  });
};

/**
 *  Delete Category
 */
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => categoryServices.deleteCategory(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CATEGORY_QUERY_KEYS.all,
      });
    },
  });
};
