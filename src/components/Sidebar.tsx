"use client";

import React, { useState } from "react";
import { useProducts } from "@/context/ProductContext";
import {
  Sparkles,
  Shirt,
  HeartPulse,
  Headphones,
  Utensils,
  Package,
  Layers,
  Film,
  Image as ImageIcon,
  ArrowUpDown,
  Filter,
  X,
  RotateCcw,
} from "lucide-react";

interface SidebarProps {
  mediaFilter: "all" | "video" | "image";
  setMediaFilter: (filter: "all" | "video" | "image") => void;
  sortBy: "latest" | "price_asc" | "price_desc";
  setSortBy: (sort: "latest" | "price_asc" | "price_desc") => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
}

export function Sidebar({
  mediaFilter,
  setMediaFilter,
  sortBy,
  setSortBy,
  isOpenMobile,
  setIsOpenMobile,
}: SidebarProps) {
  const { categories, products, selectedCategory, setSelectedCategory, assets } = useProducts();

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

  const isAnyFilterActive =
    selectedCategory !== "semua" || mediaFilter !== "all" || sortBy !== "latest";

  const handleReset = () => {
    setSelectedCategory("semua");
    setMediaFilter("all");
    setSortBy("latest");
  };

  const content = (
    <div className="space-y-6">
      {/* 1. Header Pengelompokan & Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2 text-gray-900 font-extrabold text-sm sm:text-base">
          <Layers className="w-4 h-4 text-emerald-600" />
          <span>Pengelompokan Produk</span>
        </div>

        {isAnyFilterActive && (
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-700 transition"
            title="Kembalikan semua filter"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* 2. Kategori Produk List */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
          Kategori
        </label>

        {/* Semua Produk */}
        <button
          onClick={() => {
            setSelectedCategory("semua");
            setIsOpenMobile(false);
          }}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
            selectedCategory === "semua"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
              : "text-gray-700 hover:bg-gray-100/70"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Package className="w-4 h-4" />
            <span>Semua Produk</span>
          </div>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              selectedCategory === "semua"
                ? "bg-white/25 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {getProductCount("semua")}
          </span>
        </button>

        {/* Category List */}
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.slug;
          const count = getProductCount(cat.slug);

          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.slug);
                setIsOpenMobile(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
                isSelected
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "text-gray-700 hover:bg-gray-100/70"
              }`}
            >
              <div className="flex items-center gap-2.5 truncate pr-2">
                {getIcon(cat.icon)}
                <span className="truncate">{cat.name}</span>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                  isSelected ? "bg-white/25 text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Filter Ketersediaan Media Iklan */}
      <div className="space-y-2 pt-4 border-t border-gray-100">
        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
          Ketersediaan Bahan Iklan
        </label>

        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => {
              setMediaFilter("all");
              setIsOpenMobile(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition ${
              mediaFilter === "all"
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            Semua Bahan Iklan
          </button>

          <button
            onClick={() => {
              setMediaFilter("video");
              setIsOpenMobile(false);
            }}
            className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition ${
              mediaFilter === "video"
                ? "bg-rose-600 text-white"
                : "text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5 text-rose-400" />
              <span>Memiliki Video Iklan</span>
            </div>
            <span className="text-[10px] opacity-80">🎬</span>
          </button>

          <button
            onClick={() => {
              setMediaFilter("image");
              setIsOpenMobile(false);
            }}
            className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition ${
              mediaFilter === "image"
                ? "bg-emerald-600 text-white"
                : "text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>Memiliki Foto HD</span>
            </div>
            <span className="text-[10px] opacity-80">🖼️</span>
          </button>
        </div>
      </div>

      {/* 4. Urutkan Produk */}
      <div className="space-y-2 pt-4 border-t border-gray-100">
        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
          <ArrowUpDown className="w-3 h-3" />
          <span>Urutkan Harga & Produk</span>
        </label>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="w-full px-3 py-2 text-xs font-semibold border border-gray-200 rounded-xl bg-white text-gray-700 outline-none focus:border-emerald-600"
        >
          <option value="latest">Terbaru</option>
          <option value="price_asc">Harga: Termurah ke Termahal</option>
          <option value="price_desc">Harga: Termahal ke Termurah</option>
        </select>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-64 xl:w-72 bg-white rounded-3xl p-5 border border-gray-100 shadow-sm sticky top-24 self-start">
        {content}
      </aside>

      {/* Mobile Drawer Backdrop & Modal */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpenMobile(false)}
          />
          <div className="relative w-4/5 max-w-xs bg-white h-full p-6 shadow-2xl overflow-y-auto flex flex-col justify-between z-10 animate-in slide-in-from-left duration-200">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
                <h3 className="font-extrabold text-gray-900 text-sm">Filter & Kategori</h3>
                <button
                  onClick={() => setIsOpenMobile(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {content}
            </div>

            <div className="pt-6 mt-6 border-t border-gray-100">
              <button
                onClick={() => setIsOpenMobile(false)}
                className="w-full py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold text-center"
              >
                Terapkan Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
