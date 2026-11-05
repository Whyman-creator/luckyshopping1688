"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Product } from "@/types";
import { useProducts } from "@/context/ProductContext";
import { formatRupiah } from "@/lib/utils";
import { Image as ImageIcon, Video, ArrowRight } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=800&q=80";

export function ProductCard({ product }: ProductCardProps) {
  const { categories, getAssetsByProductId } = useProducts();
  const category = categories.find((c) => c.id === product.category_id);
  const assets = getAssetsByProductId(product.id);

  const [imgSrc, setImgSrc] = useState(product.cover_image || FALLBACK_IMAGE);

  useEffect(() => {
    setImgSrc(product.cover_image || FALLBACK_IMAGE);
  }, [product.cover_image]);

  const photoCount = assets.filter((a) => a.media_type === "image").length;
  const videoCount = assets.filter((a) => a.media_type === "video").length;

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 hover:border-emerald-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      {/* Thumbnail Area */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        <img
          src={imgSrc}
          alt={product.name}
          onError={() => setImgSrc(FALLBACK_IMAGE)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Category Pill Tag */}
        {category && (
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
            {category.name}
          </div>
        )}

        {/* Media Counts Badge */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/75 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-full">
          {photoCount > 0 && (
            <span className="flex items-center gap-1">
              <ImageIcon className="w-3 h-3 text-emerald-400" />
              {photoCount}
            </span>
          )}
          {photoCount > 0 && videoCount > 0 && <span className="opacity-40">•</span>}
          {videoCount > 0 && (
            <span className="flex items-center gap-1">
              <Video className="w-3 h-3 text-rose-400" />
              {videoCount}
            </span>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-gray-900 group-hover:text-emerald-700 transition line-clamp-1 text-base sm:text-lg">
            {product.name}
          </h3>
          <p className="mt-1.5 text-xs sm:text-sm text-gray-500 line-clamp-2 leading-relaxed">
            {product.short_description}
          </p>
        </div>

        {/* Pricing Area */}
        <div className="mt-4 pt-3.5 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
              Harga
            </span>
            <span className="text-lg font-black text-emerald-700">
              {formatRupiah(product.price || product.price_consumer || 0)}
            </span>
          </div>

          <Link
            href={`/produk/${product.slug}`}
            className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-gray-900 hover:bg-emerald-600 text-white font-medium text-xs transition-colors group-hover:shadow-md"
          >
            <span>Lihat Produk</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
