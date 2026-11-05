"use client";

import React, { useRef, useEffect } from "react";
import { ProductAsset } from "@/types";
import { downloadFile } from "@/lib/utils";
import { X, Download, Play, Film, Image as ImageIcon } from "lucide-react";

interface MediaViewerModalProps {
  asset: ProductAsset | null;
  onClose: () => void;
}

export function MediaViewerModal({ asset, onClose }: MediaViewerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Escape key to close
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!asset) return null;

  const isVideo = asset.media_type === "video";
  const ext = isVideo ? "mp4" : "jpg";
  const filename = `${asset.title.replace(/[^a-zA-Z0-9_-]/g, "_")}.${ext}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-6 animate-in fade-in duration-200">
      <div className="relative max-w-4xl w-full bg-gray-950 rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-white/10 max-h-[92vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/40 text-white z-10">
          <div className="flex items-center gap-2.5 min-w-0 pr-4">
            {isVideo ? (
              <Film className="w-5 h-5 text-rose-400 flex-shrink-0" />
            ) : (
              <ImageIcon className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            )}
            <div className="truncate">
              <h3 className="font-semibold text-sm sm:text-base text-gray-100 truncate">
                {asset.title}
              </h3>
              <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                <span className="uppercase tracking-wider font-semibold text-emerald-400">
                  {asset.category_type.replace("_", " ")}
                </span>
                {asset.dimensions && <span>• {asset.dimensions}</span>}
                {asset.file_size && <span>• {asset.file_size}</span>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => downloadFile(asset.file_url, filename)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition shadow-md shadow-emerald-600/30"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Unduh File</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white rounded-xl hover:bg-white/10 transition"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Media Preview Stage */}
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-auto min-h-[300px] sm:min-h-[460px] max-h-[75vh]">
          {isVideo ? (
            <video
              ref={videoRef}
              src={asset.file_url}
              controls
              autoPlay
              playsInline
              className="max-h-[72vh] max-w-full rounded-lg outline-none"
            >
              Browser Anda tidak mendukung pemutar video HTML5.
            </video>
          ) : (
            <img
              src={asset.file_url}
              alt={asset.title}
              className="max-h-[72vh] max-w-full object-contain"
            />
          )}
        </div>

        {/* Bottom Footer Details */}
        <div className="p-3 bg-gray-900/90 text-gray-400 text-xs flex items-center justify-between border-t border-white/5">
          <span className="text-[11px]">
            {isVideo ? "Tips: Video sudah dioptimasi untuk posting Reels/TikTok/Story." : "Tips: Gambar siap pakai resolusi tajam (HD)."}
          </span>
          <button
            onClick={() => downloadFile(asset.file_url, filename)}
            className="text-emerald-400 hover:text-emerald-300 font-semibold text-[11px] underline underline-offset-2"
          >
            Klik di sini jika unduhan otomatis tidak mulai
          </button>
        </div>
      </div>
    </div>
  );
}
