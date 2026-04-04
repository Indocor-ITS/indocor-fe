import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/db";

// GET — Ambil article by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Article tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json(
      { error: "Gagal mengambil article" },
      { status: 500 },
    );
  }
}

// PUT — Update article
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { slug, title, date, author, image_cover, pdf_file } = body;

    const { data, error } = await supabase
      .from("articles")
      .update({
        slug,
        title,
        date,
        author,
        image_cover: image_cover || null,
        pdf_file,
        status: "pending",
        review_note: null,
        reviewed_at: null,
      })
      .eq("id", id)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "Article tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Article berhasil diupdate dan dikirim ulang untuk review",
    });
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json(
      { error: "Gagal mengupdate article" },
      { status: 500 },
    );
  }
}

// DELETE — Hapus article
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { data, error } = await supabase
      .from("articles")
      .delete()
      .eq("id", id)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "Article tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Article berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json(
      { error: "Gagal menghapus article" },
      { status: 500 },
    );
  }
}
