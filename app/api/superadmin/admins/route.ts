import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

// GET — Ambil semua akun admin (role = 'admin' saja, exclude superadmin)
export async function GET() {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            "SELECT id, username, role, created_at FROM admin_users WHERE role = 'admin' ORDER BY created_at DESC"
        );
        return NextResponse.json(rows);
    } catch (error) {
        console.error("Error fetching admins:", error);
        return NextResponse.json({ error: "Gagal mengambil data admin" }, { status: 500 });
    }
}

// POST — Tambah akun admin baru
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json({ error: "Username dan password wajib diisi" }, { status: 400 });
        }

        if (username.length < 3) {
            return NextResponse.json({ error: "Username minimal 3 karakter" }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({ error: "Password minimal 6 karakter" }, { status: 400 });
        }

        // Cek apakah username sudah ada
        const [existing] = await pool.query<RowDataPacket[]>(
            "SELECT id FROM admin_users WHERE username = ?",
            [username]
        );

        if (existing.length > 0) {
            return NextResponse.json({ error: "Username sudah digunakan" }, { status: 409 });
        }

        const [result] = await pool.query<ResultSetHeader>(
            "INSERT INTO admin_users (username, password, role) VALUES (?, ?, 'admin')",
            [username, password]
        );

        return NextResponse.json(
            { message: "Akun admin berhasil dibuat", id: result.insertId },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating admin:", error);
        return NextResponse.json({ error: "Gagal membuat akun admin" }, { status: 500 });
    }
}
