"use client";

import React, { useState, useEffect, useMemo } from "react";
import { X, Building2, MapPin, Phone, Globe, DollarSign, Image as ImageIcon, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TBusinessReq, TBusinessResponse } from "@/api-services/business/business-definations";
import { useCategories } from "@/hooks/category/useCategory";

type FormState = {
  name: string;
  slug: string;
  description: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  city: string;
  country: string;
  price_range: string;
  cover_image: string;
  primary_category_slug: string;
};

const emptyForm = (): FormState => ({
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
  cover_image: "",
  primary_category_slug: "",
});

function resolvePrimaryCategorySlug(
  business: TBusinessResponse,
  categoryList: { id: number; slug: string; name: string }[],
): string {
  if (business.primary_category != null) {
    const byId = categoryList.find((c) => c.id === business.primary_category);
    if (byId) return byId.slug;
  }
  const raw = business.categories ?? [];
  for (const item of raw) {
    if (typeof item === "number") {
      const byId = categoryList.find((c) => c.id === item);
      if (byId) return byId.slug;
    } else if (typeof item === "string") {
      if (categoryList.some((c) => c.slug === item)) return item;
      if (/^\d+$/.test(item)) {
        const byId = categoryList.find((c) => c.id === Number(item));
        if (byId) return byId.slug;
      }
    }
  }
  if (business.primary_category_name) {
    const byName = categoryList.find((c) => c.name === business.primary_category_name);
    if (byName) return byName.slug;
  }
  return "";
}

interface BusinessFormSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  business?: TBusinessResponse | null;
  onSave: (business: TBusinessReq) => void | Promise<void>;
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

  const [formData, setFormData] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const sortedCategories = useMemo(
    () => [...categoryList].sort((a, b) => a.name.localeCompare(b.name)),
    [categoryList],
  );

  useEffect(() => {
    if (business) {
      setFormData({
        name: business.name || "",
        slug: business.slug || "",
        description: business.description || "",
        phone: business.phone || "",
        email: business.email || "",
        website: business.website || "",
        address: business.address || "",
        city: business.city || "Kathmandu",
        country: business.country || "Nepal",
        price_range: business.price_range || "Rs. 500-1000",
        cover_image: business.cover_image || "",
        primary_category_slug: resolvePrimaryCategorySlug(business, categoryList),
      });
    } else {
      setFormData(emptyForm());
    }
    setErrors({});
  }, [business, isOpen, categoryList]);

  const handleChange = (field: keyof FormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) newErrors.name = "Business name is required";
    if (!formData.primary_category_slug) {
      newErrors.primary_category_slug = "Category is required";
    }
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isSaving) return;

    const slug = formData.slug.trim();
    const req: TBusinessReq = {
      name: formData.name.trim(),
      ...(slug ? { slug } : {}),
      description: formData.description.trim() || undefined,
      phone: formData.phone.trim(),
      email: formData.email.trim() || undefined,
      website: formData.website.trim() || undefined,
      address: formData.address.trim(),
      city: formData.city.trim() || undefined,
      country: formData.country.trim() || undefined,
      price_range: formData.price_range || undefined,
      cover_image: formData.cover_image.trim() || undefined,
      categories: [formData.primary_category_slug],
      primary_category: formData.primary_category_slug,
    };

    await onSave(req);
    onClose();
  };

  const priceRanges = [
    "Rs. 200-500",
    "Rs. 500-1000",
    "Rs. 1000-2000",
    "Rs. 2000-5000",
    "Rs. 5000+",
  ];

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

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Enter business name"
                  className={errors.name ? "border-red-500" : ""}
                  disabled={isSaving}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              {!business && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug (optional)
                  </label>
                  <Input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleChange("slug", e.target.value)}
                    placeholder="auto-generated if empty"
                    disabled={isSaving}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.primary_category_slug}
                  onValueChange={(value) => handleChange("primary_category_slug", value)}
                  disabled={isSaving || categoriesLoading}
                >
                  <SelectTrigger
                    className={errors.primary_category_slug ? "border-red-500" : ""}
                  >
                    <SelectValue
                      placeholder={categoriesLoading ? "Loading categories…" : "Select category"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {sortedCategories.map((cat) => (
                      <SelectItem key={cat.slug} value={cat.slug}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.primary_category_slug && (
                  <p className="text-sm text-red-500 mt-1">{errors.primary_category_slug}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Describe your business..."
                  rows={4}
                  disabled={isSaving}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Cover image URL
                </label>
                <Input
                  type="url"
                  value={formData.cover_image}
                  onChange={(e) => handleChange("cover_image", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  disabled={isSaving}
                />
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
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="+977 1-4412345"
                    className={errors.phone ? "border-red-500" : ""}
                    disabled={isSaving}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="business@example.com"
                    className={errors.email ? "border-red-500" : ""}
                    disabled={isSaving}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Address <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder="Street address"
                  className={errors.address ? "border-red-500" : ""}
                  disabled={isSaving}
                />
                {errors.address && (
                  <p className="text-sm text-red-500 mt-1">{errors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <Input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    placeholder="Kathmandu"
                    disabled={isSaving}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <Input
                    type="text"
                    value={formData.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                    placeholder="Nepal"
                    disabled={isSaving}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Website
                </label>
                <Input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleChange("website", e.target.value)}
                  placeholder="https://example.com"
                  disabled={isSaving}
                />
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
                <Select
                  value={formData.price_range}
                  onValueChange={(value) => handleChange("price_range", value)}
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
