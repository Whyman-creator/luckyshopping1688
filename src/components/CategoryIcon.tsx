import React from "react";
import {
  Sparkles,
  Shirt,
  HeartPulse,
  Headphones,
  Utensils,
  Package,
  Sprout,
  Leaf,
  Car,
  Home,
  Smartphone,
  ShoppingBag,
  Baby,
  Dumbbell,
  Book,
  Wrench,
  Flame,
  Tag,
  Gift,
  Star,
  Coffee,
  Laptop,
  Watch,
  Flower2,
  Tractor,
} from "lucide-react";

interface CategoryIconProps {
  icon?: string;
  className?: string;
}

export function CategoryIcon({ icon, className = "w-4 h-4" }: CategoryIconProps) {
  if (!icon) {
    return <Package className={className} />;
  }

  // If icon is an emoji (or short string of emojis / symbols)
  // Emojis typically have unicode length > 1 or match emoji regex, or don't match pure latin words
  const isEmoji =
    /\p{Extended_Pictographic}/u.test(icon) ||
    /^[^\x00-\x7F]+$/.test(icon) ||
    icon.length <= 4;

  if (isEmoji && !/^[a-zA-Z]+$/.test(icon)) {
    return <span className="inline-block text-base leading-none select-none">{icon}</span>;
  }

  // Known Lucide icons
  switch (icon.toLowerCase()) {
    case "sprout":
    case "pertanian":
    case "tanaman":
      return <Sprout className={className} />;
    case "leaf":
      return <Leaf className={className} />;
    case "flower":
    case "flower2":
      return <Flower2 className={className} />;
    case "tractor":
      return <Tractor className={className} />;
    case "sparkles":
    case "skincare":
      return <Sparkles className={className} />;
    case "shirt":
    case "fashion":
      return <Shirt className={className} />;
    case "heartpulse":
    case "kesehatan":
    case "herbal":
      return <HeartPulse className={className} />;
    case "headphones":
    case "gadget":
      return <Headphones className={className} />;
    case "utensils":
    case "kuliner":
    case "makanan":
      return <Utensils className={className} />;
    case "coffee":
      return <Coffee className={className} />;
    case "car":
    case "otomotif":
      return <Car className={className} />;
    case "home":
    case "rumah":
      return <Home className={className} />;
    case "smartphone":
    case "hp":
      return <Smartphone className={className} />;
    case "laptop":
      return <Laptop className={className} />;
    case "watch":
      return <Watch className={className} />;
    case "shoppingbag":
    case "belanja":
      return <ShoppingBag className={className} />;
    case "baby":
    case "bayi":
      return <Baby className={className} />;
    case "dumbbell":
    case "olahraga":
      return <Dumbbell className={className} />;
    case "book":
    case "buku":
      return <Book className={className} />;
    case "wrench":
    case "perkakas":
      return <Wrench className={className} />;
    case "flame":
    case "viral":
      return <Flame className={className} />;
    case "gift":
      return <Gift className={className} />;
    case "star":
      return <Star className={className} />;
    case "tag":
      return <Tag className={className} />;
    case "package":
    default:
      return <Package className={className} />;
  }
}
