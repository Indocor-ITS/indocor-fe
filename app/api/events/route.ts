import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/db";

// GET — Ambil semua events (public = approved only, admin = all)
export async function GET(req: NextRequest) {
  try {
    const showAll = req.nextUrl.searchParams.get("all") === "true";

    let query = supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });

    if (!showAll) {
      query = query.eq("status", "approved");
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data events" },
      { status: 500 },
    );
  }
}

// POST — Tambah event baru (status default: pending)
export async function POST(req: NextRequest) {
  try {
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

    if (!slug || !title || !date || !image_main) {
      return NextResponse.json(
        { error: "Judul, tanggal, dan foto utama wajib diisi" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("events")
      .insert({
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
      })
      .select();

    if (error) throw error;

    return NextResponse.json(
      {
        message: "Event berhasil ditambahkan, menunggu persetujuan Super Admin",
        result: data,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan event" },
      { status: 500 },
    );
  }
}
