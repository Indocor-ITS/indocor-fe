import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/db";

// TODO: add admin auth check via token
export async function GET(req: NextRequest) {
  try {
    const opsi = req.nextUrl.searchParams.get("opsi");
    const status_verif = req.nextUrl.searchParams.get("status_verif");

    let query = supabase
      .from("sccp_registrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (opsi === "lunas" || opsi === "bertahap") {
      query = query.eq("opsi_pembayaran", opsi);
    }

    if (
      status_verif === "belum" ||
      status_verif === "diverifikasi" ||
      status_verif === "ditolak"
    ) {
      query = query.or(
        `verif_t1.eq.${status_verif},verif_t2.eq.${status_verif}`,
      );
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error("Error fetching sccp registrations:", error);
    const msg =
      error instanceof Error
        ? error.message
        : "Gagal mengambil data pendaftaran SCCP";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
