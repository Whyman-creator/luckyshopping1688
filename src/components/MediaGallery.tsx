"use client";

import React, { useState } from "react";
import { Product, ProductAsset } from "@/types";
import { downloadFile, downloadAllAsZip, getMediaUrl } from "@/lib/utils";
import { MediaViewerModal } from "@/components/MediaViewerModal";
import { ProductKnowledgeTab } from "@/components/ProductKnowledgeTab";
import {
  Download,
  Image as ImageIcon,
  Film,
  Archive,
  Loader2,
  Maximize2,
  CheckSquare,
  Square,
  Check,
  X,
  BookOpen,
} from "lucide-react";

interface MediaGalleryProps {
  assets: ProductAsset[];
  productName: string;
  product?: Product;
}

export function MediaGallery({ assets, productName, product }: MediaGalleryProps) {
  const videoAssets = assets.filter((a) => a.media_type === "video");
  const photoAssets = assets.filter((a) => a.media_type === "image");

  // 3 Tabs: 1. Product Knowledge, 2. Foto Produk, 3. Video Produk
  const [activeTab, setActiveTab] = useState<"knowledge" | "image" | "video">("knowledge");

  const [selectedAsset, setSelectedAsset] = useState<ProductAsset | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isZipping, setIsZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);
  const [zipStatusText, setZipStatusText] = useState("");

  // Pause all other playing videos when one starts playing
  const handleVideoPlay = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const currentVideo = e.currentTarget;
    document.querySelectorAll("video").forEach((vid) => {
      if (vid !== currentVideo && !vid.paused) {
        vid.pause();
      }
    });
  };

  // Toggle selection for a single asset
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle select all videos
  const toggleSelectAllVideos = () => {
    const videoIds = videoAssets.map((v) => v.id);
    const allSelected = videoIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !videoIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...videoIds])));
    }
  };

  // Toggle select all photos
  const toggleSelectAllPhotos = () => {
    const photoIds = photoAssets.map((p) => p.id);
    const allSelected = photoIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !photoIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...photoIds])));
    }
  };

  // Helper to trigger ZIP download
  const handleBatchDownload = async (targetAssets: ProductAsset[], label: string) => {
    if (targetAssets.length === 0) return;
    setIsZipping(true);
    setZipProgress(5);
    setZipStatusText(`Menyiapkan ${label}...`);

    try {
      await downloadAllAsZip(targetAssets, `${productName}_${label}`, (percent, status) => {
        setZipProgress(percent);
        setZipStatusText(status);
      });
    } catch (err) {
      console.error("ZIP download failed:", err);
      alert(`Terjadi kendala saat mengunduh berkas ZIP. Anda tetap dapat mengunduh berkas satu per satu.`);
    } finally {
      setTimeout(() => {
        setIsZipping(false);
        setZipProgress(0);
        setZipStatusText("");
      }, 1200);
    }
  };

  const isAllVideosSelected =
    videoAssets.length > 0 && videoAssets.every((v) => selectedIds.includes(v.id));
  const isAllPhotosSelected =
    photoAssets.length > 0 && photoAssets.every((p) => selectedIds.includes(p.id));

  return (
    <div className="space-y-6 relative">
      {/* 3 TAB PEMISAH UTAMA: 1. PRODUCT KNOWLEDGE | 2. FOTO PRODUK | 3. VIDEO PRODUK */}
      <div className="flex items-center gap-2.5 sm:gap-3 border-b border-gray-200 pb-3 overflow-x-auto scrollbar-none">
        {/* Tab 1: Product Knowledge */}
        <button
          type="button"
          onClick={() => setActiveTab("knowledge")}
          className={`flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-2xl font-extrabold text-xs sm:text-sm transition-all duration-200 flex-shrink-0 ${
            activeTab === "knowledge"
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/25 scale-[1.02]"
              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300"
          }`}
        >
          <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Product Knowledge</span>
        </button>

        {/* Tab 2: Foto Produk */}
        <button
          type="button"
          onClick={() => setActiveTab("image")}
          className={`flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-2xl font-extrabold text-xs sm:text-sm transition-all duration-200 flex-shrink-0 ${
            activeTab === "image"
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/25 scale-[1.02]"
              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300"
          }`}
        >
          <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Foto Produk</span>
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-black ${
              activeTab === "image"
                ? "bg-white/25 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {photoAssets.length}
          </span>
        </button>

        {/* Tab 3: Video Produk */}
        <button
          type="button"
          onClick={() => setActiveTab("video")}
          className={`flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-2xl font-extrabold text-xs sm:text-sm transition-all duration-200 flex-shrink-0 ${
            activeTab === "video"
              ? "bg-rose-600 text-white shadow-lg shadow-rose-600/25 scale-[1.02]"
              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300"
          }`}
        >
          <Film className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Video Produk</span>
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-black ${
              activeTab === "video"
                ? "bg-white/25 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {videoAssets.length}
          </span>
        </button>
      </div>

      {/* 1. KONTEN TAB: PRODUCT KNOWLEDGE */}
      {activeTab === "knowledge" && product && (
        <div className="animate-in fade-in duration-150">
          <ProductKnowledgeTab product={product} />
        </div>
      )}

      {/* 2. KONTEN TAB: FOTO PRODUK */}
      {activeTab === "image" && (
        <section className="space-y-4 animate-in fade-in duration-150">
          {/* Header Bar Khusus Foto */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base sm:text-lg flex items-center gap-2">
                  <span>Koleksi Foto Produk HD</span>
                  <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {photoAssets.length} Foto Siap Jual
                  </span>
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Klik foto untuk preview zoom resolusi tinggi, atau centang untuk download sekaligus.
                </p>
              </div>
            </div>

            {/* Aksi Batch Foto */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={toggleSelectAllPhotos}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 transition"
              >
                {isAllPhotosSelected ? (
                  <>
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Batal Pilih Semua</span>
                  </>
                ) : (
                  <>
                    <Square className="w-3.5 h-3.5 text-gray-400" />
                    <span>Pilih Semua Foto</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleBatchDownload(photoAssets, "Foto")}
                disabled={isZipping || photoAssets.length === 0}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm disabled:opacity-50"
              >
                <Archive className="w-3.5 h-3.5" />
                <span>Unduh Semua Foto (.ZIP)</span>
              </button>
            </div>
          </div>

          {/* Grid Foto */}
          {photoAssets.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-12 text-center">
              <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-700">Belum ada foto untuk produk ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {photoAssets.map((asset) => {
                const filename = `${asset.title.replace(/[^a-zA-Z0-9_-]/g, "_")}.jpg`;
                const isSelected = selectedIds.includes(asset.id);

                return (
                  <div
                    key={asset.id}
                    className={`group relative bg-white rounded-2xl overflow-hidden border transition-all flex flex-col justify-between ${
                      isSelected
                        ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-md"
                        : "border-gray-200 hover:border-gray-300 shadow-sm"
                    }`}
                  >
                    {/* Stage Preview Foto (Klik untuk Zoom) */}
                    <div
                      onClick={() => setSelectedAsset(asset)}
                      className="relative aspect-square w-full bg-gray-900 cursor-pointer overflow-hidden group/img"
                    >
                      <img
                        src={getMediaUrl(asset.thumbnail_url || asset.file_url)}
                        alt={asset.title}
                        className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300 opacity-95 group-hover/img:opacity-100"
                        loading="lazy"
                      />

                      {/* Ikon Zoom */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 bg-black/30 transition-opacity">
                        <div className="p-2.5 rounded-full bg-white/90 text-gray-800 shadow-lg">
                          <Maximize2 className="w-5 h-5" />
                        </div>
                      </div>

                      {/* Dimensi */}
                      {asset.dimensions && (
                        <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded backdrop-blur-sm">
                          {asset.dimensions}
                        </div>
                      )}

                      {/* Tombol Checkbox */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelect(asset.id);
                        }}
                        title={isSelected ? "Batalkan pilihan" : "Pilih foto ini"}
                        className={`absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                          isSelected
                            ? "bg-emerald-600 text-white ring-2 ring-white shadow-md scale-105"
                            : "bg-black/60 text-white hover:bg-black/90 backdrop-blur-sm"
                        }`}
                      >
                        {isSelected ? (
                          <Check className="w-4 h-4 stroke-[3]" />
                        ) : (
                          <div className="w-3.5 h-3.5 border-2 border-white/80 rounded-sm" />
                        )}
                      </button>
                    </div>

                    {/* Info Bawah & Download Satuan */}
                    <div className="p-3.5 bg-white flex flex-col justify-between flex-1">
                      <p
                        onClick={() => setSelectedAsset(asset)}
                        className="text-xs font-semibold text-gray-800 line-clamp-2 cursor-pointer hover:text-emerald-700"
                      >
                        {asset.title}
                      </p>

                      <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-[10px] text-gray-400 font-medium">
                          {asset.file_size || "Gambar HD"}
                        </span>

                        <button
                          type="button"
                          onClick={() => downloadFile(asset.file_url, filename)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-emerald-600 text-gray-700 hover:text-white rounded-lg text-xs font-bold transition"
                        >
                          <Download className="w-3 h-3" />
                          <span>Unduh</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* 3. KONTEN TAB: VIDEO PRODUK */}
      {activeTab === "video" && (
        <section className="space-y-4 animate-in fade-in duration-150">
          {/* Header Bar Khusus Video */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Film className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base sm:text-lg flex items-center gap-2">
                  <span>Koleksi Video Produk</span>
                  <span className="text-xs bg-rose-50 text-rose-700 font-bold px-2.5 py-0.5 rounded-full border border-rose-200">
                    {videoAssets.length} Video Siap Jual
                  </span>
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Putar langsung video di kartu masing-masing (otomatis pause jika ganti video).
                </p>
              </div>
            </div>

            {/* Aksi Batch Video */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={toggleSelectAllVideos}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 transition"
              >
                {isAllVideosSelected ? (
                  <>
                    <CheckSquare className="w-3.5 h-3.5 text-rose-600" />
                    <span>Batal Pilih Semua</span>
                  </>
                ) : (
                  <>
                    <Square className="w-3.5 h-3.5 text-gray-400" />
                    <span>Pilih Semua Video</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleBatchDownload(videoAssets, "Video")}
                disabled={isZipping || videoAssets.length === 0}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-sm disabled:opacity-50"
              >
                <Archive className="w-3.5 h-3.5" />
                <span>Unduh Semua Video (.ZIP)</span>
              </button>
            </div>
          </div>

          {/* Grid Video */}
          {videoAssets.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-12 text-center">
              <Film className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-700">Belum ada video untuk produk ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {videoAssets.map((asset) => {
                const filename = `${asset.title.replace(/[^a-zA-Z0-9_-]/g, "_")}.mp4`;
                const isSelected = selectedIds.includes(asset.id);

                return (
                  <div
                    key={asset.id}
                    className={`group relative bg-white rounded-2xl overflow-hidden border transition-all flex flex-col justify-between ${
                      isSelected
                        ? "border-rose-500 ring-2 ring-rose-500/20 shadow-md"
                        : "border-gray-200 hover:border-gray-300 shadow-sm"
                    }`}
                  >
                    {/* Inline Video Player Box */}
                    <div className="relative aspect-[4/5] w-full bg-black overflow-hidden flex items-center justify-center">
                      <video
                        src={getMediaUrl(asset.file_url)}
                        poster={getMediaUrl(asset.thumbnail_url)}
                        controls
                        playsInline
                        preload="metadata"
                        onPlay={handleVideoPlay}
                        className="w-full h-full object-contain bg-black"
                      >
                        Browser Anda tidak mendukung tag video.
                      </video>

                      {/* Format Badge (pointer-events-none) */}
                      <div className="pointer-events-none absolute top-2.5 left-2.5 flex items-center gap-1 bg-black/75 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider z-10">
                        <Film className="w-2.5 h-2.5 text-rose-400" />
                        <span>{asset.category_type.replace("_", " ")}</span>
                      </div>

                      {/* Tombol Checkbox */}
                      <button
                        type="button"
                        onClick={() => toggleSelect(asset.id)}
                        title={isSelected ? "Batalkan pilihan" : "Pilih video ini"}
                        className={`absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                          isSelected
                            ? "bg-rose-600 text-white ring-2 ring-white shadow-md scale-105"
                            : "bg-black/60 text-white hover:bg-black/90 backdrop-blur-sm"
                        }`}
                      >
                        {isSelected ? (
                          <Check className="w-4 h-4 stroke-[3]" />
                        ) : (
                          <div className="w-3.5 h-3.5 border-2 border-white/80 rounded-sm" />
                        )}
                      </button>
                    </div>

                    {/* Info Bawah & Download Satuan */}
                    <div className="p-3.5 bg-white flex flex-col justify-between flex-1">
                      <p className="text-xs font-semibold text-gray-800 line-clamp-2">
                        {asset.title}
                      </p>

                      <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-[10px] text-gray-400 font-medium">
                          {asset.file_size || "Video MP4"}
                        </span>

                        <button
                          type="button"
                          onClick={() => downloadFile(asset.file_url, filename)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-rose-600 text-gray-700 hover:text-white rounded-lg text-xs font-bold transition"
                        >
                          <Download className="w-3 h-3" />
                          <span>Unduh</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* BAR FLOATING: DOWNLOAD YANG DIPILIH */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900/95 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-2xl border border-gray-700 flex items-center gap-4 animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs sm:text-sm font-bold text-gray-100">
              {selectedIds.length} Berkas Dipilih
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              const selectedAssets = assets.filter((a) => selectedIds.includes(a.id));
              handleBatchDownload(selectedAssets, "Pilihan");
            }}
            disabled={isZipping}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-bold transition shadow-md disabled:opacity-50"
          >
            {isZipping ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{zipProgress}% {zipStatusText}</span>
              </>
            ) : (
              <>
                <Archive className="w-4 h-4" />
                <span>Unduh Yang Dipilih (.ZIP)</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setSelectedIds([])}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg transition"
            title="Batalkan Pilihan"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Fullscreen Photo Lightbox Modal */}
      <MediaViewerModal
        asset={selectedAsset}
        onClose={() => setSelectedAsset(null)}
      />
    </div>
  );
}
