import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2Client, isR2Configured, R2_BUCKET, R2_PUBLIC_DOMAIN } from "@/lib/r2";

export async function POST(req: Request) {
  try {
    if (!isR2Configured) {
      return NextResponse.json(
        {
          error:
            "Cloudflare R2 belum dikonfigurasi. Pastikan R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, dan R2_SECRET_ACCESS_KEY sudah disetel di .env.local dan Vercel.",
        },
        { status: 500 }
      );
    }

    const { filename, contentType, folder = "assets" } = await req.json();

    if (!filename || !contentType) {
      return NextResponse.json(
        { error: "filename dan contentType wajib diisi." },
        { status: 400 }
      );
    }

    // Clean up filename: keep alphanumeric, dash, dot, underscore
    const sanitizedFilename = filename
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, "_");
    const uniqueKey = `${folder}/${Date.now()}-${sanitizedFilename}`;

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: uniqueKey,
      ContentType: contentType,
    });

    // 15 minutes expiration for uploading large files
    const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 900 });

    const publicUrl = R2_PUBLIC_DOMAIN
      ? `${R2_PUBLIC_DOMAIN}/${uniqueKey}`
      : `https://${R2_BUCKET}.${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${uniqueKey}`;

    return NextResponse.json({
      uploadUrl,
      publicUrl,
      key: uniqueKey,
    });
  } catch (err: any) {
    console.error("Error generating presigned URL:", err);
    return NextResponse.json(
      { error: err?.message || "Gagal membuat URL upload Cloudflare R2" },
      { status: 500 }
    );
  }
}
