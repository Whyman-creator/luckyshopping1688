"use client";

import React, { useState } from "react";
import { CategoryIcon } from "./CategoryIcon";

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
}

const PRESET_GROUPS = [
  {
    name: "Pertanian & Alam",
    icons: [
      { label: "Padi / Beras", value: "🌾" },
      { label: "Bibit / Tanaman", value: "🌱" },
      { label: "Herbal / Daun", value: "🌿" },
      { label: "Traktor", value: "🚜" },
      { label: "Bunga", value: "🌻" },
      { label: "Buah Segar", value: "🍎" },
      { label: "Ikan / Tambak", value: "🐟" },
    ],
  },
  {
    name: "Kecantikan & Fashion",
    icons: [
      { label: "Skincare Glow", value: "✨" },
      { label: "Lipstik / Kosmetik", value: "💄" },
      { label: "Gaun / Gamis", value: "👗" },
      { label: "Kaos / Kemeja", value: "👕" },
      { label: "Sepatu", value: "👟" },
      { label: "Tas / Dompet", value: "👜" },
    ],
  },
  {
    name: "Gadget & Elektronik",
    icons: [
      { label: "Smartphone", value: "📱" },
      { label: "Earphone / TWS", value: "🎧" },
      { label: "Laptop", value: "💻" },
      { label: "Elektronik", value: "⚡" },
      { label: "Jam Tangan", value: "⌚" },
      { label: "Kamera", value: "📷" },
    ],
  },
  {
    name: "Herbal & Kesehatan",
    icons: [
      { label: "Suplemen / Obat", value: "💊" },
      { label: "Madu Murni", value: "🍯" },
      { label: "Detak Jantung", value: "❤️" },
      { label: "Teh Sehat", value: "🍵" },
    ],
  },
  {
    name: "Kuliner & F&B",
    icons: [
      { label: "Makanan", value: "🍽️" },
      { label: "Kopi Nusantara", value: "☕" },
      { label: "Camilan / Snack", value: "🍪" },
      { label: "Minuman Segar", value: "🥤" },
    ],
  },
  {
    name: "Rumah & Otomotif",
    icons: [
      { label: "Perabot Rumah", value: "🏠" },
      { label: "Mobil", value: "🚗" },
      { label: "Motor", value: "🏍️" },
      { label: "Perkakas", value: "🔧" },
      { label: "Bayi & Anak", value: "👶" },
      { label: "Paket / Umum", value: "📦" },
      { label: "Produk Viral", value: "🔥" },
    ],
  },
];

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [customInput, setCustomInput] = useState("");

  const handleCustomSubmit = (val: string) => {
    setCustomInput(val);
    if (val.trim()) {
      onChange(val.trim());
    }
  };

  return (
    <div className="space-y-3 bg-gray-50/70 p-3.5 rounded-2xl border border-gray-200">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-gray-700">Pilihan Ikon / Emoji</label>
        <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-gray-200 shadow-xs">
          <span className="text-[10px] text-gray-400 font-medium">Terpilih:</span>
          <div className="flex items-center gap-1">
            <CategoryIcon icon={value || "📦"} className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-extrabold text-gray-900">{value || "Package"}</span>
          </div>
        </div>
      </div>

      {/* Custom Emoji / Text Input */}
      <div>
        <div className="relative">
          <input
            type="text"
            value={customInput}
            onChange={(e) => handleCustomSubmit(e.target.value)}
            placeholder="Ketik emoji bebas di sini (misal: 🌾, 🌱, 🚜, 🐠, 🥩)"
            className="w-full pl-3 pr-20 py-2 text-xs bg-white border border-gray-200 rounded-xl outline-none focus:border-emerald-600"
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 pointer-events-none">
            Bebas Ketik
          </span>
        </div>
        <p className="text-[10px] text-gray-400 mt-1">
          💡 Tips: Anda bisa ketik atau tempel emoji apa saja dari keyboard HP/Laptop (Windows: tekan Win + titik).
        </p>
      </div>

      {/* Preset Quick Picks */}
      <div className="space-y-2 pt-1 border-t border-gray-200/70">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
          Pilihan Cepat:
        </span>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {PRESET_GROUPS.map((group) => (
            <div key={group.name} className="space-y-1">
              <span className="text-[10px] font-semibold text-gray-500 block">{group.name}</span>
              <div className="flex flex-wrap gap-1.5">
                {group.icons.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => {
                      onChange(item.value);
                      setCustomInput("");
                    }}
                    title={item.label}
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition ${
                      value === item.value
                        ? "bg-emerald-600 text-white font-bold shadow-xs scale-105"
                        : "bg-white hover:bg-gray-100 text-gray-700 border border-gray-200/80"
                    }`}
                  >
                    <span className="text-sm">{item.value}</span>
                    <span className="text-[10px] hidden sm:inline">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
