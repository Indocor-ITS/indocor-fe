import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/db";

function log(
  level: "info" | "warn" | "error",
  message: string,
  data?: Record<string, unknown>,
) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    route: "/api/upload",
    message,
    ...data,
  };
  if (level === "error") console.error(JSON.stringify(entry));
  else if (level === "warn") console.warn(JSON.stringify(entry));
  else console.log(JSON.stringify(entry));
}

// POST — Upload file (PDF atau Image) ke Supabase Storage
export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID();

  log("info", "Upload request received", { requestId });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string | null; // "pdf" atau "image"

    log("info", "Form data parsed", {
      requestId,
      hasFile: !!file,
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      uploadType: type,
    });

    if (!file) {
      log("warn", "No file in request", { requestId });
      return NextResponse.json(
        { error: "File tidak ditemukan" },
        { status: 400 },
      );
    }

    // Validate file type
    const allowedPdf = ["application/pdf"];
    const allowedImages = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
    ];

    if (type === "image") {
      if (!allowedImages.includes(file.type)) {
        log("warn", "Invalid image type", { requestId, fileType: file.type });
        return NextResponse.json(
          { error: "Hanya file JPG, PNG, atau WebP yang diperbolehkan" },
          { status: 400 },
        );
      }
    } else {
      if (!allowedPdf.includes(file.type)) {
        log("warn", "Invalid PDF type", { requestId, fileType: file.type });
        return NextResponse.json(
          { error: "Hanya file PDF yang diperbolehkan" },
          { status: 400 },
        );
      }
    }

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      log("warn", "File too large", { requestId, fileSize: file.size });
      return NextResponse.json(
        { error: "Ukuran file maksimal 10MB" },
        { status: 400 },
      );
    }

    const folder = type === "image" ? "events" : "articles";
    const timestamp = Date.now();
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const storagePath = `${folder}/${timestamp}_${safeFileName}`;

    log("info", "Uploading to Supabase Storage", { requestId, storagePath });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from("media")
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      log("error", "Supabase upload failed", {
        requestId,
        error: uploadError.message,
      });
      return NextResponse.json(
        { error: "Gagal mengupload file" },
        { status: 500 },
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from("media")
      .getPublicUrl(storagePath);

    log("info", "Upload successful", {
      requestId,
      url: publicUrlData.publicUrl,
    });

    return NextResponse.json(
      { filePath: publicUrlData.publicUrl, fileName: storagePath },
      { status: 201 },
    );
  } catch (error) {
    const err = error as Error;
    log("error", "Upload failed", {
      requestId,
      errorName: err?.name,
      errorMessage: err?.message,
      errorStack: err?.stack,
    });
    return NextResponse.json(
      { error: "Gagal mengupload file" },
      { status: 500 },
    );
  }
}
