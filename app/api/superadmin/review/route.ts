import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { ResultSetHeader } from "mysql2";

// POST — Approve or Reject content
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { type, id, action, review_note } = body;

        if (!type || !id || !action) {
            return NextResponse.json({ error: "Type, id, dan action wajib diisi" }, { status: 400 });
        }

        if (!["articles", "events"].includes(type)) {
            return NextResponse.json({ error: "Type harus articles atau events" }, { status: 400 });
        }

        if (!["approve", "reject"].includes(action)) {
            return NextResponse.json({ error: "Action harus approve atau reject" }, { status: 400 });
        }

        const status = action === "approve" ? "approved" : "rejected";
        const note = action === "reject" ? (review_note || "Konten perlu diperbaiki") : null;

        const [result] = await pool.query<ResultSetHeader>(
            `UPDATE ${type} SET status = ?, review_note = ?, reviewed_at = NOW() WHERE id = ?`,
            [status, note, id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: "Konten tidak ditemukan" }, { status: 404 });
        }

        return NextResponse.json({
            message: action === "approve"
                ? "Konten berhasil disetujui dan dipublikasikan"
                : "Konten dikembalikan untuk revisi",
        });
    } catch (error) {
        console.error("Error reviewing content:", error);
        return NextResponse.json({ error: "Gagal memproses review" }, { status: 500 });
    }
}
