"use client";

import { useEffect, useState } from "react";
import {
    UserPlus, Trash2, Loader2, Shield, User, Eye, EyeOff,
    CheckCircle2, AlertCircle, X, Users
} from "lucide-react";

interface AdminUser {
    id: number;
    username: string;
    role: string;
    created_at: string;
}

export default function SuperAdminManageAdminsPage() {
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const [form, setForm] = useState({ username: "", password: "" });

    const fetchAdmins = async () => {
        try {
            const res = await fetch("/api/superadmin/admins");
            const data = await res.json();
            setAdmins(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setErrorMsg("");

        try {
            const res = await fetch("/api/superadmin/admins", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                setErrorMsg(data.error || "Gagal membuat akun admin");
                return;
            }

            setSuccessMsg(`Akun admin "${form.username}" berhasil dibuat!`);
            setTimeout(() => setSuccessMsg(""), 4000);
            setForm({ username: "", password: "" });
            setShowForm(false);
            await fetchAdmins();
        } catch {
            setErrorMsg("Terjadi kesalahan koneksi");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (admin: AdminUser) => {
        if (!confirm(`Yakin ingin menghapus akun admin "${admin.username}"?\nAksi ini tidak dapat dibatalkan.`)) return;
        setDeleting(admin.id);
        try {
            const res = await fetch(`/api/superadmin/admins/${admin.id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setAdmins((prev) => prev.filter((a) => a.id !== admin.id));
                setSuccessMsg(`Akun admin "${admin.username}" berhasil dihapus.`);
                setTimeout(() => setSuccessMsg(""), 3000);
            } else {
                const data = await res.json();
                setErrorMsg(data.error || "Gagal menghapus akun admin");
                setTimeout(() => setErrorMsg(""), 3000);
            }
        } catch {
            setErrorMsg("Terjadi kesalahan koneksi");
            setTimeout(() => setErrorMsg(""), 3000);
        } finally {
            setDeleting(null);
        }
    };

    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <div>
            {/* Toast Notifications */}
            {successMsg && (
                <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-6 py-3 rounded-xl shadow-2xl font-bold text-sm flex items-center gap-2">
                    <CheckCircle2 size={18} />
                    {successMsg}
                </div>
            )}
            {errorMsg && (
                <div className="fixed top-6 right-6 z-50 bg-red-600 text-white px-6 py-3 rounded-xl shadow-2xl font-bold text-sm flex items-center gap-2">
                    <AlertCircle size={18} />
                    {errorMsg}
                    <button onClick={() => setErrorMsg("")} className="ml-2">
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                            <Users size={20} className="text-indigo-600" />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                            Kelola Akun Admin
                        </h1>
                    </div>
                    <p className="text-gray-500 mt-1 ml-13">
                        {admins.length} akun admin terdaftar
                    </p>
                </div>
                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        setErrorMsg("");
                        setForm({ username: "", password: "" });
                    }}
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/20 text-sm"
                >
                    <UserPlus size={18} />
                    <span>Tambah Admin</span>
                </button>
            </div>

            {/* Add Admin Form */}
            {showForm && (
                <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden mb-6">
                    <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <UserPlus size={18} className="text-indigo-600" />
                            <h2 className="text-base font-bold text-indigo-800">Tambah Akun Admin Baru</h2>
                        </div>
                        <button
                            onClick={() => { setShowForm(false); setErrorMsg(""); }}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 md:p-8">
                        {errorMsg && (
                            <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl text-sm font-medium mb-6 flex items-center gap-2">
                                <AlertCircle size={16} />
                                {errorMsg}
                            </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Username */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Username *
                                </label>
                                <div className="relative">
                                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={form.username}
                                        onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
                                        required
                                        minLength={3}
                                        placeholder="Minimal 3 karakter"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm"
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-1">Minimal 3 karakter, tidak boleh sama dengan yang sudah ada</p>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Password *
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={form.password}
                                        onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                                        required
                                        minLength={6}
                                        placeholder="Minimal 6 karakter"
                                        className="w-full pl-4 pr-11 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">Minimal 6 karakter</p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => { setShowForm(false); setErrorMsg(""); }}
                                className="px-6 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 font-medium text-sm transition-all"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm disabled:opacity-50 transition-all shadow-lg shadow-indigo-600/20"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Membuat akun...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus size={16} />
                                        Buat Akun Admin
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Admin List */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                    <Shield size={16} className="text-indigo-500" />
                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Daftar Akun Admin</h2>
                </div>

                {loading ? (
                    <div className="p-20 flex items-center justify-center">
                        <Loader2 size={32} className="animate-spin text-gray-300" />
                    </div>
                ) : admins.length === 0 ? (
                    <div className="p-20 text-center text-gray-400">
                        <Users size={48} className="mx-auto mb-4 text-gray-200" />
                        <p className="text-lg font-medium">Belum ada akun admin</p>
                        <p className="text-sm mt-1">Klik tombol &quot;Tambah Admin&quot; untuk membuat akun baru</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {admins.map((admin, idx) => (
                            <div
                                key={admin.id}
                                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                        <span className="text-indigo-600 font-bold text-sm">
                                            {admin.username.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-bold text-gray-900">
                                                {admin.username}
                                            </p>
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100">
                                                <User size={10} />
                                                Admin
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            Dibuat: {formatDate(admin.created_at)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-gray-400 hidden sm:block">#{idx + 1}</span>
                                    <button
                                        onClick={() => handleDelete(admin)}
                                        disabled={deleting === admin.id}
                                        className="w-9 h-9 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 flex items-center justify-center transition-colors disabled:opacity-50"
                                        title={`Hapus akun ${admin.username}`}
                                    >
                                        {deleting === admin.id ? (
                                            <Loader2 size={16} className="animate-spin" />
                                        ) : (
                                            <Trash2 size={16} />
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Info Box */}
            <div className="mt-6 bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                    <Shield size={18} className="text-indigo-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-bold text-indigo-800 mb-1">Tentang Manajemen Admin</p>
                        <ul className="text-sm text-indigo-700 space-y-1 list-disc list-inside">
                            <li>Akun admin yang dibuat di sini dapat mengakses panel admin untuk membuat artikel dan kegiatan</li>
                            <li>Konten yang dibuat admin akan diperiksa oleh Super Admin sebelum ditampilkan</li>
                            <li>Admin tidak memiliki akses untuk menghapus konten</li>
                            <li>Akun Super Admin tidak dapat dihapus melalui halaman ini</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
