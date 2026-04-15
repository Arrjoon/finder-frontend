import type { TCategoryRes } from "@/api-services/category/category-definations";

export interface BusinessApiDefinitions{
    fetchBusinessList:() => Promise<TBusinessResponse[]>
    createBusiness:(req:TBusinessWritePayload) => Promise <TBusinessResponse>
    updateBusiness:(req:TBusinessWritePayload,slug:string) => Promise <TBusinessResponse>
    deleteBusiness:(slug:string) => Promise<void>
    detailBusiness:(slug:string) => Promise<TBusinessResponse>
}

export type TBusinessListResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: TBusinessResponse[];
  };

export type TBusinessResponse = {
    id: number;
    name: string;
    slug: string;
    description?: string;
    owner?: string;
    owner_username?: string;
    /** Present on detail; list may omit. Values may be slug strings or PKs depending on endpoint. */
    categories?: (string | number)[];
    primary_category?: number | null;
    primary_category_name?: string;
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
    rating?: number;
    review_count?: number;
    cover_image?: string;
}

export type TBusinessReq ={
    name: string;
    slug?: string;
    description?: string;
    owner?: string;
    owner_username?: string;
    /** Category slugs (resolved to PKs before API). */
    categories: string[];
    /** Primary category slug (resolved to PK before API). */
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
    rating?:number;
}

/** Body sent to Django REST (PrimaryKeyRelatedField for categories / primary_category). */
export type TBusinessWritePayload = Omit<TBusinessReq, "categories" | "primary_category"> & {
    categories: number[];
    primary_category?: number | null;
};

export type TBusinessUpdateReq = TBusinessReq;

/**
 * Maps form request (category slugs) to API payload (category PKs).
 */
export function mapBusinessReqToWritePayload(
    req: TBusinessReq,
    categoryList: TCategoryRes[],
): TBusinessWritePayload {
    const slugToId = new Map(categoryList.map((c) => [c.slug, c.id] as const));
    const categories = req.categories
        .map((slug) => slugToId.get(slug))
        .filter((id): id is number => id != null);
    let primary: number | null | undefined;
    if (req.primary_category != null) {
        primary = slugToId.get(req.primary_category) ?? null;
    } else if (categories.length > 0) {
        primary = categories[0];
    }
    return {
        ...req,
        categories,
        primary_category: primary,
    };
}

/**
 * Builds multipart/form-data for create/update when uploading `cover_image` as a file.
 * DRF expects repeated `categories` keys for many-to-many PKs.
 */
export function businessWritePayloadToFormData(
    payload: TBusinessWritePayload,
    coverFile?: File | null,
): FormData {
    const fd = new FormData();
    fd.append("name", payload.name);
    if (payload.slug != null && payload.slug !== "") {
        fd.append("slug", payload.slug);
    }
    if (payload.description != null && payload.description !== "") {
        fd.append("description", payload.description);
    }
    for (const id of payload.categories) {
        fd.append("categories", String(id));
    }
    if (payload.primary_category != null) {
        fd.append("primary_category", String(payload.primary_category));
    }
    fd.append("phone", payload.phone);
    if (payload.email != null && payload.email !== "") {
        fd.append("email", payload.email);
    }
    if (payload.website != null && payload.website !== "") {
        fd.append("website", payload.website);
    }
    fd.append("address", payload.address);
    if (payload.city != null && payload.city !== "") {
        fd.append("city", payload.city);
    }
    if (payload.country != null && payload.country !== "") {
        fd.append("country", payload.country);
    }
    if (payload.latitude != null) {
        fd.append("latitude", String(payload.latitude));
    }
    if (payload.longitude != null) {
        fd.append("longitude", String(payload.longitude));
    }
    if (payload.price_range != null && payload.price_range !== "") {
        fd.append("price_range", payload.price_range);
    }
    if (payload.rating != null) {
        fd.append("rating", String(payload.rating));
    }
    if (coverFile) {
        fd.append("cover_image", coverFile);
    }
    return fd;
}