"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useProducts } from "@/context/ProductContext";
import { formatRupiah } from "@/lib/utils";
import { uploadFileToR2 } from "@/lib/r2Upload";
import { Category, Product, ProductAsset, AssetCategoryType, MediaType } from "@/types";
import {
  ShieldAlert,
  Plus,
  Trash2,
  Package,
  Film,
  Image as ImageIcon,
  Layers,
  ArrowLeft,
  Sparkles,
  CheckCircle,
  AlertCircle,
  UploadCloud,
  FileText,
  Loader2,
  FileUp,
  Edit2,
  FolderPlus,
} from "lucide-react";

export default function AdminPage() {
  const { user, isAdmin, loginDemo } = useAuth();
  const {
    products,
    categories,
    assets,
    addProduct,
    deleteProduct,
    addAsset,
    deleteAsset,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useProducts();

  const [activeTab, setActiveTab] = useState<"products" | "assets" | "categories">("products");
  const [successMsg, setSuccessMsg] = useState("");

  // Form State: Add Product
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProdName, setNewProdName] = useState("");
  const [newProdCategoryId, setNewProdCategoryId] = useState("");
  const [newProdShortDesc, setNewProdShortDesc] = useState("");
  const [newProdFullDesc, setNewProdFullDesc] = useState("");
  const [newProdUsp, setNewProdUsp] = useState<string[]>([""]);
  const [newProdTargetMarket, setNewProdTargetMarket] = useState("");
  const [newProdPrice, setNewProdPrice] = useState<number>(0);
  const [newProdCover, setNewProdCover] = useState("");
  const [newProdCwTitle, setNewProdCwTitle] = useState("Status WhatsApp");
  const [newProdCwContent, setNewProdCwContent] = useState("");

  // Form State: Add Asset
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);
  const [assetProductId, setAssetProductId] = useState("");
  const [assetTitle, setAssetTitle] = useState("");
  const [assetMediaType, setAssetMediaType] = useState<MediaType>("image");
  const [assetCategoryType, setAssetCategoryType] = useState<AssetCategoryType>("feed");
  const [assetFileUrl, setAssetFileUrl] = useState("");
  const [assetFileSize, setAssetFileSize] = useState("");
  const [assetDimensions, setAssetDimensions] = useState("1080x1080 (1:1)");

  // R2 Direct Upload States
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [coverUploadProgress, setCoverUploadProgress] = useState(0);
  const [coverUploadError, setCoverUploadError] = useState("");

  const [isUploadingAsset, setIsUploadingAsset] = useState(false);
  const [assetUploadProgress, setAssetUploadProgress] = useState(0);
  const [assetUploadError, setAssetUploadError] = useState("");
  const [assetFileName, setAssetFileName] = useState("");
  const [assetUploadMode, setAssetUploadMode] = useState<"file" | "url">("file");

  // Form State: Add Category
  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [newCatIcon, setNewCatIcon] = useState("Package");

  // Form State: Edit Category
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editCatName, setEditCatName] = useState("");
  const [editCatDesc, setEditCatDesc] = useState("");
  const [editCatIcon, setEditCatIcon] = useState("Package");

  const notify = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  // If user is not admin, show guard screen
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-2">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Akses Khusus Admin & Pemilik</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          Halaman ini digunakan untuk mengunggah produk baru, menambahkan video/gambar iklan, dan mengatur kategori.
        </p>

        <div className="pt-4 flex flex-col gap-2.5">
          <button
            onClick={() => loginDemo("admin")}
            className="w-full py-3 px-4 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-sm font-bold transition shadow-md shadow-purple-700/20"
          >
            Masuk sebagai Admin (Mode Demo)
          </button>
          <Link
            href="/"
            className="w-full py-2.5 px-4 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  // Upload Handlers for Cloudflare R2
  const handleCoverFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingCover(true);
    setCoverUploadProgress(0);
    setCoverUploadError("");
    try {
      const res = await uploadFileToR2(file, "covers", (pct) => setCoverUploadProgress(pct));
      setNewProdCover(res.publicUrl);
      notify("Foto sampul berhasil diunggah ke Cloudflare R2!");
    } catch (err: any) {
      setCoverUploadError(err.message || "Gagal mengunggah foto sampul.");
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handleAssetFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingAsset(true);
    setAssetUploadProgress(0);
    setAssetUploadError("");
    setAssetFileName(file.name);

    // Auto-detect type
    const isVideo = file.type.startsWith("video/") || /\.(mp4|mov|webm|avi|mkv)$/i.test(file.name);
    const mediaType: MediaType = isVideo ? "video" : "image";
    setAssetMediaType(mediaType);
    if (isVideo) {
      setAssetCategoryType("story");
      setAssetDimensions("1080x1920 (9:16)");
    } else {
      setAssetCategoryType("feed");
      setAssetDimensions("1080x1080 (1:1)");
    }

    // Auto-set title if blank
    if (!assetTitle) {
      const cleanTitle = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
      setAssetTitle(cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1));
    }

    try {
      const res = await uploadFileToR2(file, isVideo ? "videos" : "photos", (pct) => {
        setAssetUploadProgress(pct);
      });
      setAssetFileUrl(res.publicUrl);
      setAssetFileSize(res.fileSize);
      notify(`${isVideo ? "Video" : "Foto"} "${file.name}" berhasil diunggah ke Cloudflare R2!`);
    } catch (err: any) {
      setAssetUploadError(err.message || "Gagal mengunggah file ke Cloudflare R2.");
    } finally {
      setIsUploadingAsset(false);
    }
  };

  // Handle Add Product Submit
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdCategoryId) {
      alert("Mohon lengkapi nama produk dan kategori.");
      return;
    }

    const validUsp = newProdUsp.filter((u) => u.trim() !== "");

    await addProduct({
      name: newProdName,
      category_id: newProdCategoryId,
      short_description: newProdShortDesc,
      full_description: newProdFullDesc || newProdShortDesc,
      usp: validUsp.length > 0 ? validUsp : ["Produk Berkualitas Tinggi", "Garansi Kepuasan Pelanggan"],
      target_market: newProdTargetMarket || "Semua kalangan konsumen.",
      price: Number(newProdPrice),
      price_consumer: Number(newProdPrice),
      price_partner: Number(newProdPrice),
      margin: 0,
      cover_image:
        newProdCover ||
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
      is_published: true,
      faqs: [
        {
          question: "Bagaimana cara pemesanan produk ini?",
          answer: "Mitra dapat langsung menghubungi admin atau menggunakan sistem order resmi.",
        },
      ],
      copywritings: [
        {
          id: "cw-" + Date.now(),
          title: newProdCwTitle || "Teks Promosi WhatsApp",
          tag: "WhatsApp Status",
          content:
            newProdCwContent ||
            `Ready stock ${newProdName}! Kualitas premium terjamin. Yuk langsung chat untuk order hari ini dapatkan harga promo spesial ✨`,
        },
      ],
    });

    notify(`Produk "${newProdName}" berhasil ditambahkan!`);
    setIsAddProductOpen(false);
    // Reset form
    setNewProdName("");
    setNewProdShortDesc("");
    setNewProdFullDesc("");
    setNewProdPrice(0);
    setNewProdCover("");
    setNewProdCwContent("");
  };

  // Handle Add Asset Submit
  const handleCreateAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetProductId || !assetTitle || !assetFileUrl) {
      alert("Mohon lengkapi produk tujuan, judul aset, dan URL file.");
      return;
    }

    await addAsset({
      product_id: assetProductId,
      title: assetTitle,
      media_type: assetMediaType,
      category_type: assetCategoryType,
      file_url: assetFileUrl,
      thumbnail_url:
        assetMediaType === "video"
          ? "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80"
          : assetFileUrl,
      file_size: assetFileSize || (assetMediaType === "video" ? "18 MB" : "2.5 MB"),
      dimensions: assetDimensions,
    });

    notify(`Bahan promosi "${assetTitle}" berhasil diunggah!`);
    setIsAddAssetOpen(false);
    setAssetTitle("");
    setAssetFileUrl("");
    setAssetFileSize("");
    setAssetFileName("");
    setAssetUploadProgress(0);
    setAssetUploadError("");
  };

  // Handle Add Category Submit
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;

    await addCategory({
      name: newCatName,
      description: newCatDesc,
      icon: newCatIcon,
    });

    notify(`Kategori "${newCatName}" berhasil ditambahkan!`);
    setNewCatName("");
    setNewCatDesc("");
  };

  const startEditingCategory = (cat: Category) => {
    setEditingCategory(cat);
    setEditCatName(cat.name);
    setEditCatDesc(cat.description || "");
    setEditCatIcon(cat.icon || "Package");
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editCatName) return;

    await updateCategory(editingCategory.id, {
      name: editCatName,
      description: editCatDesc,
      icon: editCatIcon,
    });

    notify(`Kategori "${editCatName}" berhasil diperbarui!`);
    setEditingCategory(null);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                Panel Kontrol Admin
              </h1>
              <span className="text-[11px] bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded-full">
                Owner Access
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Kelola katalog produk, unggah foto & video promosi, dan atur copywriting untuk mitra.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => setActiveTab("categories")}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold text-xs sm:text-sm transition shadow-sm ${
              activeTab === "categories"
                ? "bg-blue-600 text-white shadow-blue-600/20"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Layers className="w-4 h-4 text-blue-500" />
            <span>Kelola Kategori</span>
          </button>

          <button
            onClick={() => setIsAddAssetOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-semibold text-xs sm:text-sm transition shadow-sm"
          >
            <UploadCloud className="w-4 h-4 text-emerald-400" />
            <span>Upload Aset Baru</span>
          </button>

          <button
            onClick={() => setIsAddProductOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm transition shadow-sm shadow-emerald-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Produk</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2 text-xs sm:text-sm font-semibold animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Summary Stat Cards (Clickable) */}
      <div className="grid grid-cols-3 gap-3 sm:gap-5">
        <button
          onClick={() => setActiveTab("products")}
          className={`p-4 sm:p-5 rounded-2xl border text-left transition flex items-center justify-between cursor-pointer ${
            activeTab === "products"
              ? "bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/20 shadow-sm"
              : "bg-white border-gray-100 hover:border-gray-200 shadow-sm hover:shadow"
          }`}
        >
          <div>
            <span className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider block">
              Total Produk
            </span>
            <span className="text-xl sm:text-3xl font-extrabold text-gray-900 mt-1 block">
              {products.length}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
        </button>

        <button
          onClick={() => setActiveTab("assets")}
          className={`p-4 sm:p-5 rounded-2xl border text-left transition flex items-center justify-between cursor-pointer ${
            activeTab === "assets"
              ? "bg-rose-50/70 border-rose-300 ring-2 ring-rose-500/20 shadow-sm"
              : "bg-white border-gray-100 hover:border-gray-200 shadow-sm hover:shadow"
          }`}
        >
          <div>
            <span className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider block">
              Bahan Promosi
            </span>
            <span className="text-xl sm:text-3xl font-extrabold text-gray-900 mt-1 block">
              {assets.length}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Film className="w-5 h-5" />
          </div>
        </button>

        <button
          onClick={() => setActiveTab("categories")}
          className={`p-4 sm:p-5 rounded-2xl border text-left transition flex items-center justify-between cursor-pointer ${
            activeTab === "categories"
              ? "bg-blue-50/70 border-blue-300 ring-2 ring-blue-500/20 shadow-sm"
              : "bg-white border-gray-100 hover:border-gray-200 shadow-sm hover:shadow"
          }`}
        >
          <div>
            <span className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider block">
              Kategori Produk
            </span>
            <span className="text-xl sm:text-3xl font-extrabold text-gray-900 mt-1 block">
              {categories.length}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200 space-x-6">
        <button
          onClick={() => setActiveTab("products")}
          className={`pb-3 text-sm font-bold transition flex items-center gap-2 ${
            activeTab === "products"
              ? "text-emerald-700 border-b-2 border-emerald-600"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Daftar Produk ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("assets")}
          className={`pb-3 text-sm font-bold transition flex items-center gap-2 ${
            activeTab === "assets"
              ? "text-emerald-700 border-b-2 border-emerald-600"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Bahan Promosi & Video ({assets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("categories")}
          className={`pb-3 text-sm font-bold transition flex items-center gap-2 ${
            activeTab === "categories"
              ? "text-emerald-700 border-b-2 border-emerald-600"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Kategori Produk ({categories.length})</span>
        </button>
      </div>

      {/* TAB 1: PRODUCTS TABLE */}
      {activeTab === "products" && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Produk</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Harga Produk</th>
                  <th className="py-3 px-4 text-center">Bahan Iklan</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p) => {
                  const cat = categories.find((c) => c.id === p.category_id);
                  const prodAssets = assets.filter((a) => a.product_id === p.id);

                  return (
                    <tr key={p.id} className="hover:bg-gray-50/70 transition">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img
                          src={p.cover_image}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                        />
                        <div>
                          <Link
                            href={`/produk/${p.slug}`}
                            className="font-bold text-gray-900 hover:text-emerald-700 block line-clamp-1"
                          >
                            {p.name}
                          </Link>
                          <span className="text-[11px] text-gray-400 line-clamp-1">
                            {p.short_description}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700">
                          {cat?.name || "Umum"}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-bold text-emerald-700">
                        {formatRupiah(p.price || p.price_consumer || 0)}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                          {prodAssets.length} Berkas
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            if (confirm(`Yakin ingin menghapus produk "${p.name}"?`)) {
                              deleteProduct(p.id);
                              notify(`Produk "${p.name}" berhasil dihapus.`);
                            }
                          }}
                          className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                          title="Hapus Produk"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ASSETS TABLE */}
      {activeTab === "assets" && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Media</th>
                  <th className="py-3 px-4">Judul Bahan Promosi</th>
                  <th className="py-3 px-4">Produk Terkait</th>
                  <th className="py-3 px-4">Format Iklan</th>
                  <th className="py-3 px-4">Ukuran</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {assets.map((ast) => {
                  const prod = products.find((p) => p.id === ast.product_id);
                  const isVideo = ast.media_type === "video";

                  return (
                    <tr key={ast.id} className="hover:bg-gray-50/70 transition">
                      <td className="py-3 px-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-900 overflow-hidden relative flex-shrink-0">
                          <img
                            src={ast.thumbnail_url || ast.file_url}
                            alt={ast.title}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[8px] px-1 rounded uppercase">
                            {isVideo ? "VIDEO" : "IMG"}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-bold text-gray-900 block">{ast.title}</span>
                        <a
                          href={ast.file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-emerald-600 hover:underline line-clamp-1 truncate max-w-xs block mt-0.5"
                        >
                          {ast.file_url}
                        </a>
                      </td>

                      <td className="py-3 px-4 font-medium text-gray-700">
                        {prod?.name || "Produk dihapus"}
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-gray-100 text-gray-700">
                          {ast.category_type.replace("_", " ")}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-gray-500 text-xs">
                        {ast.file_size || "-"} ({ast.dimensions || "-"})
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            if (confirm(`Hapus berkas promosi "${ast.title}"?`)) {
                              deleteAsset(ast.id);
                              notify("Berkas promosi berhasil dihapus.");
                            }
                          }}
                          className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                          title="Hapus Aset"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CATEGORIES */}
      {activeTab === "categories" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Add Category Form */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>Tambah Kategori Baru</span>
            </h3>
            <form onSubmit={handleCreateCategory} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Nama Kategori</label>
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Contoh: Perawatan Tubuh"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Deskripsi Singkat</label>
                <input
                  type="text"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Deskripsi kategori..."
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Pilihan Ikon</label>
                <select
                  value={newCatIcon}
                  onChange={(e) => setNewCatIcon(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-emerald-600 bg-white"
                >
                  <option value="Sparkles">Sparkles (Kecantikan/Skincare)</option>
                  <option value="Shirt">Shirt (Fashion/Hijab)</option>
                  <option value="HeartPulse">HeartPulse (Kesehatan/Herbal)</option>
                  <option value="Headphones">Headphones (Gadget)</option>
                  <option value="Utensils">Utensils (Kuliner/F&B)</option>
                  <option value="Package">Package (Umum)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-sm"
              >
                Simpan Kategori
              </button>
            </form>
          </div>

          {/* Categories List */}
          <div className="md:col-span-2 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
            <h3 className="font-bold text-gray-900 mb-2 flex items-center justify-between">
              <span>Daftar Kategori Aktif</span>
              <span className="text-xs text-gray-400 font-normal">
                {categories.length} Kategori Tersedia
              </span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map((c) => {
                const count = products.filter((p) => p.category_id === c.id).length;
                return (
                  <div
                    key={c.id}
                    className="p-4 rounded-2xl border border-gray-200 flex flex-col justify-between gap-3 bg-gray-50/50 hover:bg-white transition hover:shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-bold text-xs sm:text-sm text-gray-900">{c.name}</h4>
                        <span className="text-[11px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-lg border border-emerald-100">
                          {count} Produk
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                        {c.description || "Tanpa deskripsi"}
                      </p>
                    </div>

                    <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-gray-200/60">
                      <button
                        onClick={() => startEditingCategory(c)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => {
                          if (
                            confirm(
                              `Hapus kategori "${c.name}"? Produk yang terkait akan tetap ada tetapi tanpa kategori.`
                            )
                          ) {
                            deleteCategory(c.id);
                            notify(`Kategori "${c.name}" berhasil dihapus.`);
                          }
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Hapus Kategori"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT CATEGORY */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-emerald-600" />
                <span>Edit Kategori</span>
              </h2>
              <button
                onClick={() => setEditingCategory(null)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateCategory} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Nama Kategori</label>
                <input
                  type="text"
                  value={editCatName}
                  onChange={(e) => setEditCatName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Deskripsi Singkat</label>
                <input
                  type="text"
                  value={editCatDesc}
                  onChange={(e) => setEditCatDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Pilihan Ikon</label>
                <select
                  value={editCatIcon}
                  onChange={(e) => setEditCatIcon(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-emerald-600 bg-white"
                >
                  <option value="Sparkles">Sparkles (Kecantikan/Skincare)</option>
                  <option value="Shirt">Shirt (Fashion/Hijab)</option>
                  <option value="HeartPulse">HeartPulse (Kesehatan/Herbal)</option>
                  <option value="Headphones">Headphones (Gadget)</option>
                  <option value="Utensils">Utensils (Kuliner/F&B)</option>
                  <option value="Package">Package (Umum)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-3.5 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD PRODUCT FORM */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 my-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-600" />
                <span>Tambah Produk Baru ke Katalog</span>
              </h2>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Nama Produk *
                  </label>
                  <input
                    type="text"
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    placeholder="Contoh: Serum Glow Radiance"
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-emerald-600"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Kategori *
                  </label>
                  <select
                    value={newProdCategoryId}
                    onChange={(e) => setNewProdCategoryId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-emerald-600 bg-white"
                    required
                  >
                    <option value="">-- Pilih Kategori --</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Deskripsi Singkat (Tampil di Card Katalog)
                </label>
                <input
                  type="text"
                  value={newProdShortDesc}
                  onChange={(e) => setNewProdShortDesc(e.target.value)}
                  placeholder="Ringkasan 1-2 kalimat pemikat pembeli..."
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Deskripsi Lengkap Produk
                </label>
                <textarea
                  rows={4}
                  value={newProdFullDesc}
                  onChange={(e) => setNewProdFullDesc(e.target.value)}
                  placeholder="Deskripsi produk, bahan, ukuran, spesifikasi..."
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-emerald-600"
                />
              </div>

              {/* Price Input */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Harga Produk (Rp) *
                </label>
                <input
                  type="number"
                  value={newProdPrice || ""}
                  onChange={(e) => setNewProdPrice(Number(e.target.value))}
                  placeholder="Contoh: 125000"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-emerald-600 bg-white"
                  required
                />
              </div>

              {/* Cover Image with R2 Upload */}
              <div className="space-y-2 bg-gray-50/70 p-4 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700 block">
                    Foto Sampul (Cover Image)
                  </label>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100/70 px-2 py-0.5 rounded-full">
                    Cloudflare R2
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 text-xs font-semibold rounded-xl transition shadow-sm">
                    <FileUp className="w-4 h-4 text-emerald-600" />
                    <span>{isUploadingCover ? "Mengunggah..." : "Pilih Foto dari Komputer"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverFileUpload}
                      disabled={isUploadingCover}
                      className="hidden"
                    />
                  </label>

                  {isUploadingCover && (
                    <div className="flex items-center gap-2 text-xs text-emerald-600 font-semibold">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Mengunggah... {coverUploadProgress}%</span>
                    </div>
                  )}
                </div>

                {coverUploadError && (
                  <p className="text-[11px] text-rose-500 font-medium">{coverUploadError}</p>
                )}

                {newProdCover && (
                  <div className="flex items-center gap-3 p-2 bg-emerald-50 rounded-xl border border-emerald-200">
                    <img
                      src={newProdCover}
                      alt="Cover Preview"
                      className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-emerald-700 block">✓ Foto Sampul Terpilih:</span>
                      <p className="text-[11px] text-gray-600 truncate">{newProdCover}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNewProdCover("")}
                      className="text-xs text-rose-500 hover:underline px-2"
                    >
                      Hapus
                    </button>
                  </div>
                )}

                <div>
                  <input
                    type="url"
                    value={newProdCover}
                    onChange={(e) => setNewProdCover(e.target.value)}
                    placeholder="Atau tempel link URL foto langsung di sini..."
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-emerald-600 bg-white"
                  />
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    Bisa upload foto langsung ke Cloudflare R2 atau paste link manual.
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20"
                >
                  Simpan Produk Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD ASSET / VIDEO / IMAGE FORM */}
      {isAddAssetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-gray-100 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-emerald-600" />
                <span>Upload Bahan Iklan (Video / Foto)</span>
              </h2>
              <button
                onClick={() => setIsAddAssetOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAsset} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Pilih Produk Terkait *
                </label>
                <select
                  value={assetProductId}
                  onChange={(e) => setAssetProductId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-emerald-600 bg-white"
                  required
                >
                  <option value="">-- Pilih Produk --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Judul Berkas Promosi *
                </label>
                <input
                  type="text"
                  value={assetTitle}
                  onChange={(e) => setAssetTitle(e.target.value)}
                  placeholder="Contoh: Video TikTok Testimoni 14 Hari"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Jenis Media *
                  </label>
                  <select
                    value={assetMediaType}
                    onChange={(e) => {
                      const type = e.target.value as MediaType;
                      setAssetMediaType(type);
                      if (type === "video") {
                        setAssetCategoryType("story");
                        setAssetDimensions("1080x1920 (9:16)");
                      } else {
                        setAssetCategoryType("feed");
                        setAssetDimensions("1080x1080 (1:1)");
                      }
                    }}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-emerald-600 bg-white"
                  >
                    <option value="image">Gambar / Foto HD</option>
                    <option value="video">Video MP4</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Format / Kategori Iklan *
                  </label>
                  <select
                    value={assetCategoryType}
                    onChange={(e) => setAssetCategoryType(e.target.value as AssetCategoryType)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-emerald-600 bg-white"
                  >
                    <option value="story">Story & TikTok (9:16)</option>
                    <option value="feed">Feed Instagram (1:1)</option>
                    <option value="video_promo">Video Promosi Landscape</option>
                    <option value="testimoni">Testimoni Pelanggan</option>
                    <option value="banner">Banner Iklan</option>
                  </select>
                </div>
              </div>

              {/* Direct File Upload to Cloudflare R2 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700">
                    Pilih File Foto / Video (Upload Langsung ke Cloudflare R2)
                  </label>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100/70 px-2 py-0.5 rounded-full">
                    Cloudflare R2 Direct
                  </span>
                </div>

                <div
                  className={`relative border-2 border-dashed rounded-2xl p-5 text-center transition ${
                    assetFileUrl
                      ? "border-emerald-300 bg-emerald-50/40"
                      : "border-gray-200 hover:border-emerald-500 bg-gray-50/50"
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleAssetFileUpload}
                    disabled={isUploadingAsset}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                  />

                  {isUploadingAsset ? (
                    <div className="space-y-3 py-2">
                      <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-700">
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                        <span>Mengunggah ke Cloudflare R2... {assetUploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden max-w-xs mx-auto">
                        <div
                          className="bg-emerald-600 h-2.5 rounded-full transition-all duration-200"
                          style={{ width: `${assetUploadProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-[10px] text-gray-500 truncate max-w-xs mx-auto">{assetFileName}</p>
                    </div>
                  ) : assetFileUrl ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-700">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span>File Berhasil Diunggah ke Cloudflare R2!</span>
                      </div>

                      {/* Preview Media */}
                      {assetMediaType === "video" ? (
                        <div className="max-w-xs mx-auto rounded-xl overflow-hidden bg-black shadow-sm">
                          <video src={assetFileUrl} controls className="max-h-36 w-full object-contain" />
                        </div>
                      ) : (
                        <div className="max-w-xs mx-auto rounded-xl overflow-hidden shadow-sm">
                          <img
                            src={assetFileUrl}
                            alt="Preview"
                            className="max-h-36 mx-auto object-cover rounded-xl"
                          />
                        </div>
                      )}

                      <p className="text-[11px] text-gray-500">Klik area ini atau seret file baru untuk mengganti.</p>
                    </div>
                  ) : (
                    <div className="space-y-2 py-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                        <FileUp className="w-5 h-5" />
                      </div>
                      <div className="text-xs text-gray-700">
                        <span className="font-bold text-emerald-600 hover:underline">Klik untuk pilih file</span> atau seret file ke sini
                      </div>
                      <p className="text-[10px] text-gray-400">
                        Mendukung MP4, MOV, WEBM, JPG, PNG (Langsung terunggah ke Cloudflare R2).
                      </p>
                    </div>
                  )}
                </div>

                {assetUploadError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{assetUploadError}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  URL File Video / Gambar *
                </label>
                <input
                  type="url"
                  value={assetFileUrl}
                  onChange={(e) => setAssetFileUrl(e.target.value)}
                  placeholder="https://... (Terisi otomatis saat Anda pilih file di atas)"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-emerald-600"
                  required
                />
                <span className="text-[10px] text-gray-400 mt-1 block">
                  Terisi otomatis setelah upload, atau Anda bisa paste link manual.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Resolusi / Rasio
                  </label>
                  <input
                    type="text"
                    value={assetDimensions}
                    onChange={(e) => setAssetDimensions(e.target.value)}
                    placeholder="1080x1920 (9:16)"
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Estimasi Ukuran File
                  </label>
                  <input
                    type="text"
                    value={assetFileSize}
                    onChange={(e) => setAssetFileSize(e.target.value)}
                    placeholder="Contoh: 14.5 MB"
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddAssetOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20"
                >
                  Upload & Pasang Aset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
