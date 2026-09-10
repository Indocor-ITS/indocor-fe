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

    const trimmedNama = namaLengkap.trim().toLowerCase();

    const { data: existingRows, error: selectErr } = await supabase
      .from("sccp_registrations")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (selectErr) throw selectErr;

    const matched = existingRows?.find(
      (row) =>
        row.nama_lengkap &&
        row.nama_lengkap.trim().toLowerCase() === trimmedNama,
    );

    if (matched) {
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
            "Data pelunasan berhasil diupdate dan terhubung ke pendaftaran",
          result: data,
          connected: true,
        },
        { status: 200 },
      );
    } else {
      const { data, error: insertErr } = await supabase
        .from("sccp_registrations")
        .insert({
          nama_lengkap: namaLengkap,
          jenis_kelamin: "unknown",
          nomor_wa: nomorWA || "",
          asal_instansi: asalInstansi || "",
          status_peserta: "unknown",
          bukti_status_url: "",
          mou_url: "",
          opsi_pembayaran: "bertahap",
          bukti_t1_url: "",
          bukti_t2_url,
          verif_t1: "belum",
          verif_t2: "belum",
          catatan_admin:
            "Pelunasan tanpa pendaftaran terhubung — dibuat terpisah",
        })
        .select();

      if (insertErr) throw insertErr;

      return NextResponse.json(
        {
          message:
            "Bukti pelunasan diterima (tidak terhubung ke data pendaftaran, admin akan memverifikasi manual)",
          result: data,
          connected: false,
        },
        { status: 201 },
      );
    }
  } catch (error) {
    console.error("Error sccp pelunasan:", error);
    const msg =
      error instanceof Error ? error.message : "Gagal memproses data pelunasan";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
