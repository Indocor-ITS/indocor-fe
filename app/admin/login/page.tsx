"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, User, AlertCircle, Shield, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showRoleChoice, setShowRoleChoice] = useState(false);
    const [userData, setUserData] = useState<{ id: number; username: string; role: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Login gagal");
                return;
            }

            // If superadmin, show role choice
            if (data.user?.role === "superadmin") {
                setUserData(data.user);
                setShowRoleChoice(true);
                return;
            }

            // Regular admin — go to admin dashboard
            localStorage.setItem("admin_logged_in", "true");
            localStorage.setItem("admin_user", JSON.stringify(data.user));
            router.replace("/admin");
        } catch {
            setError("Terjadi kesalahan koneksi");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRoleChoice = (role: "admin" | "superadmin") => {
        if (!userData) return;

        if (role === "superadmin") {
            localStorage.setItem("superadmin_logged_in", "true");
            localStorage.setItem("superadmin_user", JSON.stringify(userData));
            router.replace("/superadmin");
        } else {
            localStorage.setItem("admin_logged_in", "true");
            localStorage.setItem("admin_user", JSON.stringify(userData));
            router.replace("/admin");
        }
    };

    // Role choice screen for superadmin
    if (showRoleChoice && userData) {
        return (
            <main className="min-h-screen bg-gray-950 flex items-center justify-center px-6">
                <div className="w-full max-w-md">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <Shield className="text-white" size={28} />
                        </div>
                        <h1 className="text-3xl font-extrabold text-white tracking-tight">
                            Selamat Datang
                        </h1>
                        <p className="text-gray-400 mt-2 text-sm">
                            Hai <span className="text-white font-bold">{userData.username}</span>, pilih dashboard yang ingin diakses
                        </p>
                    </div>

                    <div className="space-y-4">
                        {/* Admin Panel Option */}
                        <button
                            onClick={() => handleRoleChoice("admin")}
                            className="w-full bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all group text-left flex items-center gap-5 hover:-translate-y-0.5"
                        >
                            <div className="w-14 h-14 rounded-xl bg-red/10 flex items-center justify-center flex-shrink-0 group-hover:bg-red/20 transition-colors">
                                <Lock size={24} className="text-red" />
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-gray-900 text-lg">Panel Admin</p>
                                <p className="text-gray-500 text-sm mt-0.5">Kelola artikel & kegiatan</p>
                            </div>
                            <ArrowRight size={20} className="text-gray-400 group-hover:text-red group-hover:translate-x-1 transition-all" />
                        </button>

                        {/* Super Admin Panel Option */}
                        <button
                            onClick={() => handleRoleChoice("superadmin")}
                            className="w-full bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all group text-left flex items-center gap-5 hover:-translate-y-0.5"
                        >
                            <div className="w-14 h-14 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-200 transition-colors">
                                <Shield size={24} className="text-indigo-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-gray-900 text-lg">Panel Super Admin</p>
                                <p className="text-gray-500 text-sm mt-0.5">Review & approve konten</p>
                            </div>
                            <ArrowRight size={20} className="text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                        </button>
                    </div>

                    <p className="text-center text-gray-600 text-xs mt-8">
                        &copy; 2026 INDOCOR ITS Student Chapter
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-950 flex items-center justify-center px-6">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-10">
                    <div className="w-16 h-16 rounded-2xl bg-red flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red/30">
                        <Lock className="text-white" size={28} />
                    </div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">
                        Admin Login
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm">
                        INDOCOR ITS Student Chapter — Panel Administrasi
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-xl">
                    {error && (
                        <div className="mb-6 flex items-center gap-3 bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
                            <AlertCircle size={18} className="flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <User
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    placeholder="Masukkan username"
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-red focus:ring-2 focus:ring-red/20 outline-none transition-all text-gray-900"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="Masukkan password"
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-red focus:ring-2 focus:ring-red/20 outline-none transition-all text-gray-900"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-8 bg-red hover:bg-red/90 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-red/30"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                <span>Memproses...</span>
                            </>
                        ) : (
                            "Masuk ke Dashboard"
                        )}
                    </button>
                </form>

                <p className="text-center text-gray-600 text-xs mt-8">
                    &copy; 2026 INDOCOR ITS Student Chapter
                </p>
            </div>
        </main>
    );
}
