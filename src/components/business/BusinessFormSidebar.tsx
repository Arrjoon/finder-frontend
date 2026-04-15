"use client";

import React, { useEffect, useMemo } from "react";
import { X, Building2, MapPin, Phone, Globe, DollarSign, Image as ImageIcon, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useForm, Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TBusinessReq, TBusinessResponse } from "@/api-services/business/business-definations";
import { useCategories } from "@/hooks/category/useCategory";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const businessSchema = z.object({
  name: z.string().min(1, "Business name is required"),
  slug: z.string().optional(),
  description: z.string().optional(),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  address: z.string().min(1, "Address is required"),
  city: z.string().optional(),
  country: z.string().optional(),
  price_range: z.string().optional(),
  cover_image: z.custom<File | undefined>().optional(),
  primary_category: z.number().int().positive({ message: "Category is required" }),
});

type BusinessFormState = z.infer<typeof businessSchema>;

const defaultValues = (): BusinessFormState => ({
  name: "",
  slug: "",
  description: "",
  phone: "",
  email: "",
  website: "",
  address: "",
  city: "Kathmandu",
  country: "Nepal",
  price_range: "Rs. 500-1000",
  cover_image: undefined,
  primary_category: 1,
});

const priceRanges = [
  "Rs. 200-500",
  "Rs. 500-1000",
  "Rs. 1000-2000",
  "Rs. 2000-5000",
  "Rs. 5000+",
];

interface BusinessFormSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  business?: TBusinessResponse | null;
  onSave: (business: TBusinessReq, coverFile?: File | null) => void | Promise<void>;
  isSaving?: boolean;
}

const BusinessFormSidebar = ({
  isOpen,
  onClose,
  business,
  onSave,
  isSaving = false,
}: BusinessFormSidebarProps) => {
  const { data: categoryList = [], isLoading: categoriesLoading } = useCategories();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BusinessFormState>({
    resolver: zodResolver(businessSchema),
    defaultValues: defaultValues(),
  });

  const sortedCategories = useMemo(
    () => [...categoryList].sort((a, b) => a.name.localeCompare(b.name)),
    [categoryList],
  );

  useEffect(() => {
    if (!isOpen) return;
    if (business) {
      reset({
        name: business.name,
        slug: business.slug,
        description: business.description ?? "",
        phone: business.phone,
        email: business.email ?? "",
        website: business.website ?? "",
        address: business.address,
        city: business.city ?? "Kathmandu",
        country: business.country ?? "Nepal",
        price_range: business.price_range ?? "Rs. 500-1000",
        cover_image: undefined,
        primary_category: business.primary_category ?? 1,
      });
    } else {
      reset(defaultValues());
    }
  }, [isOpen, business, reset]);

  const onSubmit = async (data: BusinessFormState) => {
    const cat = categoryList.find((c) => c.id === data.primary_category);
    if (!cat) return;

    const req: TBusinessReq = {
      name: data.name,
      slug: data.slug?.trim() ? data.slug : undefined,
      description: data.description?.trim() ? data.description : undefined,
      categories: [cat.slug],
      primary_category: cat.slug,
      phone: data.phone,
      email: data.email?.trim() ? data.email : undefined,
      website: data.website?.trim() ? data.website : undefined,
      address: data.address,
      city: data.city?.trim() ? data.city : undefined,
      country: data.country?.trim() ? data.country : undefined,
      price_range: data.price_range?.trim() ? data.price_range : undefined,
    };

    const coverFile = data.cover_image instanceof File ? data.cover_image : undefined;
    await onSave(req, coverFile);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[600px] lg:w-[700px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-green-600 text-white p-6 shadow-lg z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {business ? "Edit Business" : "Create New Business"}
                </h2>
                <p className="text-sm text-white/90">
                  {business ? "Update business information" : "Add a new business to the platform"}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                Basic Information
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Enter the business name"
                      className={errors.name ? "border-red-500" : ""}
                      disabled={isSaving}
                    />
                  )}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                )}
              </div>

              {!business && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug (optional)
                  </label>
                  <Controller
                    name="slug"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="auto-generated if empty"
                        className={errors.slug ? "border-red-500" : ""}
                        disabled={isSaving}
                      />
                    )}
                  />
                  {errors.slug && (
                    <p className="text-sm text-red-500 mt-1">{errors.slug.message}</p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>

                <Controller
                  name="primary_category"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value != null ? String(field.value) : ""}
                      onValueChange={(v) => field.onChange(Number(v))}
                      disabled={isSaving || categoriesLoading}
                    >
                      <SelectTrigger
                        className={errors.primary_category ? "border-red-500" : ""}
                      >
                        <SelectValue
                          placeholder={
                            categoriesLoading ? "Loading categories…" : "Select category"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {sortedCategories.map((cat) => (
                          <SelectItem key={cat.id} value={String(cat.id)}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />

                {errors.primary_category && (
                  <p className="text-sm text-red-500 mt-1">{errors.primary_category.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      placeholder="Describe your business..."
                      rows={4}
                      disabled={isSaving}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  )}
                />
                {errors.description && (
                  <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Cover image
                </label>
                <Controller
                  name="cover_image"
                  control={control}
                  render={({ field: { onChange, onBlur, name, ref } }) => (
                    <Input
                      type="file"
                      accept="image/*"
                      name={name}
                      ref={ref}
                      onBlur={onBlur}
                      onChange={(e) => onChange(e.target.files?.[0])}
                      disabled={isSaving}
                      className={errors.cover_image ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.cover_image && (
                  <p className="text-sm text-red-500 mt-1">{errors.cover_image.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Phone className="h-5 w-5 text-green-600" />
                Contact Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="tel"
                        {...field}
                        disabled={isSaving}
                        className={errors.phone ? "border-red-500" : ""}
                      />
                    )}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="email"
                        {...field}
                        disabled={isSaving}
                        className={errors.email ? "border-red-500" : ""}
                      />
                    )}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Address <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="text"
                      {...field}
                      disabled={isSaving}
                      className={errors.address ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.address && (
                  <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <Controller
                    name="city"
                    control={control}
                    render={({ field }) => (
                      <Input type="text" {...field} disabled={isSaving} />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <Controller
                    name="country"
                    control={control}
                    render={({ field }) => (
                      <Input type="text" {...field} disabled={isSaving} />
                    )}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Website
                </label>
                <Controller
                  name="website"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="url"
                      {...field}
                      disabled={isSaving}
                      className={errors.website ? "border-red-500" : ""}
                    />
                  )}
                />
                {errors.website && (
                  <p className="text-sm text-red-500 mt-1">{errors.website.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-blue-600" />
                Business Details
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <Controller
                  name="price_range"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isSaving}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {priceRanges.map((range) => (
                          <SelectItem key={range} value={range}>
                            {range}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 -mx-6 -mb-6 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-6"
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-6"
              disabled={isSaving || categoriesLoading}
            >
              <Save className="h-4 w-4 mr-2" />
              {business ? "Update Business" : "Create Business"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default BusinessFormSidebar;
