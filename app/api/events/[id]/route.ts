import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

// GET — Ambil event by ID
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const [rows] = await pool.query<RowDataPacket[]>(
            "SELECT * FROM events WHERE id = ?",
            [id]
        );

        if (rows.length === 0) {
            return NextResponse.json({ error: "Event tidak ditemukan" }, { status: 404 });
        }

        return NextResponse.json(rows[0]);
    } catch (error) {
        console.error("Error fetching event:", error);
        return NextResponse.json({ error: "Gagal mengambil event" }, { status: 500 });
    }
}

// PUT — Update event
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { slug, title, date, image_main, section1_text, image_support1, section2_text, image_support2, section3_text } = body;

        const [result] = await pool.query<ResultSetHeader>(
            `UPDATE events SET slug=?, title=?, date=?, image_main=?, section1_text=?, image_support1=?, section2_text=?, image_support2=?, section3_text=?, status='pending', review_note=NULL, reviewed_at=NULL WHERE id=?`,
            [slug, title, date, image_main, section1_text || null, image_support1 || null, section2_text || null, image_support2 || null, section3_text || null, id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: "Event tidak ditemukan" }, { status: 404 });
        }

        return NextResponse.json({ message: "Event berhasil diupdate dan dikirim ulang untuk review" });
    } catch (error) {
        console.error("Error updating event:", error);
        return NextResponse.json({ error: "Gagal mengupdate event" }, { status: 500 });
    }
}

// DELETE — Hapus event
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const [result] = await pool.query<ResultSetHeader>(
            "DELETE FROM events WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: "Event tidak ditemukan" }, { status: 404 });
        }

        return NextResponse.json({ message: "Event berhasil dihapus" });
    } catch (error) {
        console.error("Error deleting event:", error);
        return NextResponse.json({ error: "Gagal menghapus event" }, { status: 500 });
    }
}
