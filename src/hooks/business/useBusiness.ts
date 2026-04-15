import {
    TBusinessResponse,
    TBusinessWritePayload,
} from "@/api-services/business/business-definations"
import { businessServices } from "@/api-services/business/business-services"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useBusiness = () =>{
    return useQuery({
        queryKey: ['businesses'],
        queryFn: businessServices.fetchBusinessList,
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 30, // 30 minutes
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchInterval: 1000 * 60 * 5, // 5 minutes
        refetchIntervalInBackground: false,
    })
}

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