import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/db";

// POST — Login admin / superadmin
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

    const { data, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("username", username)
      .eq("password", password)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Username atau password salah" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      message: "Login berhasil",
      user: {
        id: data.id,
        username: data.username,
        role: data.role || "admin",
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return NextResponse.json({ error: "Gagal login" }, { status: 500 });
  }
}
