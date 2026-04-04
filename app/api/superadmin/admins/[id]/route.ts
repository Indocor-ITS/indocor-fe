import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { ResultSetHeader } from "mysql2";

// DELETE — Hapus akun admin berdasarkan ID
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Pastikan tidak menghapus superadmin
        const [result] = await pool.query<ResultSetHeader>(
            "DELETE FROM admin_users WHERE id = ? AND role = 'admin'",
            [id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: "Akun admin tidak ditemukan atau tidak bisa dihapus" },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: "Akun admin berhasil dihapus" });
    } catch (error) {
        console.error("Error deleting admin:", error);
        return NextResponse.json({ error: "Gagal menghapus akun admin" }, { status: 500 });
    }
}
