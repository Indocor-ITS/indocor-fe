import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

// GET — Ambil semua events (public = approved only, admin = all)
export async function GET(req: NextRequest) {
    try {
        const showAll = req.nextUrl.searchParams.get("all") === "true";
        const query = showAll
            ? "SELECT * FROM events ORDER BY created_at DESC"
            : "SELECT * FROM events WHERE status = 'approved' ORDER BY created_at DESC";

        const [rows] = await pool.query<RowDataPacket[]>(query);
        return NextResponse.json(rows);
    } catch (error) {
        console.error("Error fetching events:", error);
        return NextResponse.json({ error: "Gagal mengambil data events" }, { status: 500 });
    }
}

// POST — Tambah event baru (status default: pending)
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { slug, title, date, image_main, section1_text, image_support1, section2_text, image_support2, section3_text } = body;

        if (!slug || !title || !date || !image_main) {
            return NextResponse.json({ error: "Judul, tanggal, dan foto utama wajib diisi" }, { status: 400 });
        }

        const [result] = await pool.query(
            `INSERT INTO events (slug, title, date, image_main, section1_text, image_support1, section2_text, image_support2, section3_text, status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
            [slug, title, date, image_main, section1_text || null, image_support1 || null, section2_text || null, image_support2 || null, section3_text || null]
        );

        return NextResponse.json({ message: "Event berhasil ditambahkan, menunggu persetujuan Super Admin", result }, { status: 201 });
    } catch (error) {
        console.error("Error creating event:", error);
        return NextResponse.json({ error: "Gagal menambahkan event" }, { status: 500 });
    }
}
