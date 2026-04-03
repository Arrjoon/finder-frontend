export interface CategoryApiDefinitions {
    fetchCategories:() => Promise<TCategoryRes[]>;
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
    image: string;
}

export type TCreateCategoryReq = {
    name: string;
    slug: string;
    icon: string;
    description: string;
    image: string;
}

export type TUpdateCategoryReq = TCreateCategoryReq;