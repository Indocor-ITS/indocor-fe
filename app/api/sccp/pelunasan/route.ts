import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/db";
import { uploadToSupabaseStorage } from "@/lib/sccp-helpers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      namaLengkap,
      nomorWA,
      asalInstansi,
      buktiPelunasanFileName,
      buktiPelunasanMimeType,
      buktiPelunasanContent,
    } = body;

    if (
      !namaLengkap ||
      !buktiPelunasanFileName ||
      !buktiPelunasanMimeType ||
      !buktiPelunasanContent
    ) {
      return NextResponse.json(
        {
          error:
            "Field wajib diisi: namaLengkap, buktiPelunasanFileName, buktiPelunasanMimeType, buktiPelunasanContent",
        },
        { status: 400 },
      );
    }

    const trimmedNama = namaLengkap.trim().toLowerCase();

    const { data: existingRows, error: selectErr } = await supabase
      .from("sccp_registrations")
      .select(
        "id, nama_lengkap, nomor_wa, asal_instansi, opsi_pembayaran, bukti_t2_url, verif_t2",
      )
      .order("created_at", { ascending: false })
      .limit(200);

    if (selectErr) throw selectErr;

    const matched = existingRows?.find(
      (row) =>
        row.nama_lengkap &&
        row.nama_lengkap.trim().toLowerCase() === trimmedNama,
    );

    if (!matched) {
      return NextResponse.json(
        {
          error_code: "NAMA_TIDAK_TERDAFTAR",
          error:
            "Anda BELUM TERDAFTAR di SCCP 2026! Silakan isi form pendaftaran terlebih dahulu melalui halaman /register-sccp sebelum melakukan pelunasan Termin 2.",
        },
        { status: 404 },
      );
    }

    if (matched.opsi_pembayaran === "lunas") {
      return NextResponse.json(
        {
          error_code: "OPSI_LUNAS",
          error:
            "Anda memilih opsi pembayaran LUNAS (Rp 3.000.000) saat mendaftar, TIDAK PERLU melakukan pembayaran Termin 2 lagi. Jika status Anda Belum Lunas, silakan tunggu admin memverifikasi bukti pembayaran Termin 1 (maks 1x24 jam).",
        },
        { status: 400 },
      );
    }

    if (matched.bukti_t2_url && matched.verif_t2 !== "ditolak") {
      return NextResponse.json(
        {
          error_code: "SUDAH_UPLOAD_T2",
          error:
            "Bukti pembayaran Termin 2 Anda sudah diupload sebelumnya. Saat ini status: " +
            (matched.verif_t2 === "belum"
              ? "Menunggu verifikasi admin (maks 1x24 jam)."
              : matched.verif_t2 === "diverifikasi"
                ? "SUDAH DIVERIFIKASI (lunas). Tidak perlu upload ulang."
                : `Tertolak. Silakan upload bukti pembayaran yang baru.`),
          current_status_t2: matched.verif_t2,
        },
        { status: 400 },
      );
    }

    let bukti_t2_url: string;
    try {
      const hasil = await uploadToSupabaseStorage({
        bucket: "sccp-img",
        filename: buktiPelunasanFileName,
        ext: buktiPelunasanMimeType,
        base64Content: buktiPelunasanContent,
      });
      bukti_t2_url = hasil.url;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Error tidak diketahui";
      return NextResponse.json(
        { error: `Gagal upload bukti pelunasan T2: ${msg}` },
        { status: 500 },
      );
    }

    const updateData: Record<string, string | null> = {
      bukti_t2_url,
      verif_t2: "belum",
    };

    if (!matched.nomor_wa && nomorWA) {
      updateData.nomor_wa = nomorWA;
    }
    if (!matched.asal_instansi && asalInstansi) {
      updateData.asal_instansi = asalInstansi;
    }

    const { data, error: updateErr } = await supabase
      .from("sccp_registrations")
      .update(updateData)
      .eq("id", matched.id)
      .select();

    if (updateErr) throw updateErr;

    return NextResponse.json(
      {
        message:
          "Bukti pelunasan Termin 2 berhasil diterima dan terhubung ke data pendaftaran.",
        result: data,
        connected: true,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error sccp pelunasan:", error);
    const msg =
      error instanceof Error ? error.message : "Gagal memproses data pelunasan";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
