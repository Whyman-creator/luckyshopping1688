"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useProducts } from "@/context/ProductContext";
import { LoginModal } from "@/components/LoginModal";
import {
  Search,
  LogIn,
  LogOut,
  ShieldAlert,
  Smartphone,
  Layers,
  Sparkles,
  SlidersHorizontal,
  X,
} from "lucide-react";

export function Navbar() {
  const { user, isLoggedIn, isAdmin, logout, simulateDeviceKick } = useAuth();
  const { searchQuery, setSearchQuery } = useProducts();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
        {/* Main Nav */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-gray-900 group-hover:text-emerald-600 transition">
                LUCKY<span className="text-emerald-600">SHOPPING1688</span>
              </span>
              <span className="hidden sm:block text-[10px] font-bold text-gray-500 -mt-1 tracking-wider uppercase">
                Penyedia Dropship Tangan Pertama
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari produk, keunggulan, materi iklan..."
                className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-gray-50 hover:bg-gray-100/70 focus:bg-white border border-gray-200 focus:border-emerald-500 rounded-xl transition outline-none focus:ring-2 focus:ring-emerald-500/10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="md:hidden p-2 text-gray-500 hover:text-gray-800 rounded-xl hover:bg-gray-100 transition"
              aria-label="Cari Produk"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Admin Panel Link */}
            {isAdmin && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 rounded-xl text-xs font-semibold transition"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Panel Admin</span>
              </Link>
            )}

            {/* User Profile or Login */}
            {isLoggedIn && user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200/80 px-2.5 py-1.5 rounded-xl">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.full_name}
                      className="w-6 h-6 rounded-full object-cover ring-1 ring-emerald-500"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                      {user.full_name.charAt(0)}
                    </div>
                  )}
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-bold text-gray-800 leading-tight truncate max-w-[120px]">
                      {user.full_name}
                    </p>
                    <span className="text-[10px] text-emerald-600 font-medium capitalize">
                      {user.role === "admin" ? "Admin Pusat" : "Mitra Aktif"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={logout}
                  title="Keluar"
                  className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition shadow-sm shadow-emerald-600/20"
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk Dropshipper</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search Dropdown */}
        {isMobileSearchOpen && (
          <div className="md:hidden px-4 pb-3 pt-1 border-t border-gray-100 bg-white">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari produk atau materi iklan..."
                className="w-full pl-9 pr-9 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2.5 text-gray-400"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}
