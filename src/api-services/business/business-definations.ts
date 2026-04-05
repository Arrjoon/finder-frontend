export interface BusinessApiDefinitions{
    fetchBusinessList:() => Promise<TBusinessResponse[]>
    createBusiness:(req:TBusinessReq) => Promise <TBusinessResponse>
    updateBusiness:(req:TBusinessUpdateReq,slug:string) => Promise <TBusinessResponse>
    deleteBusiness:(slug:string) => Promise<void>
    detailBusiness:(slug:string) => Promise<TBusinessResponse>
}

export type TBusinessResponse = {
    id: number;
    name: string;
    slug: string;
    description?: string;
    owner?: string;
    owner_username?: string;
    categories: string[];
    primary_category?: string;
    phone: string;
    email?: string;
    website?: string;
    address: string;
    city?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
    price_range?: string;
    status?: string;
}

export type TBusinessReq ={
    name: string;
    slug?: string;
    description?: string;
    owner?: string;
    owner_username?: string;
    categories: string[];
    primary_category?: string;
    phone: string;
    email?: string;
    website?: string;
    address: string;
    city?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
    price_range?: string;
    cover_image?: string;
}

export type TBusinessUpdateReq = TBusinessReq;