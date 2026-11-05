"use client";

import React, { useState, useMemo } from "react";
import { useProducts } from "@/context/ProductContext";
import { Sidebar } from "@/components/Sidebar";
import { ProductCard } from "@/components/ProductCard";
import {
  Sparkles,
  Package,
  PackageSearch,
  SlidersHorizontal,
  Film,
  Download,
  ShieldCheck,
  X,
} from "lucide-react";

export default function HomePage() {
  const {
    filteredProducts,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    assets,
  } = useProducts();

  const [mediaFilter, setMediaFilter] = useState<"all" | "video" | "image">("all");
  const [sortBy, setSortBy] = useState<"latest" | "price_asc" | "price_desc">("latest");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Filter & Sort Products
  const processedProducts = useMemo(() => {
    let result = [...filteredProducts];

    // Filter by Media Availability
    if (mediaFilter === "video") {
      result = result.filter((p) =>
        assets.some((a) => a.product_id === p.id && a.media_type === "video")
      );
    } else if (mediaFilter === "image") {
      result = result.filter((p) =>
        assets.some((a) => a.product_id === p.id && a.media_type === "image")
      );
    }

    // Sort
    if (sortBy === "price_asc") {
      result.sort(
        (a, b) => (a.price || a.price_consumer || 0) - (b.price || b.price_consumer || 0)
      );
    } else if (sortBy === "price_desc") {
      result.sort(
        (a, b) => (b.price || b.price_consumer || 0) - (a.price || a.price_consumer || 0)
      );
    }

    return result;
  }, [filteredProducts, mediaFilter, sortBy, assets]);

  const activeCategory = categories.find((c) => c.slug === selectedCategory);
  const activeCategoryName = selectedCategory === "semua" ? "Semua Produk" : activeCategory?.name || "Kategori Terpilih";

  const isFiltered =
    searchQuery.trim() !== "" ||
    selectedCategory !== "semua" ||
    mediaFilter !== "all" ||
    sortBy !== "latest";

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Supplier Dropship Header */}
      <section className="bg-gradient-to-r from-gray-900 via-emerald-950 to-gray-900 text-white rounded-2xl p-6 sm:p-7 shadow-sm border border-emerald-900/40">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30 mb-2.5">
            <Package className="w-3.5 h-3.5" />
            <span>LuckyShopping1688 — Pasokan Dropship Tangan Pertama</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
            Katalog Pasokan Resmi & Bank Konten Siap Jual
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 mt-2 leading-relaxed">
            Akses langsung produk tren berkeuntungan tebal dengan aset visual original berkualitas tinggi. Anda cukup fokus memasarkan dan datangkan pesanan, urusan pasokan dan operasional biar kami yang tangani.
          </p>
        </div>
      </section>

      {/* Mobile Sidebar Trigger Bar */}
      <div className="lg:hidden flex items-center justify-between bg-white p-3.5 rounded-2xl border border-gray-100 shadow-sm">
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-sm"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Pengelompokan & Filter Produk</span>
        </button>

        <span className="text-xs font-semibold text-gray-600">
          {processedProducts.length} Produk
        </span>
      </div>

      {/* Main Two-Column Layout: Sidebar + Product Grid */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        {/* Left Sidebar for Product Grouping */}
        <Sidebar
          mediaFilter={mediaFilter}
          setMediaFilter={setMediaFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          isOpenMobile={isMobileSidebarOpen}
          setIsOpenMobile={setIsMobileSidebarOpen}
        />

        {/* Right Main Content (Products Grid) */}
        <div className="flex-1 w-full space-y-4">
          {/* Header Bar */}
          <div className="flex items-center justify-between bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2.5">
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                {activeCategoryName}
              </h2>
              <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                {processedProducts.length} Produk
              </span>
            </div>

            {isFiltered && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("semua");
                  setMediaFilter("all");
                  setSortBy("latest");
                }}
                className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 transition"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Semua</span>
              </button>
            )}
          </div>

          {searchQuery && (
            <p className="text-xs text-gray-500 px-1">
              Hasil pencarian kata kunci: <span className="font-semibold text-gray-800">&quot;{searchQuery}&quot;</span>
            </p>
          )}

          {/* Product Cards Grid */}
          {processedProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-12 text-center max-w-lg mx-auto">
              <PackageSearch className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-800">Produk Tidak Ditemukan</h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Tidak ada produk yang sesuai dengan kriteria filter saat ini.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("semua");
                  setMediaFilter("all");
                  setSortBy("latest");
                }}
                className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition"
              >
                Tampilkan Semua Produk
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {processedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
