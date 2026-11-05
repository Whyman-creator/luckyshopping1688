import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import JSZip from "jszip";
import { ProductAsset } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getMediaUrl(url: string | undefined | null): string {
  if (!url) return "";
  // Route Cloudflare R2 dev URLs through our same-origin /r2-media proxy
  // to prevent mobile operator DNS blocks and CORS issues on Indonesian cellular networks
  if (url.includes(".r2.dev/")) {
    const parts = url.split(".r2.dev/");
    if (parts.length > 1) {
      return `/r2-media/${parts[1]}`;
    }
  }
  return url;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for non-https or older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand("copy");
      textArea.remove();
      return successful;
    }
  } catch (err) {
    console.error("Failed to copy:", err);
    return false;
  }
}

export async function downloadFile(url: string, filename: string): Promise<void> {
  const targetUrl = getMediaUrl(url);
  try {
    const response = await fetch(targetUrl);
    if (!response.ok) throw new Error("Network response was not ok");
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch {
    // Direct open fallback if fetch fails
    const link = document.createElement("a");
    link.href = targetUrl;
    link.target = "_blank";
    link.download = filename;
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export async function downloadAllAsZip(
  assets: ProductAsset[],
  productName: string,
  onProgress?: (percent: number, currentItem: string) => void
): Promise<void> {
  const zip = new JSZip();
  const folder = zip.folder(productName.replace(/[^a-zA-Z0-9_-]/g, "_")) || zip;

  let loaded = 0;
  const total = assets.length;

  for (let i = 0; i < assets.length; i++) {
    const asset = assets[i];
    const safeTitle = asset.title.replace(/[^a-zA-Z0-9_-]/g, "_");
    const ext = asset.media_type === "video" ? "mp4" : "jpg";
    const filename = `${String(i + 1).padStart(2, "0")}_${safeTitle}.${ext}`;

    if (onProgress) {
      onProgress(Math.round((loaded / total) * 90), asset.title);
    }

    try {
      const targetUrl = getMediaUrl(asset.file_url);
      const response = await fetch(targetUrl);
      if (response.ok) {
        const blob = await response.blob();
        folder.file(filename, blob);
      }
    } catch (err) {
      console.warn(`Could not fetch asset ${asset.title} for ZIP:`, err);
    }
    loaded++;
  }

  if (onProgress) {
    onProgress(95, "Mengompresi berkas ZIP...");
  }

  const content = await zip.generateAsync({ type: "blob" }, (metadata) => {
    if (onProgress) {
      onProgress(95 + Math.round(metadata.percent * 0.05), "Menyelesaikan ZIP...");
    }
  });

  const blobUrl = window.URL.createObjectURL(content);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = `Aset_Promosi_${productName.replace(/[^a-zA-Z0-9_-]/g, "_")}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(blobUrl);

  if (onProgress) {
    onProgress(100, "Selesai!");
  }
}
