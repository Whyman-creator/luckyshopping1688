"use client";

import React from "react";
import { useProducts } from "@/context/ProductContext";
import {
  Sparkles,
  Shirt,
  HeartPulse,
  Headphones,
  Utensils,
  LayoutGrid,
  Package,
} from "lucide-react";

export function CategoryFilter() {
  const { categories, products, selectedCategory, setSelectedCategory } = useProducts();

  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case "Sparkles":
        return <Sparkles className="w-4 h-4" />;
      case "Shirt":
        return <Shirt className="w-4 h-4" />;
      case "HeartPulse":
        return <HeartPulse className="w-4 h-4" />;
      case "Headphones":
        return <Headphones className="w-4 h-4" />;
      case "Utensils":
        return <Utensils className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getProductCount = (catSlug: string) => {
    if (catSlug === "semua") return products.length;
    const cat = categories.find((c) => c.slug === catSlug);
    return products.filter((p) => p.category_id === cat?.id || p.category?.slug === catSlug).length;
  };

  return (
    <div className="w-full py-4">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
        {/* 'Semua' Pill */}
        <button
          onClick={() => setSelectedCategory("semua")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all flex-shrink-0 ${
            selectedCategory === "semua"
              ? "bg-gray-900 text-white shadow-md shadow-gray-900/10 scale-[1.02]"
              : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200"
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span>Semua Produk</span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
              selectedCategory === "semua"
                ? "bg-white/20 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {getProductCount("semua")}
          </span>
        </button>

        {/* Dynamic Category Pills */}
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.slug;
          const count = getProductCount(cat.slug);

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all flex-shrink-0 ${
                isSelected
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-[1.02]"
                  : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200"
              }`}
            >
              {getIcon(cat.icon)}
              <span>{cat.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isSelected ? "bg-white/25 text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
