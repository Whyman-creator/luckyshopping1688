"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { X, ShieldCheck, Sparkles, User, ShieldAlert } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { loginWithGoogle, loginDemo } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-6 sm:p-8 text-center relative">
          <div className="inline-flex p-3 bg-white/10 rounded-2xl backdrop-blur-md mb-3 ring-1 ring-white/20">
            <Sparkles className="w-8 h-8 text-emerald-200" />
          </div>
          <h2 className="text-2xl font-bold">Portal Luckyshopping1688</h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-xs mx-auto">
            Akses bahan promosi video, gambar HD, dan materi penjualan resmi mitra.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-5">
          {/* Main Google OAuth Button */}
          <button
            onClick={async () => {
              await loginWithGoogle();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-3 px-5 py-3.5 border-2 border-gray-200 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-2xl shadow-sm transition group"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Masuk dengan Akun Google</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-gray-200 w-full" />
            <span className="bg-white px-3 text-xs uppercase tracking-wider text-gray-400 font-medium">
              Atau Uji Coba Langsung
            </span>
            <div className="border-t border-gray-200 w-full" />
          </div>

          {/* Quick Demo Access */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                loginDemo("mitra");
                onClose();
              }}
              className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/60 hover:bg-emerald-100/80 text-emerald-800 transition text-center group"
            >
              <User className="w-5 h-5 mb-1.5 text-emerald-600 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold">Login Mitra (Demo)</span>
              <span className="text-[10px] text-emerald-600">Download aset & salin teks</span>
            </button>

            <button
              onClick={() => {
                loginDemo("admin");
                onClose();
              }}
              className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-purple-100 bg-purple-50/60 hover:bg-purple-100/80 text-purple-800 transition text-center group"
            >
              <ShieldAlert className="w-5 h-5 mb-1.5 text-purple-600 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold">Login Admin (Demo)</span>
              <span className="text-[10px] text-purple-600">Upload & kelola produk</span>
            </button>
          </div>

          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl text-[11px] text-gray-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Satu akun hanya dapat aktif di 1 perangkat pada waktu yang sama.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
