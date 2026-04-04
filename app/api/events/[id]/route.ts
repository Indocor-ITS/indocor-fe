import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/db";

// GET — Ambil event by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Event tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "Gagal mengambil event" },
      { status: 500 },
    );
  }
}

// PUT — Update event
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const {
      slug,
      title,
      date,
      image_main,
      section1_text,
      image_support1,
      section2_text,
      image_support2,
      section3_text,
    } = body;

    const { data, error } = await supabase
      .from("events")
      .update({
        slug,
        title,
        date,
        image_main,
        section1_text: section1_text || null,
        image_support1: image_support1 || null,
        section2_text: section2_text || null,
        image_support2: image_support2 || null,
        section3_text: section3_text || null,
        status: "pending",
        review_note: null,
        reviewed_at: null,
      })
      .eq("id", id)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "Event tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Event berhasil diupdate dan dikirim ulang untuk review",
    });
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Gagal mengupdate event" },
      { status: 500 },
    );
  }
}

// DELETE — Hapus event
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { data, error } = await supabase
      .from("events")
      .delete()
      .eq("id", id)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "Event tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Event berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Gagal menghapus event" },
      { status: 500 },
    );
  }
}
