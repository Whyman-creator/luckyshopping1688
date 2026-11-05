export type UserRole = 'admin' | 'mitra';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  active_session_id?: string;
  last_device?: string;
  last_ip?: string;
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  display_order?: number;
}

export type MediaType = 'image' | 'video';

export type AssetCategoryType = 'feed' | 'story' | 'video_promo' | 'testimoni' | 'banner';

export interface ProductAsset {
  id: string;
  product_id: string;
  title: string;
  media_type: MediaType;
  category_type: AssetCategoryType;
  file_url: string;
  thumbnail_url?: string;
  file_size?: string;
  dimensions?: string; // e.g. "1080x1080 (1:1)" or "1080x1920 (9:16)"
  download_count?: number;
  created_at?: string;
}

export interface Copywriting {
  id: string;
  title: string;
  tag: string; // e.g. "Storytelling", "Hard Selling", "WhatsApp Status", "Promo Kilat"
  content: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  category?: Category;
  short_description: string;
  full_description: string;
  usp: string[]; // Key selling points
  target_market: string;
  price: number; // Harga Langsung Produk
  price_consumer?: number; // legacy fallback
  price_partner?: number; // legacy fallback
  margin?: number; // legacy fallback
  faqs: FAQ[];
  copywritings: Copywriting[];
  cover_image: string;
  is_published: boolean;
  assets?: ProductAsset[];
  created_at?: string;
  updated_at?: string;
}
