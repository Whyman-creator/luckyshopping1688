import { Category, Product, ProductAsset } from "@/types";

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: "cat-1",
    name: "Skincare & Kecantikan",
    slug: "skincare-kecantikan",
    description: "Serum, toner, sunscreen, dan perawatan wajah terlaris.",
    icon: "Sparkles",
    display_order: 1,
  },
  {
    id: "cat-2",
    name: "Fashion & Hijab",
    slug: "fashion-hijab",
    description: "Koleksi hijab voal, gamis, dan outfit trendy.",
    icon: "Shirt",
    display_order: 2,
  },
  {
    id: "cat-3",
    name: "Herbal & Kesehatan",
    slug: "herbal-kesehatan",
    description: "Madu murni, suplemen herbal, dan peningkat imun tubuh.",
    icon: "HeartPulse",
    display_order: 3,
  },
  {
    id: "cat-4",
    name: "Gadget & Aksesoris",
    slug: "gadget-aksesoris",
    description: "TWS Earphone, smartwatch, dan aksesoris HP kekinian.",
    icon: "Headphones",
    display_order: 4,
  },
  {
    id: "cat-5",
    name: "Makanan & Minuman",
    slug: "makanan-minuman",
    description: "Camilan viral dan kopi bubuk nusantara.",
    icon: "Utensils",
    display_order: 5,
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Glow Radiance 10% Niacinamide Serum",
    slug: "glow-radiance-niacinamide-serum",
    category_id: "cat-1",
    short_description: "Serum pencerah wajah dengan 10% Niacinamide & Alpha Arbutin untuk memudarkan flek hitam dan meratakan warna kulit dalam 14 hari.",
    full_description: "Glow Radiance Serum diformulasikan khusus dengan konsentrasi tinggi Niacinamide murni 10% dan Alpha Arbutin 2%. Bertekstur ringan dan cepat meresap tanpa rasa lengket. Telah lolos uji dermatologi dan aman untuk semua jenis kulit termasuk kulit sensitif. Membantu mengontrol produksi sebum berlebih, menyamarkan pori-pori besar, dan mengunci kelembapan kulit wajah sepanjang hari.",
    usp: [
      "Mengandung 10% Niacinamide Medis + 2% Alpha Arbutin",
      "Hasil terlihat dalam 14 hari pemakaian rutin",
      "Tekstur cair ringan cepat meresap (Water-drop formula)",
      "BPOM Certified (NA18231901234) & Halal MUI",
      "Aman untuk ibu hamil & menyusui (Fragrance Free)"
    ],
    target_market: "Wanita dan pria usia 18-40 tahun yang memiliki keluhan bekas jerawat PIE/PIH, kulit kusam, pori-pori besar, dan warna kulit tidak merata.",
    price: 129000,
    price_consumer: 129000,
    price_partner: 79000,
    margin: 50000,
    cover_image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=80",
    is_published: true,
    faqs: [
      {
        question: "Berapa lama waktu yang dibutuhkan hingga hasilnya terlihat?",
        answer: "Rata-rata konsumen mulai merasakan kulit lebih halus dan lembap sejak 3 hari pertama. Untuk flek hitam dan bekas jerawat, hasil signifikan terlihat pada hari ke-14 dengan pemakaian teratur pagi dan malam."
      },
      {
        question: "Apakah aman dipakai bersamaan dengan Vitamin C atau Retinol?",
        answer: "Serum ini sangat lembut (pH balance 5.5). Aman digunakan berbarengan, namun disarankan Niacinamide di pagi hari dan Retinol di malam hari untuk hasil terbaik."
      },
      {
        question: "Apakah bisa untuk kulit berminyak dan berjerawat?",
        answer: "Sangat direkomendasikan! Niacinamide terbukti klinis membantu mengontrol minyak berlebih dan meredakan kemerahan pada jerawat aktif."
      }
    ],
    copywritings: [
      {
        id: "cw-1-1",
        title: "Gaya Storytelling (Cocok untuk WhatsApp & IG)",
        tag: "Storytelling",
        content: `Dulu tiap kali ngaca, selalu minder sama bekas jerawat yang nggak hilang-hilang padahal udah coba berbagai skincare 😭\n\nSampai akhirnya nemuin Glow Radiance Serum ini. Teksturnya beneran ringan banget, nggak bikin lengket sama sekali. Dalam 2 minggu flek hitam mulai pudar dan muka jadi lebih glowing cerah natural ✨\n\nBuat temen-temen yang punya masalah sama, mumpung hari ini lagi ada promo diskon khusus mitra! Langsung klik link di bio yaa sebelum kehabisan!`
      },
      {
        id: "cw-1-2",
        title: "Gaya Hard Selling / Promo Kilat",
        tag: "Promo Kilat",
        content: `🔥 PROMO SPESIAL HARI INI SAJA! 🔥\n\nPunya masalah wajah kusam & bekas jerawat membandel? Saatnya atasi dengan GLOW RADIANCE SERUM (10% Niacinamide + Alpha Arbutin)!\n\n✅ Lulus Uji BPOM & Halal\n✅ Cerahkan wajah dalam 14 Hari\n✅ Garansi 100% Produk Original\n\nHarga Normal: Rp 179.000\nHari ini CUMA: Rp 129.000 (Hemat Rp 50.000!)\n\nSlot promo terbatas hanya untuk 20 orang pertama. Order sekarang via chat!`
      },
      {
        id: "cw-1-3",
        title: "Status Singkat WhatsApp (WA Story)",
        tag: "WhatsApp Status",
        content: `Rahasia kulit glowing bebas noda hitam tanpa filter kamera 😍 Cobain serum yang lagi viral ini, order hari ini dapet bonus konsultasi gratis lho! Chat yuk 📲`
      }
    ]
  },
  {
    id: "prod-2",
    name: "Voal Silk Premium Hijab Segiempat (Waterproof Edition)",
    slug: "voal-silk-premium-hijab",
    category_id: "cat-2",
    short_description: "Hijab voal premium dengan teknologi water-repellent (tahan percikan air), tegak di dahi seharian, dan motif eksklusif signature.",
    full_description: "Koleksi Hijab Segiempat Voal Silk Signature menghadirkan kemewahan bahan voal ultra-fine yang lembut dipadukan dengan kilau anggun silk. Dilengkapi finishing nano-coating tahan percikan air, membuat hijab tetap rapi dan tidak basah saat terkena cipratan air atau hujan rintik. Mudah dibentuk, tegak sempurna tanpa letoy di dahi, serta adem dipakai seharian di iklim tropis.",
    usp: [
      "Teknologi Water-Repellent (Tahan percikan air & tidak gampang kotor)",
      "Bahan Voal Ultra-Fine mix Silk: Lembut, jatuh, dan glowing mewah",
      "Tegak paripurna di dahi tanpa perlu disemprot spray",
      "Laser cut finishing pinggiran rapi dan presisi",
      "Motif original signature tidak pasaran di pasaran"
    ],
    target_market: "Wanita muslimah, mahasiswi, wanita karir, dan ibu muda usia 20-50 tahun yang mengutamakan kenyamanan, kepraktisan, dan tampilan berkelas.",
    price: 95000,
    price_consumer: 95000,
    price_partner: 55000,
    margin: 40000,
    cover_image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80",
    is_published: true,
    faqs: [
      {
        question: "Apakah sifat tahan airnya luntur saat dicuci?",
        answer: "Lapisan water-repellent bertahan hingga 30+ kali cuci jika dicuci manual tanpa pemutih keras dan disetrika dengan suhu sedang."
      },
      {
        question: "Berapa ukuran hijabnya?",
        answer: "Ukuran standar syar'i nyaman: 115 cm x 115 cm, menutup dada dengan sempurna."
      }
    ],
    copywritings: [
      {
        id: "cw-2-1",
        title: "Gaya Edukasi & Solusi Masalah",
        tag: "Storytelling",
        content: `Pernah nggak sih lagi buru-buru, eh hijabnya letoy di dahi terus kena cipratan minum langsung bernoda? 🙈\n\nNih kenalin Hijab Voal Silk Waterproof! Sekali bentuk langsung tegak rapi seharian, dan yang paling keren kalau kecipratan air tinggal diusap langsung kering!\n\nTersedia 12 pilihan warna pastel dan bold. Yuk amankan warna favoritmu sekarang!`
      },
      {
        id: "cw-2-2",
        title: "Broadcast WhatsApp",
        tag: "WhatsApp Status",
        content: `Restock lagi hijab voal silk terlaris yang tahan cipratan air! 🧕✨ Bahan adem, gampang tegak, motif mewah. Beli 3 gratis ongkir lho. Tanya warna yuk, stok rebutan banget!`
      }
    ]
  },
  {
    id: "prod-3",
    name: "Madu Hutan Liar Propolis Trigona 500gr",
    slug: "madu-hutan-propolis-trigona",
    category_id: "cat-3",
    short_description: "Madu murni mentah (raw honey) dari lebah tanpa sengat hutan tropis, kaya flavonoid dan propolis aktif untuk stamina dan daya tahan tubuh.",
    full_description: "Madu Hutan Propolis dipanen langsung dari sarang lebah Trigona hutan tropis pedalaman nusantara tanpa proses pemanasan atau pasteurisasi (*100% Raw Honey*). Mempertahankan seluruh enzim hidup, asam amino, propolis, dan bee pollen alami. Memiliki rasa manis asam segar alami yang khas, sangat baik untuk menjaga stamina, menyembuhkan radang tenggorokan, dan menstabilkan gula darah.",
    usp: [
      "100% Madu Mentah Murni (Raw Unprocessed Honey)",
      "Tinggi kandungan Propolis & Flavonoid alami lebah Trigona",
      "Kadar air alami < 20% tanpa penambahan sirup atau gula",
      "Izin Edar BPOM MD & Sertifikat Uji Lab Kemurnian",
      "Kemasan botol tebal anti pecah dengan food-grade safety seal"
    ],
    target_market: "Keluarga, lansia, penderita radang tenggorokan / batuk kronis, pekerja keras, dan orang tua yang mencari suplemen alami untuk anak.",
    price: 165000,
    price_consumer: 165000,
    price_partner: 105000,
    margin: 60000,
    cover_image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1200&q=80",
    is_published: true,
    faqs: [
      {
        question: "Apakah madu ini aman untuk penderita diabetes?",
        answer: "Madu Trigona memiliki indeks glikemik rendah dan didominasi fruktosa alami. Banyak konsumen penderita diabetes mengonsumsinya untuk imun, namun tetap disarankan 1 sendok takar per hari."
      },
      {
        question: "Kenapa rasanya ada sedikit asam segar?",
        answer: "Itu adalah ciri khas madu lebah Trigona asli karena tingginya kandungan asam amino dan propolis alami, bukan karena basi."
      }
    ],
    copywritings: [
      {
        id: "cw-3-1",
        title: "Gaya Sayang Keluarga / Kesehatan",
        tag: "Storytelling",
        content: `Musim pancaroba begini gampang banget anak dan pasangan drop kena flu batuk 🤧\n\nDaripada buru-buru minum obat kimia, sekarang rutin sedia 1 sendok Madu Hutan Propolis Trigona tiap pagi. Rasanya manis-asam segar alami disukai anak-anak, dan terbukti imun badan jadi jauh lebih kuat!\n\nYuk ikhtiar sehat keluarga dengan madu murni bersertifikat lab. Klik pesan sekarang ya!`
      }
    ]
  },
  {
    id: "prod-4",
    name: "AirSound ANC True Wireless Earbuds",
    slug: "airsound-anc-wireless-earbuds",
    category_id: "cat-4",
    short_description: "TWS Earphone dengan Active Noise Cancellation hingga -35dB, baterai tahan 36 jam, dan bass bertenaga Hi-Res Audio.",
    full_description: "AirSound ANC menghadirkan pengalaman mendengarkan musik tanpa gangguan berkat teknologi Hybrid Active Noise Cancellation yang mampu meredam kebisingan luar hingga 35dB. Dilengkapi 10mm dynamic driver graphene untuk bass yang dalam dan vokal jernih. Latensi ultra rendah 40ms membuat main game dan nonton film sinkron sempurna.",
    usp: [
      "Hybrid Active Noise Cancellation (-35dB)",
      "Ketahanan Baterai Total hingga 36 Jam dengan Charging Case",
      "Bluetooth 5.3 koneksi stabil jangkauan 15 meter",
      "Dual Mic ENC untuk telepon jernih tanpa suara angin",
      "Tahan Percikan Air & Keringat (IPX5 Waterproof)"
    ],
    target_market: "Pelajar, pekerja WFH, pecinta musik, gamer, dan pengendara yang membutuhkan earphone jernih dan awet.",
    price: 249000,
    price_consumer: 249000,
    price_partner: 159000,
    margin: 90000,
    cover_image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1200&q=80",
    is_published: true,
    faqs: [
      {
        question: "Apakah bisa untuk iPhone dan Android?",
        answer: "Bisa untuk semua perangkat dengan koneksi Bluetooth: Android, iPhone/iPad, Laptop Windows, dan Macbook."
      },
      {
        question: "Apakah ada garansi?",
        answer: "Ada garansi resmi tukar baru 6 bulan jika terjadi cacat pabrik atau error koneksi."
      }
    ],
    copywritings: [
      {
        id: "cw-4-1",
        title: "Gaya Review Teknologi",
        tag: "Hard Selling",
        content: `Cari TWS yang suara bass-nya mantap + ada fitur peredam suara (Noise Cancelling) tapi harga di bawah 300 ribu? 🤔\n\nNih solusinya: AirSound ANC Earbuds!\n🔥 Suara sejernih TWS jutaan\n🔥 Baterai badak tahan 36 jam\n🔥 Teleponan nggak ada suara kresek-kresek\n\nGaransi ganti baru 6 bulan! Buruan checkout sebelum kehabisan stok promo!`
      }
    ]
  }
];

