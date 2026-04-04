import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/db";

// DELETE — Hapus akun admin berdasarkan ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Pastikan tidak menghapus superadmin
    const { data, error } = await supabase
      .from("admin_users")
      .delete()
      .eq("id", id)
      .eq("role", "admin")
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "Akun admin tidak ditemukan atau tidak bisa dihapus" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Akun admin berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting admin:", error);
    return NextResponse.json(
      { error: "Gagal menghapus akun admin" },
      { status: 500 },
    );
  }
}
