"use client";

import React, { useState } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import CategoryFormSidebar from "@/components/category/CategoryFormSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Layers,
  Plus,
  Search,
  Edit,
  Trash2,
  Copy,
  Calendar,
} from "lucide-react";

interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

const mockCategories: Category[] = [
  {
    id: 1,
    name: "Electronics",
    description: "Devices, accessories, and consumer electronics.",
    image:
      "https://images.unsplash.com/photo-1498049794561-8590a29e0a76?w=400",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-28",
  },
  {
    id: 2,
    name: "Home & Garden",
    description: "Furniture, décor, and outdoor living.",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
    createdAt: "2024-02-15",
    updatedAt: "2024-01-25",
  },
  {
    id: 3,
    name: "Fashion",
    description: "Clothing, footwear, and accessories.",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400",
    createdAt: "2024-03-01",
    updatedAt: "2024-01-27",
  },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");

  const handleCreate = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      setCategories(categories.filter((c) => c.id !== id));
    }
  };

  const handleDuplicate = (category: Category) => {
    const nextId = Math.max(0, ...categories.map((c) => c.id)) + 1;
    const today = new Date().toISOString().split("T")[0];
    const copy: Category = {
      ...category,
      id: nextId,
      name: `${category.name} (copy)`,
      createdAt: today,
      updatedAt: today,
    };
    setCategories([...categories, copy]);
  };

  const handleSave = (data: {
    name: string;
    description: string;
    image: string;
    createdAt: string;
    updatedAt: string;
  }) => {
    const defaultImage =
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400";
    if (editingCategory) {
      setCategories(
        categories.map((c) =>
          c.id === editingCategory.id
            ? {
                ...c,
                ...data,
                image: data.image || c.image || defaultImage,
                id: editingCategory.id,
              }
            : c
        )
      );
    } else {
      const newCategory: Category = {
        ...data,
        id: Math.max(0, ...categories.map((c) => c.id)) + 1,
        image: data.image || defaultImage,
      };
      setCategories([...categories, newCategory]);
    }
    setIsFormOpen(false);
    setEditingCategory(null);
  };

  const filteredCategories = categories.filter((cat) => {
    const q = searchQuery.toLowerCase();
    return (
      cat.name.toLowerCase().includes(q) ||
      cat.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar role="admin" />
      <main className="flex-1 overflow-x-hidden">
        <DashboardHeader
          title="Category Management"
          subtitle="Manage all categories on the platform"
        />

        <div className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                All Categories
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {filteredCategories.length} categor
                {filteredCategories.length !== 1 ? "ies" : "y"} found
              </p>
            </div>
            <Button
              onClick={handleCreate}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Category
            </Button>
          </div>

          <Card>
            <CardContent className="pt-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search categories by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <Card
                key={category.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-0">
                  <div className="relative bg-gradient-to-br from-blue-400 to-green-400 p-6">
                    <div className="flex items-center gap-4">
                      <div className="relative shrink-0">
                        {category.image ? (
                          <img
                            src={category.image}
                            alt=""
                            className="h-16 w-16 rounded-xl object-cover border-4 border-white shadow-lg"
                          />
                        ) : (
                          <div className="h-16 w-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white shadow-lg">
                            <Layers className="h-8 w-8 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-white mb-1 truncate">
                          {category.name}
                        </h3>
                        <p className="text-sm text-white/90 line-clamp-2">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
                      <span>
                        Updated{" "}
                        {new Date(category.updatedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleEdit(category)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="shrink-0"
                        onClick={() => handleDuplicate(category)}
                        title="Duplicate"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0"
                        onClick={() => handleDelete(category.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Layers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No categories found
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery
                    ? "Try adjusting your search"
                    : "Get started by creating your first category"}
                </p>
                {!searchQuery && (
                  <Button
                    onClick={handleCreate}
                    className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Category
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <CategoryFormSidebar
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingCategory(null);
        }}
        category={editingCategory}
        onSave={handleSave}
      />
    </div>
  );
}
