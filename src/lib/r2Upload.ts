export interface UploadResult {
  publicUrl: string;
  key: string;
  fileSize: string;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export async function uploadFileToR2(
  file: File,
  folder: string = "assets",
  onProgress?: (progressPercent: number) => void
): Promise<UploadResult> {
  // 1. Get Presigned Upload URL from our Next.js API
  const res = await fetch("/api/r2/upload-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type || "application/octet-stream",
      folder,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Gagal meminta izin upload ke server");
  }

  const { uploadUrl, publicUrl, key } = await res.json();

  // 2. Upload file directly to Cloudflare R2 via XHR to support progress bar
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl, true);
    xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        if (onProgress) onProgress(100);
        resolve();
      } else {
        reject(
          new Error(
            `Upload ke Cloudflare gagal dengan status ${xhr.status}. Pastikan CORS Policy R2 mengizinkan PUT.`
          )
        );
      }
    };

    xhr.onerror = () => {
      reject(
        new Error(
          "Gagal menghubungi Cloudflare R2. Periksa koneksi internet atau izin CORS di bucket R2."
        )
      );
    };

    xhr.send(file);
  });

  return {
    publicUrl,
    key,
    fileSize: formatFileSize(file.size),
  };
}
