# Luckyshopping1688 — Portal Katalog Produk & Bank Aset Promosi

Platform khusus mitra dan reseller untuk mengakses **Product Knowledge lengkap**, **materi iklan video (Reels/TikTok/Story)**, **foto feed HD**, **caption siap salin (1-click copy)**, dan **unduhan paket ZIP**.

---

## 🚀 Fitur Utama

1. **Katalog Produk & Filter Kategori:**
   - Pencarian instan (search bar) berdasarkan nama, deskripsi, atau keunggulan produk.
   - Filter pill kategori dinamis (Skincare, Fashion/Hijab, Herbal, Gadget, Kuliner, dll).
2. **Product Knowledge Terstruktur:**
   - Deskripsi formula & spesifikasi produk.
   - USP (Keunggulan Utama) poin per poin.
   - Target Pasar & Strategi Penjualan.
   - Struktur Harga & Margin Profit Mitra (Modal vs HET -> Estimasi Keuntungan Bersih).
   - Tanya Jawab Konsumen (FAQ Accordion).
3. **Materi Iklan & Bank Konten:**
   - Filter format media: Story / TikTok (9:16), Foto Feed (1:1), Video Promosi, Testimoni.
   - **Pemutar Video Terintegrasi:** Video dapat langsung diputar di website tanpa buffering.
   - **Preview Gambar HD:** Tampilan gambar tajam dengan rasio siap pakai di media sosial.
   - **Tombol "Unduh Semua Bahan (.ZIP)":** Mengompresi seluruh foto dan video produk menjadi 1 file ZIP dalam hitungan detik.
4. **Copywriting Siap Pakai:**
   - Template iklan: *Gaya Storytelling*, *Gaya Hard Selling / Promo Kilat*, dan *Status WhatsApp*.
   - Tombol 1-klik "Salin Caption" dengan animasi notifikasi tersalin.
5. **Keamanan Sesi Tunggal (Single Active Session):**
   - Mendeteksi perangkat aktif. Jika mitra login di HP kemudian login di Komputer, sistem di HP otomatis mengakhiri sesi lama dan menampilkan peringatan.
   - Terdapat tombol simulator di navbar untuk menguji fitur sesi ganda ini secara instan.
6. **Panel Admin (`/admin`):**
   - Tambah produk baru (lengkap dengan USP, harga modal, harga eceran, margin, dan copywriting).
   - Upload bahan iklan baru (Video / Foto) dengan menentukan format rasio (Story 9:16, Feed 1:1, dll).
   - Kelola kategori produk.

---

## 🛠️ Cara Menjalankan Aplikasi Secara Lokal

1. Buka terminal di folder project (`g:\WEBSITE`):
   ```bash
   npm run dev
   ```
2. Buka browser di [http://localhost:3000](http://localhost:3000).
3. **Mode Demo Langsung Aktif:** Anda bisa langsung mencoba semua fitur, memutar video, mengunduh file ZIP, menyalin teks iklan, hingga menguji panel admin tanpa perlu setup database terlebih dahulu!

---

## 🔐 Cara Menghubungkan Google OAuth & Supabase (Produksi)

Jika Anda siap menghubungkan autentikasi Google dan database PostgreSQL Supabase:

### Langkah 1: Buat Proyek di Supabase
1. Daftar gratis di [supabase.com](https://supabase.com).
2. Buat proyek baru (*New Project*).
3. Buka menu **SQL Editor**, buka file `supabase/schema.sql` di proyek ini, copy seluruh kodenya dan klik **Run**.

### Langkah 2: Setup Google OAuth di Google Cloud Console
1. Buka [Google Cloud Console](https://console.cloud.google.com/).
2. Buat OAuth 2.0 Client ID (Web application).
3. Pada *Authorized redirect URIs*, masukkan URL dari Supabase:
   `https://<YOUR-PROJECT-ID>.supabase.co/auth/v1/callback`
4. Copy **Client ID** dan **Client Secret** ke dashboard Supabase:
   *Buka Authentication > Providers > Google*, masukkan Client ID & Secret, lalu aktifkan (*Toggle ON*).

### Langkah 3: Konfigurasi Environment Variables
Buat file `.env.local` di folder root:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_ADMIN_EMAILS=email-anda@gmail.com
```

---

## 📦 Tech Stack
- **Framework:** Next.js 15 (App Router, React 19)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Archive/ZIP:** JSZip
- **Database & Auth:** Supabase (PostgreSQL + Realtime + Google OAuth)
