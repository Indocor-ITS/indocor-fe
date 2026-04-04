"use client";

import { useEffect, useState } from "react";
import { FileText, CalendarDays, TrendingUp, Users, Clock, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
    const [stats, setStats] = useState({ articles: 0, events: 0, pending: 0, approved: 0, rejected: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const [articlesRes, eventsRes] = await Promise.all([
                    fetch("/api/articles?all=true"),
                    fetch("/api/events?all=true"),
                ]);
                const articles = await articlesRes.json();
                const events = await eventsRes.json();
                const allContent = [...(Array.isArray(articles) ? articles : []), ...(Array.isArray(events) ? events : [])];
                setStats({
                    articles: Array.isArray(articles) ? articles.length : 0,
                    events: Array.isArray(events) ? events.length : 0,
                    pending: allContent.filter((c: { status: string }) => c.status === "pending").length,
                    approved: allContent.filter((c: { status: string }) => c.status === "approved").length,
                    rejected: allContent.filter((c: { status: string }) => c.status === "rejected").length,
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    const statCards = [
        {
            title: "Total Artikel",
            value: stats.articles,
            icon: FileText,
            color: "bg-blue-500",
            lightColor: "bg-blue-50",
            textColor: "text-blue-600",
            href: "/admin/articles",
        },
        {
            title: "Total Kegiatan",
            value: stats.events,
            icon: CalendarDays,
            color: "bg-emerald-500",
            lightColor: "bg-emerald-50",
            textColor: "text-emerald-600",
            href: "/admin/activities",
        },
        {
            title: "Menunggu Review",
            value: stats.pending,
            icon: Clock,
            color: "bg-amber-500",
            lightColor: "bg-amber-50",
            textColor: "text-amber-600",
            href: "#",
        },
        {
            title: "Disetujui",
            value: stats.approved,
            icon: CheckCircle2,
            color: "bg-green-500",
            lightColor: "bg-green-50",
            textColor: "text-green-600",
            href: "#",
        },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                    Dashboard
                </h1>
                <p className="text-gray-500 mt-1">
                    Selamat datang di panel administrasi INDOCOR ITS
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {statCards.map((card) => (
                    <Link
                        key={card.title}
                        href={card.href}
                        className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div
                                className={`w-12 h-12 ${card.lightColor} rounded-xl flex items-center justify-center`}
                            >
                                <card.icon size={22} className={card.textColor} />
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">
                                {card.title}
                            </p>
                            {loading ? (
                                <div className="h-8 w-16 bg-gray-100 rounded animate-pulse" />
                            ) : (
                                <p className="text-3xl font-extrabold text-gray-900">
                                    {card.value}
                                </p>
                            )}
                        </div>
                    </Link>
                ))}
            </div>

            {/* Info Banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
                <div className="flex items-start gap-3">
                    <Clock className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                        <p className="font-bold text-amber-800 text-sm">Sistem Review Aktif</p>
                        <p className="text-amber-700 text-sm mt-1">
                            Semua konten yang kamu buat akan dikirim ke Super Admin untuk direview terlebih dahulu sebelum ditampilkan di website publik.
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Aksi Cepat</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link
                        href="/admin/articles/create"
                        className="flex items-center gap-3 px-5 py-4 rounded-xl border-2 border-dashed border-gray-200 text-gray-600 hover:border-red hover:text-red hover:bg-red/5 transition-all font-medium text-sm"
                    >
                        <FileText size={20} />
                        <span>Tambah Artikel</span>
                    </Link>
                    <Link
                        href="/admin/activities/create"
                        className="flex items-center gap-3 px-5 py-4 rounded-xl border-2 border-dashed border-gray-200 text-gray-600 hover:border-red hover:text-red hover:bg-red/5 transition-all font-medium text-sm"
                    >
                        <CalendarDays size={20} />
                        <span>Tambah Kegiatan</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
