"use client";

import React, { useState, useEffect } from "react";
import { Search, MapPin, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Category {
  name: string;
  subcategories: string[];
}

const categories: Category[] = [
  {
    name: "Restaurants",
    subcategories: ["Fine Dining", "Casual Dining", "Fast Food", "Cafes", "Bars & Pubs", "Food Trucks"]
  },
  {
    name: "Shopping",
    subcategories: ["Fashion", "Electronics", "Home & Garden", "Books", "Sports", "Jewelry"]
  },
  {
    name: "Fitness & Sports",
    subcategories: ["Gyms", "Yoga Studios", "Swimming Pools", "Tennis Courts", "Basketball", "Running"]
  },
  {
    name: "Beauty & Wellness",
    subcategories: ["Hair Salons", "Spas", "Nail Salons", "Massage", "Skincare", "Makeup"]
  },
  {
    name: "Home Services",
    subcategories: ["Plumbing", "Electrical", "Cleaning", "Landscaping", "Painting", "Roofing"]
  },
  {
    name: "Automotive",
    subcategories: ["Car Repair", "Car Wash", "Auto Parts", "Tire Shops", "Oil Change", "Detailing"]
  },
  {
    name: "Entertainment",
    subcategories: ["Movies", "Concerts", "Theaters", "Museums", "Parks", "Events"]
  }
];

const StickySearchBar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsSticky(scrollPosition > 200);
    };

    // Check initial scroll position
    handleScroll();
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    setOpenDropdown(openDropdown === categoryName ? null : categoryName);
  };

  return (
    <>
      {/* Sticky Search Bar - Appears at top when scrolled (Hidden initially) */}
      <div
        className={`fixed left-0 right-0 z-40 transition-all duration-500 ${
          isSticky
            ? "top-[73px] translate-y-0 opacity-100 pointer-events-auto"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-white/98 backdrop-blur-md shadow-xl border-b">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:py-4">
            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-lg p-2 flex flex-col sm:flex-row gap-2 border-2 border-green-500/20 mb-4">
              <div className="flex-1 flex items-center gap-3 px-4 py-3">
                <Search className="h-5 w-5 text-gray-400 shrink-0" />
                <Input
                  type="text"
                  placeholder="things to do, nail salons, plumbers"
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base p-0 h-auto"
                />
              </div>
              <div className="hidden sm:block w-px bg-gray-200"></div>
              <div className="flex-1 sm:w-64 flex items-center gap-3 px-4 py-3">
                <MapPin className="h-5 w-5 text-gray-400 shrink-0" />
                <Input
                  type="text"
                  placeholder="San Francisco, CA"
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base p-0 h-auto"
                />
              </div>
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 sm:px-8 py-6 h-auto text-base font-semibold shadow-lg shrink-0"
              >
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>

            {/* Category Navigation with Dropdowns */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
              {categories.map((category) => (
                <div key={category.name} className="relative shrink-0">
                  <button
                    onClick={() => handleCategoryClick(category.name)}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                      openDropdown === category.name
                        ? "bg-blue-50 text-blue-700 border-2 border-blue-200"
                        : "text-gray-700 hover:bg-gray-100 border-2 border-transparent"
                    }`}
                  >
                    {category.name}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        openDropdown === category.name ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {openDropdown === category.name && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setOpenDropdown(null)}
                      />
                      <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border-2 border-blue-100 z-50 overflow-hidden">
                        <div className="p-3">
                          <div className="flex items-center justify-between mb-3 px-2 py-1">
                            <h3 className="font-semibold text-gray-900 text-base">{category.name}</h3>
                            <button
                              onClick={() => setOpenDropdown(null)}
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {category.subcategories.map((subcat) => (
                              <a
                                key={subcat}
                                href="#"
                                className="px-3 py-2.5 rounded-lg hover:bg-blue-50 hover:text-blue-700 text-sm text-gray-700 transition-colors text-center border border-transparent hover:border-blue-200"
                                onClick={() => setOpenDropdown(null)}
                              >
                                {subcat}
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Initial Search Bar - In Hero Center (Always visible initially) */}
      <div
        className={`relative z-20 w-full transition-all duration-500 ${
          isSticky 
            ? "opacity-0 pointer-events-none scale-95 translate-y-[-20px]" 
            : "opacity-100 scale-100 translate-y-0"
        }`}
      >
        <div className="w-full px-4">
          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-2xl p-2.5 sm:p-3 flex flex-col sm:flex-row gap-2 border-2 border-green-500/30">
            <div className="flex-1 flex items-center gap-3 px-4 py-3 sm:py-4">
              <Search className="h-5 w-5 text-gray-400 shrink-0" />
              <Input
                type="text"
                placeholder="things to do, nail salons, plumbers"
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base sm:text-lg p-0 h-auto placeholder:text-gray-400"
              />
            </div>
            <div className="hidden sm:block w-px bg-gray-200"></div>
            <div className="flex-1 sm:w-64 flex items-center gap-3 px-4 py-3 sm:py-4">
              <MapPin className="h-5 w-5 text-gray-400 shrink-0" />
              <Input
                type="text"
                placeholder="San Francisco, CA"
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base sm:text-lg p-0 h-auto placeholder:text-gray-400"
              />
            </div>
            <Button
              size="lg"
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 sm:px-8 py-6 sm:py-7 h-auto text-base sm:text-lg font-semibold shadow-lg shrink-0"
            >
              <Search className="h-5 w-5 mr-2" />
              Search
            </Button>
          </div>

          {/* Category Navigation Below Search */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-4 sm:mt-5">
            {categories.map((category) => (
              <div key={category.name} className="relative">
                <button
                  onClick={() => handleCategoryClick(category.name)}
                  className={`flex items-center gap-1.5 px-4 py-2 sm:py-2.5 rounded-full text-sm sm:text-base font-medium transition-all backdrop-blur-sm border ${
                    openDropdown === category.name
                      ? "bg-white/95 text-blue-700 border-blue-300 shadow-md"
                      : "bg-white/10 text-white border-white/30 hover:bg-white/25 hover:border-white/40"
                  }`}
                >
                  {category.name}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      openDropdown === category.name ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {openDropdown === category.name && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setOpenDropdown(null)}
                    />
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 sm:w-80 bg-white rounded-xl shadow-2xl border-2 border-blue-100 z-50 overflow-hidden">
                      <div className="p-3 sm:p-4">
                        <div className="flex items-center justify-between mb-3 px-2 py-1">
                          <h3 className="font-semibold text-gray-900 text-base sm:text-lg">{category.name}</h3>
                          <button
                            onClick={() => setOpenDropdown(null)}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {category.subcategories.map((subcat) => (
                            <a
                              key={subcat}
                              href="#"
                              className="px-3 py-2.5 rounded-lg hover:bg-blue-50 hover:text-blue-700 text-sm text-gray-700 transition-colors text-center border border-transparent hover:border-blue-200"
                              onClick={() => setOpenDropdown(null)}
                            >
                              {subcat}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default StickySearchBar;

