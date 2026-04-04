import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

// GET — Ambil semua articles (public = approved only, admin = all)
export async function GET(req: NextRequest) {
    try {
        const showAll = req.nextUrl.searchParams.get("all") === "true";
        const query = showAll
            ? "SELECT * FROM articles ORDER BY created_at DESC"
            : "SELECT * FROM articles WHERE status = 'approved' ORDER BY created_at DESC";

        const [rows] = await pool.query<RowDataPacket[]>(query);
        return NextResponse.json(rows);
    } catch (error) {
        console.error("Error fetching articles:", error);
        return NextResponse.json({ error: "Gagal mengambil data articles" }, { status: 500 });
    }
}

// POST — Tambah article baru (status default: pending)
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { slug, title, date, author, image_cover, pdf_file } = body;

        if (!slug || !title || !date || !author || !pdf_file) {
            return NextResponse.json({ error: "Semua field wajib diisi" }, { status: 400 });
        }

        const [result] = await pool.query(
            "INSERT INTO articles (slug, title, date, author, image_cover, pdf_file, status) VALUES (?, ?, ?, ?, ?, ?, 'pending')",
            [slug, title, date, author, image_cover || null, pdf_file]
        );

        return NextResponse.json({ message: "Article berhasil ditambahkan, menunggu persetujuan Super Admin", result }, { status: 201 });
    } catch (error) {
        console.error("Error creating article:", error);
        return NextResponse.json({ error: "Gagal menambahkan article" }, { status: 500 });
    }
}
