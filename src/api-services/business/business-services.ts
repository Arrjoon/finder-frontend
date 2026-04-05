import { apiClient } from "@/api/api-client";
import { BusinessApiDefinitions, TBusinessResponse, TBusinessWritePayload, TBusinessListResponse } from "./business-definations";
import { CREATE_BUSINESS, FETCH_BUSINESS_LIST, UPDATE_BUSINESS,DELETE_BUSINESS,FETCH_BUSINESS_DETAILS } from "@/lib/end-points";


class BusinessServices implements BusinessApiDefinitions {
    async fetchBusinessList(): Promise<TBusinessResponse[]>{
        const response = await apiClient.get<TBusinessListResponse>(FETCH_BUSINESS_LIST);
        return response.data.results;

    }
    async createBusiness(req: TBusinessWritePayload): Promise<TBusinessResponse>{
        const response = await apiClient.post<TBusinessResponse>(CREATE_BUSINESS, req);
        return response.data;
    }

    async updateBusiness(req: TBusinessWritePayload,slug:string): Promise<TBusinessResponse>{
        const response = await apiClient.put<TBusinessResponse>(UPDATE_BUSINESS(slug), req);
        return response.data;
    }
    async deleteBusiness(slug:string): Promise<void>{
        await apiClient.delete<void>(DELETE_BUSINESS(slug));
    }
    async detailBusiness(slug:string): Promise<TBusinessResponse>{
        const response = await apiClient.get<TBusinessResponse>(FETCH_BUSINESS_DETAILS(slug));
        return response.data;
    }
}

export const businessServices = new BusinessServices();