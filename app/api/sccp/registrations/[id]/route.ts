import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/db";

const ALLOWED_VERIF_VALUES = [
  "belum",
  "diverifikasi",
  "ditolak",
  "tidak_perlu",
] as const;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { data, error } = await supabase
      .from("sccp_registrations")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Pendaftaran tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching sccp registration by id:", error);
    const msg =
      error instanceof Error
        ? error.message
        : "Gagal mengambil data pendaftaran SCCP";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { verif_t1, verif_t2 } = body;

    const updateData: Record<string, string> = {};

    if (verif_t1 !== undefined) {
      if (
        !ALLOWED_VERIF_VALUES.includes(
          verif_t1 as (typeof ALLOWED_VERIF_VALUES)[number],
        )
      ) {
        return NextResponse.json(
          {
            error:
              "Nilai verif_t1 tidak valid. Hanya boleh: belum, diverifikasi, ditolak, tidak_perlu",
          },
          { status: 400 },
        );
      }
      updateData.verif_t1 = verif_t1;
    }

    if (verif_t2 !== undefined) {
      if (
        !ALLOWED_VERIF_VALUES.includes(
          verif_t2 as (typeof ALLOWED_VERIF_VALUES)[number],
        )
      ) {
        return NextResponse.json(
          {
            error:
              "Nilai verif_t2 tidak valid. Hanya boleh: belum, diverifikasi, ditolak, tidak_perlu",
          },
          { status: 400 },
        );
      }
      updateData.verif_t2 = verif_t2;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        {
          error:
            "Setidaknya salah satu field verif_t1 atau verif_t2 harus diisi",
        },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("sccp_registrations")
      .update(updateData)
      .eq("id", id)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "Pendaftaran tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Status verifikasi berhasil diperbarui",
      result: data,
    });
  } catch (error) {
    console.error("Error patching sccp registration:", error);
    const msg =
      error instanceof Error
        ? error.message
        : "Gagal memperbarui data pendaftaran SCCP";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
