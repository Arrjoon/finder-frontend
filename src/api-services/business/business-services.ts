import type { InternalAxiosRequestConfig } from "axios";
import { apiClient } from "@/api/api-client";
import {
    BusinessApiDefinitions,
    TBusinessResponse,
    TBusinessWritePayload,
    TBusinessListResponse,
    TBusinessPaginatedResponse,
    businessWritePayloadToFormData,
} from "./business-definations";
import { CREATE_BUSINESS, FETCH_BUSINESS_LIST, UPDATE_BUSINESS,DELETE_BUSINESS,FETCH_BUSINESS_DETAILS } from "@/lib/end-points";

/** Instance defaults to JSON; strip Content-Type so the browser sets multipart boundary for FormData. */
function formDataRequestConfig(body: FormData): Pick<InternalAxiosRequestConfig, "transformRequest"> {
    return {
        transformRequest: [
            (data, headers) => {
                if (data instanceof FormData) {
                    if (headers && typeof headers.delete === "function") {
                        headers.delete("Content-Type");
                    }
                }
                return data;
            },
        ],
    };
}

class BusinessServices implements BusinessApiDefinitions {
    async fetchBusinessList(): Promise<TBusinessResponse[]>{
        const response = await apiClient.get<TBusinessListResponse>(FETCH_BUSINESS_LIST);
        return response.data.results
    }

    async fetchBusinessListPaginated(params: {
        page: number;
        search?: string;
    }): Promise<TBusinessPaginatedResponse> {
        const sp = new URLSearchParams();
        sp.set("page", String(Math.max(1, params.page)));
        const q = params.search?.trim();
        if (q) sp.set("search", q);
        const qs = sp.toString();
        const path = qs ? `${FETCH_BUSINESS_LIST}?${qs}` : FETCH_BUSINESS_LIST;
        const response = await apiClient.get<TBusinessListResponse>(path);
        return response.data;
    }

    async createBusiness(req: TBusinessWritePayload, coverFile?: File | null): Promise<TBusinessResponse>{
        if (coverFile) {
            const body = businessWritePayloadToFormData(req, coverFile);
            const response = await apiClient.post<TBusinessResponse>(
                CREATE_BUSINESS,
                body,
                formDataRequestConfig(body),
            );
            return response.data;
        }
        const response = await apiClient.post<TBusinessResponse>(CREATE_BUSINESS, req);
        return response.data;
    }

    async updateBusiness(req: TBusinessWritePayload, slug: string, coverFile?: File | null): Promise<TBusinessResponse>{
        if (coverFile) {
            const body = businessWritePayloadToFormData(req, coverFile);
            const response = await apiClient.put<TBusinessResponse>(
                UPDATE_BUSINESS(slug),
                body,
                formDataRequestConfig(body),
            );
            return response.data;
        }
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