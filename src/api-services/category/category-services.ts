import { apiClient } from "@/api/api-client";
import {
  CategoryApiDefinitions,
  TCategoryRes,
  TUpdateCategoryReq,
  TCreateCategoryReq,
} from "./category-definations";
import {
  BASE_URL,
  CREATE_CATEGORY,
  FETCH_CATEGORIES_LIST,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
} from "@/lib/end-points";

/** Raw row from DRF (snake_case). List view may omit timestamps. */
type CategoryApiRow = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string | null;
  created_at?: string;
  updated_at?: string;
  display_order?: number;
  is_active?: boolean;
  subcategories_count?: number;
};

type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

function apiOrigin(): string {
  return BASE_URL.replace(/\/api\/?$/, "").replace(/\/$/, "") || "";
}

/** Turn relative media paths into absolute URLs for <img src>. */
export function resolveCategoryImageUrl(
  image: string | null | undefined
): string {
  if (!image) return "";
  if (typeof image === "string" && image.startsWith("http")) return image;
  const base = apiOrigin();
  const path = String(image).startsWith("/") ? String(image) : `/${image}`;
  return base ? `${base}${path}` : path;
}

function normalizeCategory(row: CategoryApiRow): TCategoryRes {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    icon: row.icon ?? "",
    description: row.description ?? "",
    image: resolveCategoryImageUrl(row.image),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    displayOrder: row.display_order,
    isActive: row.is_active,
    subcategoriesCount: row.subcategories_count,
  };
}

function unwrapListPayload(data: unknown): CategoryApiRow[] {
  if (Array.isArray(data)) return data as CategoryApiRow[];
  if (data && typeof data === "object" && "results" in data) {
    return (data as Paginated<CategoryApiRow>).results ?? [];
  }
  return [];
}

class CategoryServices implements CategoryApiDefinitions {
  async fetchCategories(): Promise<TCategoryRes[]> {
    const response = await apiClient.get<unknown>(FETCH_CATEGORIES_LIST);
    return unwrapListPayload(response.data).map(normalizeCategory);
  }

  async createCategory(req: TCreateCategoryReq): Promise<TCategoryRes> {
    const body: Record<string, unknown> = {
      name: req.name,
      description: req.description,
      icon: req.icon,
    };
    const img = req.image?.trim();
    if (img) body.image = img;

    const response = await apiClient.post<CategoryApiRow>(CREATE_CATEGORY, body);
    return normalizeCategory(response.data);
  }

  async updateCategory(req: TUpdateCategoryReq, id: number): Promise<TCategoryRes> {
    const body: Record<string, unknown> = {
      name: req.name,
      description: req.description,
      icon: req.icon,
    };
    const img = req.image?.trim();
    if (img) body.image = img;

    const response = await apiClient.patch<CategoryApiRow>(
      UPDATE_CATEGORY(id),
      body
    );
    return normalizeCategory(response.data);
  }

  async deleteCategory(id: number): Promise<void> {
    await apiClient.delete<void>(DELETE_CATEGORY(id));
  }
}

export const categoryServices = new CategoryServices();
