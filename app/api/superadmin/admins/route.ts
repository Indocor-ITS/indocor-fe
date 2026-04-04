import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/db";

// GET — Ambil semua akun admin (role = 'admin' saja, exclude superadmin)
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("admin_users")
      .select("id, username, role, created_at")
      .eq("role", "admin")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching admins:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data admin" },
      { status: 500 },
    );
  }
}

// POST — Tambah akun admin baru
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username dan password wajib diisi" },
        { status: 400 },
      );
    }

    if (username.length < 3) {
      return NextResponse.json(
        { error: "Username minimal 3 karakter" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password minimal 6 karakter" },
        { status: 400 },
      );
    }

    // Cek apakah username sudah ada
    const { data: existing } = await supabase
      .from("admin_users")
      .select("id")
      .eq("username", username);

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: "Username sudah digunakan" },
        { status: 409 },
      );
    }

    const { data, error } = await supabase
      .from("admin_users")
      .insert({ username, password, role: "admin" })
      .select();

    if (error) throw error;

    return NextResponse.json(
      { message: "Akun admin berhasil dibuat", id: data?.[0]?.id },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating admin:", error);
    return NextResponse.json(
      { error: "Gagal membuat akun admin" },
      { status: 500 },
    );
  }
}
