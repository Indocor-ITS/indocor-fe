import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

// GET — Ambil article by ID
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const [rows] = await pool.query<RowDataPacket[]>(
            "SELECT * FROM articles WHERE id = ?",
            [id]
        );

        if (rows.length === 0) {
            return NextResponse.json({ error: "Article tidak ditemukan" }, { status: 404 });
        }

        return NextResponse.json(rows[0]);
    } catch (error) {
        console.error("Error fetching article:", error);
        return NextResponse.json({ error: "Gagal mengambil article" }, { status: 500 });
    }
}

// PUT — Update article
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { slug, title, date, author, image_cover, pdf_file } = body;

        const [result] = await pool.query<ResultSetHeader>(
            "UPDATE articles SET slug=?, title=?, date=?, author=?, image_cover=?, pdf_file=?, status='pending', review_note=NULL, reviewed_at=NULL WHERE id=?",
            [slug, title, date, author, image_cover || null, pdf_file, id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: "Article tidak ditemukan" }, { status: 404 });
        }

        return NextResponse.json({ message: "Article berhasil diupdate dan dikirim ulang untuk review" });
    } catch (error) {
        console.error("Error updating article:", error);
        return NextResponse.json({ error: "Gagal mengupdate article" }, { status: 500 });
    }
}

// DELETE — Hapus article
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const [result] = await pool.query<ResultSetHeader>(
            "DELETE FROM articles WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: "Article tidak ditemukan" }, { status: 404 });
        }

        return NextResponse.json({ message: "Article berhasil dihapus" });
    } catch (error) {
        console.error("Error deleting article:", error);
        return NextResponse.json({ error: "Gagal menghapus article" }, { status: 500 });
    }
}
