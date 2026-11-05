"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useProducts } from "@/context/ProductContext";
import { formatRupiah, getMediaUrl } from "@/lib/utils";
import { MediaGallery } from "@/components/MediaGallery";
import {
  ArrowLeft,
  Share2,
} from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const { getProductBySlug, getAssetsByProductId, categories } = useProducts();
  const product = getProductBySlug(slug);

  if (!product) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Produk Tidak Ditemukan</h2>
        <p className="text-sm text-gray-500">
          Produk dengan tautan &quot;{slug}&quot; mungkin telah dihapus atau belum dipublikasikan.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Katalog</span>
        </Link>
      </div>
    );
  }

  const category = categories.find((c) => c.id === product.category_id);
  const assets = getAssetsByProductId(product.id);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-600 hover:text-emerald-700 transition group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Kembali ke Katalog Produk</span>
        </Link>

        {category && (
          <span className="text-xs font-semibold px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
            {category.name}
          </span>
        )}
      </div>

      {/* Product Summary Header Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6 sm:p-7">
        <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
          {/* Main Cover Image */}
          <div className="w-full md:w-60 lg:w-72 aspect-square rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 relative shadow-sm border border-gray-100">
            <img
              src={getMediaUrl(product.cover_image) || "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=800&q=80"}
              alt={product.name}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=800&q=80";
              }}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Header Details */}
          <div className="flex-1 space-y-3.5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                {product.name}
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-gray-500 leading-relaxed">
                {product.short_description}
              </p>
            </div>

            {/* Direct Price Display */}
            <div>
              <div className="inline-flex items-baseline gap-2 bg-emerald-50 border border-emerald-200/80 px-4 py-2 rounded-2xl">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Harga Dropship:
                </span>
                <span className="text-2xl font-black text-emerald-700">
                  {formatRupiah(product.price || product.price_consumer || 0)}
                </span>
              </div>
            </div>

            {/* Quick Share Button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: product.name,
                      text: product.short_description,
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Tautan produk telah disalin ke papan klip!");
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-xs transition"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Bagikan Tautan Produk</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: 1. Product Knowledge, 2. Foto Produk, 3. Video Produk */}
      <div className="pt-2">
        <MediaGallery assets={assets} productName={product.name} product={product} />
      </div>
    </div>
  );
}
