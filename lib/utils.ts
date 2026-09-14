/**
 * Helper umum yang BISA DIPAKAI CLIENT & SERVER SIDE.
 * JANGAN import supabase / db.ts dari sini karena akan di bundle ke client.
 */

/**
 * Bersihkan nomor WA dari strip, spasi, kurung, dll → kembalikan hanya digit.
 * Jika diawali "0" → ganti jadi "62" agar format wa.me valid (negara ID).
 * Jika diawali "62" → lanjut. Jika tidak ada sama sekali → return null.
 */
export function normalizeWhatsAppNumber(
  raw: string | null | undefined,
): string | null {
  if (!raw) return null;
  const digits = raw.replace(/\D+/g, "");
  if (!digits) return null;
  if (digits.startsWith("0")) return "62" + digits.substring(1);
  return digits;
}

/**
 * Generate direct WhatsApp link (wa.me) dari nomor mentah user.
 * Otomatis normalisasi format 08xxx / 62xxx.
 * Jika invalid, return null agar frontend tampilkan plain text bukan link.
 */
export function toWhatsAppLink(
  raw: string | null | undefined,
  prefilledMessage = "",
): string | null {
  const normalized = normalizeWhatsAppNumber(raw);
  if (!normalized) return null;
  const base = `https://wa.me/${normalized}`;
  if (!prefilledMessage) return base;
  return `${base}?text=${encodeURIComponent(prefilledMessage)}`;
}

/**
 * Hitung perkiraan ukuran asli (bytes) dari string base64.
 * Base64 membebani ~33%: 4 karakter base64 = 3 byte data asli.
 */
export function getBase64ApproxBytes(base64: string): number {
  if (!base64) return 0;
  const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
  return Math.max(0, Math.floor((base64.length * 3) / 4) - padding);
}

/**
 * Validasi ukuran file dari konten base64 terhadap batas maksimal (MB).
 * Return string pesan error jika MELEBIHI batas, atau null jika aman.
 * Dipakai client (pre-submit) & server (API guard) agar konsisten.
 */
export function validateBase64MaxMb(
  base64: string,
  maxMb: number,
  label: string,
): string | null {
  const bytes = getBase64ApproxBytes(base64);
  const maxBytes = maxMb * 1024 * 1024;
  if (bytes > maxBytes) {
    const actualMb = (bytes / (1024 * 1024)).toFixed(2);
    return `Ukuran file ${label} terlalu besar (${actualMb}MB). Maksimal ${maxMb}MB — silakan kompres atau kecilkan file lalu upload ulang.`;
  }
  return null;
}
