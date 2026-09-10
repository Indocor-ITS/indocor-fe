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
