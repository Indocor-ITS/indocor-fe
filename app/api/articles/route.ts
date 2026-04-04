import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/db";

// GET — Ambil semua articles (public = approved only, admin = all)
export async function GET(req: NextRequest) {
  try {
    const showAll = req.nextUrl.searchParams.get("all") === "true";

    let query = supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });

    if (!showAll) {
      query = query.eq("status", "approved");
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data articles" },
      { status: 500 },
    );
  }
}

// POST — Tambah article baru (status default: pending)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, title, date, author, image_cover, pdf_file } = body;

    if (!slug || !title || !date || !author || !pdf_file) {
      return NextResponse.json(
        { error: "Semua field wajib diisi" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("articles")
      .insert({
        slug,
        title,
        date,
        author,
        image_cover: image_cover || null,
        pdf_file,
        status: "pending",
      })
      .select();

    if (error) throw error;

    return NextResponse.json(
      {
        message:
          "Article berhasil ditambahkan, menunggu persetujuan Super Admin",
        result: data,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan article" },
      { status: 500 },
    );
  }
}
