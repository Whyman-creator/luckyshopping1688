"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Category, Product, ProductAsset } from "@/types";
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_ASSETS } from "@/lib/mockData";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface ProductContextType {
  categories: Category[];
  products: Product[];
  assets: ProductAsset[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (catSlug: string) => void;
  filteredProducts: Product[];
  getProductBySlug: (slug: string) => Product | undefined;
  getAssetsByProductId: (productId: string) => ProductAsset[];
  addProduct: (product: Omit<Product, "id" | "slug">) => Promise<Product>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, "id" | "slug">) => Promise<Category>;
  addAsset: (asset: Omit<ProductAsset, "id">) => Promise<ProductAsset>;
  deleteAsset: (id: string) => Promise<void>;
  isLoading: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [assets, setAssets] = useState<ProductAsset[]>(INITIAL_ASSETS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("semua");
  const [isLoading, setIsLoading] = useState(false);

  // Initialize from LocalStorage or Supabase
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      // Check LocalStorage cache first for offline/demo persistence
      const savedCats = localStorage.getItem("mitra_hub_categories");
      const savedProds = localStorage.getItem("mitra_hub_products");
      const savedAssets = localStorage.getItem("mitra_hub_assets");

      if (savedCats) setCategories(JSON.parse(savedCats));
      if (savedProds) setProducts(JSON.parse(savedProds));
      if (savedAssets) setAssets(JSON.parse(savedAssets));

      // If Supabase is connected, fetch from database
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: dbCategories } = await supabase
            .from("categories")
            .select("*")
            .order("display_order", { ascending: true });

          const { data: dbProducts } = await supabase
            .from("products")
            .select("*, category:categories(*)")
            .eq("is_published", true)
            .order("created_at", { ascending: false });

          const { data: dbAssets } = await supabase
            .from("product_assets")
            .select("*")
            .order("created_at", { ascending: false });

          if (dbCategories && dbCategories.length > 0) {
            setCategories(dbCategories);
          }
          if (dbProducts && dbProducts.length > 0) {
            setProducts(dbProducts);
          }
          if (dbAssets && dbAssets.length > 0) {
            setAssets(dbAssets);
          }
        } catch (err) {
          console.error("Error loading data from Supabase:", err);
        }
      }

      setIsLoading(false);
    };

    loadData();
  }, []);

  // Filter products by search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      searchQuery.trim() === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.short_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.usp.some((u) => u.toLowerCase().includes(searchQuery.toLowerCase()));

    const currentCat = categories.find((c) => c.slug === selectedCategory);
    const matchesCategory =
      selectedCategory === "semua" ||
      product.category_id === currentCat?.id ||
      product.category?.slug === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const getProductBySlug = (slug: string) => {
    return products.find((p) => p.slug === slug || p.id === slug);
  };

  const getAssetsByProductId = (productId: string) => {
    return assets.filter((a) => a.product_id === productId);
  };

  // Add Product
  const addProduct = async (productData: Omit<Product, "id" | "slug">): Promise<Product> => {
    const slug = productData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const newProduct: Product = {
      ...productData,
      id: "prod-" + Date.now(),
      slug,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("products")
          .insert({
            name: newProduct.name,
            slug: newProduct.slug,
            category_id: newProduct.category_id,
            short_description: newProduct.short_description,
            full_description: newProduct.full_description,
            usp: newProduct.usp,
            target_market: newProduct.target_market,
            price: newProduct.price,
            price_consumer: newProduct.price,
            price_partner: newProduct.price,
            margin: 0,
            faqs: newProduct.faqs,
            copywritings: newProduct.copywritings,
            cover_image: newProduct.cover_image,
            is_published: true,
          })
          .select()
          .single();

        if (error) throw error;
        if (data) newProduct.id = data.id;
      } catch (err) {
        console.error("Error creating product in Supabase:", err);
      }
    }

    const updated = [newProduct, ...products];
    setProducts(updated);
    localStorage.setItem("mitra_hub_products", JSON.stringify(updated));
    return newProduct;
  };

  // Update Product
  const updateProduct = async (id: string, productData: Partial<Product>) => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("products").update(productData).eq("id", id);
      } catch (err) {
        console.error("Error updating product in Supabase:", err);
      }
    }

    const updated = products.map((p) => (p.id === id ? { ...p, ...productData } : p));
    setProducts(updated);
    localStorage.setItem("mitra_hub_products", JSON.stringify(updated));
  };

  // Delete Product
  const deleteProduct = async (id: string) => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("products").delete().eq("id", id);
      } catch (err) {
        console.error("Error deleting product in Supabase:", err);
      }
    }

    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    localStorage.setItem("mitra_hub_products", JSON.stringify(updated));
  };

  // Add Category
  const addCategory = async (catData: Omit<Category, "id" | "slug">): Promise<Category> => {
    const slug = catData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const newCategory: Category = {
      ...catData,
      id: "cat-" + Date.now(),
      slug,
      display_order: categories.length + 1,
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data } = await supabase.from("categories").insert(newCategory).select().single();
        if (data) newCategory.id = data.id;
      } catch (err) {
        console.error("Error adding category to Supabase:", err);
      }
    }

    const updated = [...categories, newCategory];
    setCategories(updated);
    localStorage.setItem("mitra_hub_categories", JSON.stringify(updated));
    return newCategory;
  };

  // Add Asset
  const addAsset = async (assetData: Omit<ProductAsset, "id">): Promise<ProductAsset> => {
    const newAsset: ProductAsset = {
      ...assetData,
      id: "ast-" + Date.now(),
      download_count: 0,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data } = await supabase.from("product_assets").insert(newAsset).select().single();
        if (data) newAsset.id = data.id;
      } catch (err) {
        console.error("Error adding asset to Supabase:", err);
      }
    }

    const updated = [newAsset, ...assets];
    setAssets(updated);
    localStorage.setItem("mitra_hub_assets", JSON.stringify(updated));
    return newAsset;
  };

  // Delete Asset
  const deleteAsset = async (id: string) => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("product_assets").delete().eq("id", id);
      } catch (err) {
        console.error("Error deleting asset from Supabase:", err);
      }
    }

    const updated = assets.filter((a) => a.id !== id);
    setAssets(updated);
    localStorage.setItem("mitra_hub_assets", JSON.stringify(updated));
  };

  return (
    <ProductContext.Provider
      value={{
        categories,
        products,
        assets,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        filteredProducts,
        getProductBySlug,
        getAssetsByProductId,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        addAsset,
        deleteAsset,
        isLoading,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
}
