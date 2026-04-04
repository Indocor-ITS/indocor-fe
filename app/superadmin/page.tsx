"use client";

import { useEffect, useState } from "react";
import { FileText, CalendarDays, Clock, CheckCircle2, XCircle, TrendingUp, Shield } from "lucide-react";
import Link from "next/link";

export default function SuperAdminDashboard() {
    const [stats, setStats] = useState({
        articles: 0,
        events: 0,
        pendingArticles: 0,
        pendingEvents: 0,
        approved: 0,
        rejected: 0,
    });
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
                const allArticles = Array.isArray(articles) ? articles : [];
                const allEvents = Array.isArray(events) ? events : [];
                const allContent = [...allArticles, ...allEvents];

                setStats({
                    articles: allArticles.length,
                    events: allEvents.length,
                    pendingArticles: allArticles.filter((a: { status: string }) => a.status === "pending").length,
                    pendingEvents: allEvents.filter((e: { status: string }) => e.status === "pending").length,
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

    const totalPending = stats.pendingArticles + stats.pendingEvents;

    const statCards = [
        {
            title: "Menunggu Review",
            value: totalPending,
            icon: Clock,
            lightColor: "bg-amber-50",
            textColor: "text-amber-600",
            href: "#",
        },
        {
            title: "Disetujui",
            value: stats.approved,
            icon: CheckCircle2,
            lightColor: "bg-green-50",
            textColor: "text-green-600",
            href: "#",
        },
        {
            title: "Ditolak / Revisi",
            value: stats.rejected,
            icon: XCircle,
            lightColor: "bg-red-50",
            textColor: "text-red-600",
            href: "#",
        },
        {
            title: "Total Semua Konten",
            value: stats.articles + stats.events,
            icon: TrendingUp,
            lightColor: "bg-indigo-50",
            textColor: "text-indigo-600",
            href: "#",
        },
    ];

    return (
        <div>
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <Shield className="text-indigo-600" size={28} />
                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                        Super Admin Dashboard
                    </h1>
                </div>
                <p className="text-gray-500 mt-1">
                    Review dan kelola semua konten yang diajukan oleh Admin
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {statCards.map((card) => (
                    <div
                        key={card.title}
                        className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
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
                    </div>
                ))}
            </div>

            {/* Pending Alert */}
            {!loading && totalPending > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
                    <div className="flex items-start gap-3">
                        <Clock className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
                        <div>
                            <p className="font-bold text-amber-800 text-sm">
                                Ada {totalPending} konten menunggu review kamu!
                            </p>
                            <p className="text-amber-700 text-sm mt-1">
                                {stats.pendingArticles > 0 && `${stats.pendingArticles} artikel`}
                                {stats.pendingArticles > 0 && stats.pendingEvents > 0 && " dan "}
                                {stats.pendingEvents > 0 && `${stats.pendingEvents} kegiatan`}
                                {" "}perlu di-review sebelum ditampilkan di website.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Review Konten</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                    <Link
                        href="/superadmin/articles"
                        className="flex items-center justify-between px-6 py-5 rounded-xl border-2 border-gray-100 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                                <FileText size={22} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-sm">Review Artikel</p>
                                <p className="text-gray-500 text-xs mt-0.5">{stats.articles} artikel total</p>
                            </div>
                        </div>
                        {stats.pendingArticles > 0 && (
                            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full">
                                {stats.pendingArticles} pending
                            </span>
                        )}
                    </Link>
                    <Link
                        href="/superadmin/activities"
                        className="flex items-center justify-between px-6 py-5 rounded-xl border-2 border-gray-100 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                                <CalendarDays size={22} className="text-emerald-600" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-sm">Review Kegiatan</p>
                                <p className="text-gray-500 text-xs mt-0.5">{stats.events} kegiatan total</p>
                            </div>
                        </div>
                        {stats.pendingEvents > 0 && (
                            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full">
                                {stats.pendingEvents} pending
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </div>
    );
}
