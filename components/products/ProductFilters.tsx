"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const typeFilters = [
  { value: "", label: "الكل" },
  { value: "MARBLE", label: "رخام" },
  { value: "GRANITE", label: "جرانيت" },
];

const originFilters = [
  { value: "", label: "الكل" },
  { value: "EGYPTIAN", label: "مصري" },
  { value: "IMPORTED", label: "مستورد" },
];

export function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentType = searchParams.get("type") ?? "";
  const currentOrigin = searchParams.get("origin") ?? "";
  const currentSearch = searchParams.get("search") ?? "";

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/products");
  };

  const hasActiveFilters = currentType || currentOrigin || currentSearch;

  return (
    <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-100 dark:border-stone-700 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <SlidersHorizontal className="w-5 h-5 text-gold-600" />
        <h3 className="font-semibold text-stone-900 dark:text-white">تصفية المنتجات</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="mr-auto flex items-center gap-1 text-xs text-red-500 hover:text-red-600 transition-colors"
          >
            <X className="w-3 h-3" />
            مسح الفلاتر
          </button>
        )}
      </div>

      {/* Search */}
      <div className="mb-6">
        <label className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-2 block">
          البحث
        </label>
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <Input
            placeholder="ابحث عن منتج..."
            className="pr-9"
            defaultValue={currentSearch}
            onChange={(e) => {
              const timeout = setTimeout(() => updateFilter("search", e.target.value), 500);
              return () => clearTimeout(timeout);
            }}
          />
        </div>
      </div>

      {/* Type Filter */}
      <div className="mb-6">
        <label className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-2 block">
          نوع المنتج
        </label>
        <div className="flex flex-col gap-2">
          {typeFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => updateFilter("type", filter.value)}
              className={cn(
                "w-full text-right px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                currentType === filter.value
                  ? "bg-gold-600 text-white shadow-sm"
                  : "bg-stone-50 dark:bg-stone-700 text-stone-700 dark:text-stone-200 hover:bg-gold-50 dark:hover:bg-gold-900/20 hover:text-gold-700"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Origin Filter */}
      <div className="mb-6">
        <label className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-2 block">
          المصدر
        </label>
        <div className="flex flex-col gap-2">
          {originFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => updateFilter("origin", filter.value)}
              className={cn(
                "w-full text-right px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                currentOrigin === filter.value
                  ? "bg-gold-600 text-white shadow-sm"
                  : "bg-stone-50 dark:bg-stone-700 text-stone-700 dark:text-stone-200 hover:bg-gold-50 dark:hover:bg-gold-900/20 hover:text-gold-700"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Toggle */}
      <div>
        <Button
          variant={searchParams.get("isFeatured") === "true" ? "gold" : "outline"}
          className="w-full"
          onClick={() =>
            updateFilter(
              "isFeatured",
              searchParams.get("isFeatured") === "true" ? "" : "true"
            )
          }
        >
          ⭐ المنتجات المميزة فقط
        </Button>
      </div>
    </div>
  );
}
