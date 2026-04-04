import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

// POST — Login admin / superadmin
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json({ error: "Username dan password wajib diisi" }, { status: 400 });
        }

        const [rows] = await pool.query<RowDataPacket[]>(
            "SELECT * FROM admin_users WHERE username = ? AND password = ?",
            [username, password]
        );

        if (rows.length === 0) {
            return NextResponse.json({ error: "Username atau password salah" }, { status: 401 });
        }

        return NextResponse.json({
            message: "Login berhasil",
            user: { id: rows[0].id, username: rows[0].username, role: rows[0].role || "admin" },
        });
    } catch (error) {
        console.error("Error logging in:", error);
        return NextResponse.json({ error: "Gagal login" }, { status: 500 });
    }
}
