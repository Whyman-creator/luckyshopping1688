import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ProductProvider } from "@/context/ProductContext";
import { Navbar } from "@/components/Navbar";
import { SessionKickedModal } from "@/components/SessionKickedModal";

export const metadata: Metadata = {
  title: "Luckyshopping1688 — Pusat Supplier & Penyedia Dropship Tangan Pertama",
  description: "Katalog produk supplier dropship tangan pertama. Dapatkan foto produk HD, video original, dan spesifikasi lengkap untuk toko online Anda.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen flex flex-col font-sans">
        <AuthProvider>
          <ProductProvider>
            {/* Global Navbar */}
            <Navbar />

            {/* Main Application Container */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
              {children}
            </main>

            {/* Global Modal for Single Active Session Invalidation */}
            <SessionKickedModal />

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-8 text-center text-xs text-gray-500">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-left">
                  <p className="font-bold text-gray-800 text-sm">LUCKYSHOPPING1688</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Pusat supplier dan penyedia dropship tangan pertama untuk toko online Anda.
                  </p>
                </div>
                <div className="flex items-center gap-4 text-gray-400 text-xs">
                  <span>Supplier Dropship Tangan Pertama</span>
                  <span>•</span>
                  <span>Google OAuth</span>
                  <span>•</span>
                  <span>Fast Asset Download</span>
                </div>
              </div>
            </footer>
          </ProductProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
