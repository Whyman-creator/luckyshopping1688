"use client";

import React, { useState } from "react";
import { Product } from "@/types";
import { copyToClipboard } from "@/lib/utils";
import { FileText, Copy, Check } from "lucide-react";

interface ProductKnowledgeTabProps {
  product: Product;
}

export function ProductKnowledgeTab({ product }: ProductKnowledgeTabProps) {
  const [isCopied, setIsCopied] = useState(false);

  const descriptionText = product.full_description || product.short_description;

  const handleCopy = async () => {
    const success = await copyToClipboard(descriptionText);
    if (success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4 animate-in fade-in duration-150">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-600" />
          <span>Deskripsi Produk</span>
        </h3>

        {/* Tombol Salin Deskripsi (Sangat Praktis untuk Dropshipper) */}
        <button
          type="button"
          onClick={handleCopy}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
            isCopied
              ? "bg-emerald-600 text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200"
          }`}
        >
          {isCopied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Tersalin!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Salin Deskripsi</span>
            </>
          )}
        </button>
      </div>

      {/* Teks Polosan Deskripsi Produk */}
      <div className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line font-normal">
        {descriptionText}
      </div>
    </div>
  );
}
