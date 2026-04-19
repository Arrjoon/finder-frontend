export type TCategoriesPaginatedResponse = {
  results: TCategoryRes[];
  count: number;
  next: string | null;
  previous: string | null;
};

export interface CategoryApiDefinitions {
  fetchCategories: () => Promise<TCategoryRes[]>;
  fetchCategoriesPaginated: (params: {
    page: number;
    search?: string;
  }) => Promise<TCategoriesPaginatedResponse>;
  createCategory: (req: TCreateCategoryReq) => Promise<TCategoryRes>;
  updateCategory: (req: TUpdateCategoryReq, id: number) => Promise<TCategoryRes>;
  deleteCategory: (id: number) => Promise<void>;
}

export type TCategoryRes = {
    id: number;
    name: string;
    slug: string;
    icon: string;
    description: string;
    /** Resolved URL safe for <img src> (may be empty). */
    image: string;
    createdAt?: string;
    updatedAt?: string;
    displayOrder?: number;
    isActive?: boolean;
    subcategoriesCount?: number;
}

export type TCreateCategoryReq = {
    name: string;
    /** Sent for typing convenience; Django may ignore (slug is auto from name). */
    slug?: string;
    icon: string;
    description: string;
    /** Omit when empty; backend uses ImageField (file upload), not remote URLs. */
    image?: string;
}

export type TUpdateCategoryReq = TCreateCategoryReq;