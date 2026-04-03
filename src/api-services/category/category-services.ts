import { apiClient } from "@/api/api-client";
import { CategoryApiDefinitions, TCategoryRes, TUpdateCategoryReq, TCreateCategoryReq } from "./category-definations";
import { CREATE_CATEGORY, FETCH_CATEGORIES_LIST,UPDATE_CATEGORY,DELETE_CATEGORY } from "@/lib/end-points";


class CategoryServices implements CategoryApiDefinitions {
    async fetchCategories(): Promise<TCategoryRes[]> {
        const response = await apiClient.get<TCategoryRes[]>(FETCH_CATEGORIES_LIST);
        return response.data;
    }
    async createCategory(req: TCreateCategoryReq): Promise<TCategoryRes> {
        const response = await apiClient.post<TCategoryRes>(CREATE_CATEGORY, req);
        return response.data;
    }
    async updateCategory(req: TUpdateCategoryReq, id: number): Promise<TCategoryRes> {
        const response = await apiClient.patch<TCategoryRes>(UPDATE_CATEGORY(id), req);
        return response.data;
    }
    async deleteCategory(id: number): Promise<void> {
        await apiClient.delete<void>(DELETE_CATEGORY(id));
    }
}

export const categoryServices = new CategoryServices();