export const INITIAL_ASSETS: ProductAsset[] = [
  // Aset untuk Glow Radiance Serum (prod-1)
  {
    id: "ast-1-1",
    product_id: "prod-1",
    title: "Video Iklan Reels & TikTok - Review Pemakaian 14 Hari",
    media_type: "video",
    category_type: "story",
    file_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnail_url: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80",
    file_size: "14.2 MB",
    dimensions: "1080x1920 (9:16)",
    download_count: 342,
  },
  {
    id: "ast-1-2",
    product_id: "prod-1",
    title: "Video Promosi Cinematic Product Showcase",
    media_type: "video",
    category_type: "video_promo",
    file_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
    thumbnail_url: "https://images.unsplash.com/photo-1608248597359-561352e89694?auto=format&fit=crop&w=600&q=80",
    file_size: "22.5 MB",
    dimensions: "1920x1080 (16:9)",
    download_count: 218,
  },
  {
    id: "ast-1-3",
    product_id: "prod-1",
    title: "Banner Feed Instagram - 10% Niacinamide Medis",
    media_type: "image",
    category_type: "feed",
    file_url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1400&q=90",
    thumbnail_url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80",
    file_size: "2.4 MB",
    dimensions: "1080x1080 (1:1)",
    download_count: 512,
  },
  {
    id: "ast-1-4",
    product_id: "prod-1",
    title: "Foto Testimoni Real Before After 14 Hari",
    media_type: "image",
    category_type: "testimoni",
    file_url: "https://images.unsplash.com/photo-1512290900672-1f41d9963d76?auto=format&fit=crop&w=1400&q=90",
    thumbnail_url: "https://images.unsplash.com/photo-1512290900672-1f41d9963d76?auto=format&fit=crop&w=600&q=80",
    file_size: "1.8 MB",
    dimensions: "1080x1350 (4:5)",
    download_count: 670,
  },
  {
    id: "ast-1-5",
    product_id: "prod-1",
    title: "Flyer Bahan Story WhatsApp - Promo Diskon Hari Ini",
    media_type: "image",
    category_type: "story",
    file_url: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1400&q=90",
    thumbnail_url: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80",
    file_size: "3.1 MB",
    dimensions: "1080x1920 (9:16)",
    download_count: 429,
  },

  // Aset untuk Hijab Voal Silk (prod-2)
  {
    id: "ast-2-1",
    product_id: "prod-2",
    title: "Video Uji Coba Tahan Air (Waterproof Test Real)",
    media_type: "video",
    category_type: "video_promo",
    file_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    thumbnail_url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80",
    file_size: "18.3 MB",
    dimensions: "1080x1920 (9:16)",
    download_count: 412,
  },
  {
    id: "ast-2-2",
    product_id: "prod-2",
    title: "Foto Katalog 12 Varian Warna Hijab",
    media_type: "image",
    category_type: "feed",
    file_url: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1400&q=90",
    thumbnail_url: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=600&q=80",
    file_size: "3.8 MB",
    dimensions: "1080x1080 (1:1)",
    download_count: 388,
  },

  // Aset untuk Madu Propolis (prod-3)
  {
    id: "ast-3-1",
    product_id: "prod-3",
    title: "Video Panen Madu Murni Lebah Hutan Trigona",
    media_type: "video",
    category_type: "video_promo",
    file_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
    thumbnail_url: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80",
    file_size: "26.1 MB",
    dimensions: "1920x1080 (16:9)",
    download_count: 275,
  },
  {
    id: "ast-3-2",
    product_id: "prod-3",
    title: "Foto Botol Madu & Sertifikat Uji Lab Murni",
    media_type: "image",
    category_type: "feed",
    file_url: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=1400&q=90",
    thumbnail_url: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=600&q=80",
    file_size: "2.1 MB",
    dimensions: "1080x1080 (1:1)",
    download_count: 330,
  },

  // Aset untuk TWS (prod-4)
  {
    id: "ast-4-1",
    product_id: "prod-4",
    title: "Video 3D Unboxing & Demo Active Noise Cancelling",
    media_type: "video",
    category_type: "story",
    file_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    thumbnail_url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
    file_size: "31.4 MB",
    dimensions: "1080x1920 (9:16)",
    download_count: 198,
  },
  {
    id: "ast-4-2",
    product_id: "prod-4",
    title: "Poster Fitur Lengkap TWS AirSound ANC",
    media_type: "image",
    category_type: "feed",
    file_url: "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=1400&q=90",
    thumbnail_url: "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=600&q=80",
    file_size: "2.9 MB",
    dimensions: "1080x1080 (1:1)",
    download_count: 245,
  }
];
