import {
    TBusinessResponse,
    TBusinessWritePayload,
    TBusinessPaginatedResponse,
} from "@/api-services/business/business-definations"
import { businessServices } from "@/api-services/business/business-services"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

const BUS_STALE_MS = 1000 * 60 * 5;
const BUS_GC_MS = 1000 * 60 * 30;

export const BUSINESS_QUERY_KEYS = {
    all: ["businesses"] as const,
    paginated: (page: number, search: string) =>
        ["businesses", "paginated", page, search] as const,
    detail: (slug: string) => ["businesses", "detail", slug] as const,
};

export const useBusiness = () =>{
    return useQuery({
        queryKey: BUSINESS_QUERY_KEYS.all,
        queryFn: businessServices.fetchBusinessList,
        staleTime: BUS_STALE_MS,
        gcTime: BUS_GC_MS,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchInterval: 1000 * 60 * 5, // 5 minutes
        refetchIntervalInBackground: false,
    })
}

export const useBusinessPaginated = (page: number, search?: string) => {
    const searchKey = search?.trim() ?? "";
    return useQuery<TBusinessPaginatedResponse>({
        queryKey: BUSINESS_QUERY_KEYS.paginated(page, searchKey),
        queryFn: () =>
            businessServices.fetchBusinessListPaginated({
                page,
                search: searchKey || undefined,
            }),
        staleTime: BUS_STALE_MS,
        gcTime: BUS_GC_MS,
        refetchOnWindowFocus: false,
        placeholderData: (prev) => prev,
    });
};

export const useCreateBusiness = () =>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            data,
            coverFile,
        }: {
            data: TBusinessWritePayload;
            coverFile?: File | null;
        }) => businessServices.createBusiness(data, coverFile),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['businesses'] })
        }
    })
}

export const useUpdateBusiness = () =>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            data,
            slug,
            coverFile,
        }: {
            data: TBusinessWritePayload;
            slug: string;
            coverFile?: File | null;
        }) => businessServices.updateBusiness(data, slug, coverFile),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["businesses"] });
            queryClient.invalidateQueries({ queryKey: ["businesses", "detail", variables.slug] });
        },
    });
}

export const useDeleteBusiness = () =>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (slug:string) => businessServices.deleteBusiness(slug),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['businesses'] })
        }
    })
}

export const useDetailBusiness = (slug: string) => {
    return useQuery<TBusinessResponse>({
        queryKey: ["businesses", "detail", slug],
        queryFn: () => businessServices.detailBusiness(slug),
        enabled: Boolean(slug),
    })
}