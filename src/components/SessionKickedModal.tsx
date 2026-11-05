"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { AlertTriangle, LogIn, X } from "lucide-react";

export function SessionKickedModal() {
  const { isSessionTerminated, terminatedReason, dismissTerminatedModal, loginDemo } = useAuth();

  if (!isSessionTerminated) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center border border-amber-200 relative">
        <button
          onClick={dismissTerminatedModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-amber-50">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Sesi Login Berpindah Perangkat
        </h3>

        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          Akun Anda terdeteksi baru saja login di perangkat lain:
          <span className="block font-semibold text-gray-800 mt-1 bg-amber-50 py-1.5 px-3 rounded-lg border border-amber-200">
            {terminatedReason || "Komputer / Laptop Kantor"}
          </span>
          <span className="block mt-2 text-xs text-gray-500">
            Sesuai kebijakan keamanan, satu akun mitra hanya dapat aktif di satu perangkat pada waktu bersamaan. Sesi di perangkat ini telah dinonaktifkan.
          </span>
        </p>

        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => loginDemo("mitra")}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition shadow-sm"
          >
            <LogIn className="w-4 h-4" />
            Login Kembali di Perangkat Ini
          </button>
          <button
            onClick={dismissTerminatedModal}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition"
          >
            Mengerti, Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
