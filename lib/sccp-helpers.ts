import supabase from "./db";

const ALLOWED_PDF_MIMES = ["application/pdf"];
const ALLOWED_IMG_MIMES = ["image/png", "image/jpeg", "image/jpg"];

function detectMimeFromBase64(base64: string, extHint: string): string {
  if (extHint.toLowerCase() === ".pdf") return "application/pdf";
  if (extHint.toLowerCase() === ".png") return "image/png";
  if (extHint.toLowerCase() === ".jpg" || extHint.toLowerCase() === ".jpeg")
    return "image/jpeg";
  return ALLOWED_IMG_MIMES[0];
}

function base64ToUint8Array(base64: string): Uint8Array {
  const clean = base64.replace(/^data:[^;]+;base64,/, "");
  const binaryString = atob(clean);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function sanitizeFilename(name: string): string {
  const base = name
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/__+/g, "_")
    .replace(/^_+|_+$/g, "");
  return `${Date.now()}_${base}`;
}

export type UploadedFile = {
  path: string;
  url: string;
};

export async function uploadToSupabaseStorage(params: {
  bucket: "sccp-pdf" | "sccp-img";
  filename: string;
  ext: string;
  base64Content: string;
}): Promise<UploadedFile> {
  const { bucket, filename, ext, base64Content } = params;

  if (!base64Content) {
    throw new Error("Konten file kosong");
  }

  const finalName = sanitizeFilename(filename);
  const mimeType = detectMimeFromBase64(base64Content, ext);
  const fileBytes = base64ToUint8Array(base64Content);

  if (bucket === "sccp-pdf" && !ALLOWED_PDF_MIMES.includes(mimeType)) {
    throw new Error("Bucket sccp-pdf hanya menerima file PDF");
  }
  if (bucket === "sccp-img" && !ALLOWED_IMG_MIMES.includes(mimeType)) {
    throw new Error("Bucket sccp-img hanya menerima file PNG/JPG");
  }

  const { error: uploadErr } = await supabase.storage
    .from(bucket)
    .upload(finalName, fileBytes, { contentType: mimeType, upsert: false });

  if (uploadErr) {
    console.error("Upload error:", uploadErr);
    throw new Error(`Gagal upload file: ${uploadErr.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(finalName);

  return { path: finalName, url: publicUrl };
}

export function getStatusLunas(reg: {
  opsi_pembayaran: string | null;
  verif_t1: string | null;
  verif_t2: string | null;
}): { label: string; color: string; badge: string; icon: string } {
  const opsi = (reg.opsi_pembayaran || "").toLowerCase();
  const t1 = (reg.verif_t1 || "").toLowerCase();
  const t2 = (reg.verif_t2 || "").toLowerCase();

  if (opsi === "lunas") {
    if (t1 === "diverifikasi") {
      return {
        label: "Lunas",
        color: "text-green-700",
        badge: "bg-green-100 border-green-200",
        icon: "✅",
      };
    }
    if (t1 === "ditolak") {
      return {
        label: "Bukti T1 Ditolak",
        color: "text-red-700",
        badge: "bg-red-100 border-red-200",
        icon: "❌",
      };
    }
    return {
      label: "Belum Lunas (Menunggu Verif T1)",
      color: "text-amber-700",
      badge: "bg-amber-100 border-amber-200",
      icon: "⏳",
    };
  }

  if (opsi === "bertahap") {
    const t1Ok = t1 === "diverifikasi";
    const t2Ok = t2 === "diverifikasi";
    const t2Reject = t2 === "ditolak";
    const t1Reject = t1 === "ditolak";

    if (t1Ok && t2Ok) {
      return {
        label: "Lunas",
        color: "text-green-700",
        badge: "bg-green-100 border-green-200",
        icon: "✅",
      };
    }
    if (t1Reject) {
      return {
        label: "Bukti T1 Ditolak",
        color: "text-red-700",
        badge: "bg-red-100 border-red-200",
        icon: "❌",
      };
    }
    if (t2Reject) {
      return {
        label: "Bukti T2 Ditolak",
        color: "text-red-700",
        badge: "bg-red-100 border-red-200",
        icon: "❌",
      };
    }
    if (t1Ok && !t2Ok) {
      return {
        label: "Menunggu Verif T2",
        color: "text-amber-700",
        badge: "bg-amber-100 border-amber-200",
        icon: "⏳",
      };
    }
    if (!t1Ok) {
      return {
        label: "Belum Lunas (Menunggu Verif T1)",
        color: "text-amber-700",
        badge: "bg-amber-100 border-amber-200",
        icon: "⏳",
      };
    }
  }

  return {
    label: "Belum Lunas",
    color: "text-red-700",
    badge: "bg-red-100 border-red-200",
    icon: "🔴",
  };
}

export const VERIF_OPTIONS = ["belum", "diverifikasi", "ditolak"] as const;
export type VerifState = (typeof VERIF_OPTIONS)[number];
