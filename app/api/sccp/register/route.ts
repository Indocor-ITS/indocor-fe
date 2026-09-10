import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/db";
import { uploadToSupabaseStorage } from "@/lib/sccp-helpers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      namaLengkap,
      jenisKelamin,
      nomorWA,
      asalInstansi,
      status,
      buktiStatusFileName,
      buktiStatusMimeType,
      buktiStatusContent,
      mouFileName,
      mouMimeType,
      mouContent,
      pembayaran,
      buktiBayarFileName,
      buktiBayarMimeType,
      buktiBayarContent,
    } = body;

    if (
      !namaLengkap ||
      !jenisKelamin ||
      !nomorWA ||
      !asalInstansi ||
      !status ||
      !buktiStatusFileName ||
      !buktiStatusMimeType ||
      !buktiStatusContent ||
      !mouFileName ||
      !mouMimeType ||
      !mouContent ||
      !pembayaran ||
      !buktiBayarFileName ||
      !buktiBayarMimeType ||
      !buktiBayarContent
    ) {
      return NextResponse.json(
        {
          error:
            "Semua field wajib diisi: namaLengkap, jenisKelamin, nomorWA, asalInstansi, status, file bukti status, file MOU, opsi pembayaran, dan file bukti bayar",
        },
        { status: 400 },
      );
    }

    if (pembayaran !== "lunas" && pembayaran !== "bertahap") {
      return NextResponse.json(
        { error: "Opsi pembayaran hanya boleh 'lunas' atau 'bertahap'" },
        { status: 400 },
      );
    }

    let bukti_status_url: string;
    try {
      const hasil = await uploadToSupabaseStorage({
        bucket: "sccp-pdf",
        filename: buktiStatusFileName,
        ext: buktiStatusMimeType,
        base64Content: buktiStatusContent,
      });
      bukti_status_url = hasil.url;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Error tidak diketahui";
      return NextResponse.json(
        { error: `Gagal upload bukti status: ${msg}` },
        { status: 500 },
      );
    }

    let mou_url: string;
    try {
      const hasil = await uploadToSupabaseStorage({
        bucket: "sccp-pdf",
        filename: mouFileName,
        ext: mouMimeType,
        base64Content: mouContent,
      });
      mou_url = hasil.url;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Error tidak diketahui";
      return NextResponse.json(
        { error: `Gagal upload MOU: ${msg}` },
        { status: 500 },
      );
    }

    let bukti_t1_url: string;
    try {
      const hasil = await uploadToSupabaseStorage({
        bucket: "sccp-img",
        filename: buktiBayarFileName,
        ext: buktiBayarMimeType,
        base64Content: buktiBayarContent,
      });
      bukti_t1_url = hasil.url;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Error tidak diketahui";
      return NextResponse.json(
        { error: `Gagal upload bukti pembayaran T1: ${msg}` },
        { status: 500 },
      );
    }

    const verif_t2 = pembayaran === "lunas" ? "tidak_perlu" : "belum";

    const { data, error } = await supabase
      .from("sccp_registrations")
      .insert({
        nama_lengkap: namaLengkap,
        jenis_kelamin: jenisKelamin,
        nomor_wa: nomorWA,
        asal_instansi: asalInstansi,
        status_peserta: status,
        bukti_status_url,
        mou_url,
        opsi_pembayaran: pembayaran,
        bukti_t1_url,
        verif_t1: "belum",
        verif_t2,
      })
      .select();

    if (error) throw error;

    return NextResponse.json(
      {
        message: "Pendaftaran SCCP berhasil dikirim, menunggu verifikasi admin",
        result: data,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error sccp register:", error);
    const msg =
      error instanceof Error
        ? error.message
        : "Gagal melakukan pendaftaran SCCP";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
