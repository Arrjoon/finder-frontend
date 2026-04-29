"use client";

import React, { useState, useEffect } from "react";
import { Search, MapPin, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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

type SearchBarPanelProps = {
  variant: "hero" | "sticky";
  searchQuery: string;
  onSearchChange: (v: string) => void;
  location: string;
  onLocationChange: (v: string) => void;
  openDropdown: string | null;
  onToggleCategory: (name: string) => void;
  onCloseDropdown: () => void;
};

/**
 * Single search + category UI; parent wraps it either in the hero (center) or fixed top bar.
 */
function SearchBarPanel({
  variant,
  searchQuery,
  onSearchChange,
  location,
  onLocationChange,
  openDropdown,
  onToggleCategory,
  onCloseDropdown,
}: SearchBarPanelProps) {
  const isHero = variant === "hero";

  return (
    <>
      <div
        className={cn(
          "bg-gray-100 shadow-lg flex flex-col sm:flex-row gap-2 border border-gray-200",
          isHero ? "rounded-2xl p-2.5 sm:p-3" : "rounded-xl p-2 mb-4"
        )}
      >
        <div className="flex-1 flex items-center gap-3 px-4 py-3 sm:py-4 bg-white rounded-lg">
          <Search className="h-5 w-5 text-gray-400 shrink-0" />
          <Input
            type="text"
            placeholder="things to do, nail salons, plumbers"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={cn(
              "border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto placeholder:text-gray-500 bg-transparent",
              isHero ? "text-base sm:text-lg" : "text-base"
            )}
          />
        </div>
        <div className="flex-1 sm:w-64 flex items-center gap-3 px-4 py-3 sm:py-4 bg-white rounded-lg relative">
          <MapPin className="h-5 w-5 text-gray-400 shrink-0" />
          <Input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            className={cn(
              "border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto placeholder:text-gray-500 bg-transparent pr-8 flex-1",
              isHero ? "text-base sm:text-lg" : "text-base"
            )}
          />
          <ChevronDown className="h-4 w-4 text-gray-400 absolute right-4" />
        </div>
        <Button
          size="lg"
          className={cn(
            "bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 h-auto font-semibold shadow-md shrink-0 rounded-lg",
            isHero ? "py-6 sm:py-7 text-base sm:text-lg" : "py-6 text-base"
          )}
        >
          <Search className="h-5 w-5 mr-2" />
          Search
        </Button>
      </div>

      <div
        className={cn(
          isHero
            ? "flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-5 sm:mt-6"
            : "flex items-center gap-3 overflow-x-auto scrollbar-hide pb-2"
        )}
      >
        {categories.map((category) => (
          <div key={category.name} className="relative shrink-0">
            <button
              type="button"
              onClick={() => onToggleCategory(category.name)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-all",
                isHero ? "text-sm sm:text-base" : "text-sm whitespace-nowrap",
                openDropdown === category.name
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              {category.name}
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-gray-500 transition-transform",
                  openDropdown === category.name ? "rotate-180 text-blue-600" : ""
                )}
              />
            </button>

            {openDropdown === category.name && (
              <>
                <div
                  className="fixed inset-0 z-[60]"
                  aria-hidden
                  onClick={onCloseDropdown}
                />
                <div
                  className={cn(
                    "absolute top-full mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-2xl border-2 border-blue-100 z-[70] overflow-hidden",
                    isHero ? "left-1/2 -translate-x-1/2 mt-3" : "left-0 mt-2 w-72"
                  )}
                >
                  <div className={cn("p-3", isHero && "sm:p-4")}>
                    <div className="flex items-center justify-between mb-3 px-2 py-1">
                      <h3
                        className={cn(
                          "font-semibold text-gray-900",
                          isHero ? "text-base sm:text-lg" : "text-base"
                        )}
                      >
                        {category.name}
                      </h3>
                      <button
                        type="button"
                        onClick={onCloseDropdown}
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
                          onClick={(e) => {
                            e.preventDefault();
                            onCloseDropdown();
                          }}
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
    </>
  );
}

const SCROLL_STICKY_PX = 400;

const StickySearchBar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("Kathmandu");

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > SCROLL_STICKY_PX);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleCategory = (name: string) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const panel = (
    <SearchBarPanel
      variant={isSticky ? "sticky" : "hero"}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      location={location}
      onLocationChange={setLocation}
      openDropdown={openDropdown}
      onToggleCategory={toggleCategory}
      onCloseDropdown={() => setOpenDropdown(null)}
    />
  );

  if (isSticky) {
    return (
      <div className="fixed left-0 right-0 z-40 top-[73px] animate-in fade-in slide-in-from-top-2 duration-300">
        <div className="bg-white/98 backdrop-blur-md shadow-xl border-b">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:py-4">{panel}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-50 w-full">
      <div className="w-full px-4">{panel}</div>
    </div>
  );
};

export default StickySearchBar;
