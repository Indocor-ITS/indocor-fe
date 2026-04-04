"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    Loader2, Search, Clock, CheckCircle2, XCircle,
    Eye, MessageSquare, Check, X as XIcon, Trash2
} from "lucide-react";

interface EventItem {
    id: number;
    slug: string;
    title: string;
    date: string;
    image_main: string;
    status: string;
    review_note: string | null;
    reviewed_at: string | null;
}

function StatusBadge({ status }: { status: string }) {
    const config: Record<string, { bg: string; text: string; label: string; icon: React.ReactNode }> = {
        pending: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", label: "Menunggu Review", icon: <Clock size={12} /> },
        approved: { bg: "bg-green-50 border-green-200", text: "text-green-700", label: "Disetujui ✓", icon: <CheckCircle2 size={12} /> },
        rejected: { bg: "bg-red-50 border-red-200", text: "text-red-700", label: "Perlu Revisi", icon: <XCircle size={12} /> },
    };
    const c = config[status] || config.pending;
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${c.bg} ${c.text}`}>
            {c.icon}
            {c.label}
        </span>
    );
}

export default function SuperAdminActivitiesPage() {
    const [events, setEvents] = useState<EventItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<string>("all");
    const [reviewingId, setReviewingId] = useState<number | null>(null);
    const [reviewNote, setReviewNote] = useState("");
    const [processing, setProcessing] = useState<number | null>(null);
    const [successMsg, setSuccessMsg] = useState("");
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const fetchEvents = async () => {
        try {
            const res = await fetch("/api/events?all=true");
            const data = await res.json();
            setEvents(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleReview = async (id: number, action: "approve" | "reject") => {
        setProcessing(id);
        try {
            const res = await fetch("/api/superadmin/review", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "events",
                    id,
                    action,
                    review_note: action === "reject" ? reviewNote : null,
                }),
            });

            if (res.ok) {
                setSuccessMsg(action === "approve" ? "Kegiatan berhasil disetujui!" : "Catatan revisi berhasil dikirim!");
                setTimeout(() => setSuccessMsg(""), 3000);
                setReviewingId(null);
                setReviewNote("");
                await fetchEvents();
            }
        } catch (error) {
            console.error("Error reviewing:", error);
        } finally {
            setProcessing(null);
        }
    };

    const handleDelete = async (id: number, title: string) => {
        if (!confirm(`Apakah Anda yakin ingin menghapus kegiatan "${title}"? Tindakan ini tidak dapat dibatalkan.`)) return;
        setDeletingId(id);
        try {
            const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
            if (res.ok) {
                setSuccessMsg("Kegiatan berhasil dihapus!");
                setTimeout(() => setSuccessMsg(""), 3000);
                await fetchEvents();
            } else {
                alert("Gagal menghapus kegiatan.");
            }
        } catch (error) {
            console.error("Error deleting:", error);
            alert("Terjadi kesalahan saat menghapus.");
        } finally {
            setDeletingId(null);
        }
    };

    const filtered = events
        .filter((e) => e.title.toLowerCase().includes(search.toLowerCase()))
        .filter((e) => filter === "all" || e.status === filter);

    const counts = {
        all: events.length,
        pending: events.filter((e) => e.status === "pending").length,
        approved: events.filter((e) => e.status === "approved").length,
        rejected: events.filter((e) => e.status === "rejected").length,
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                    Review Kegiatan
                </h1>
                <p className="text-gray-500 mt-1">
                    Periksa dan setujui kegiatan yang diajukan oleh Admin
                </p>
            </div>

            {/* Success Toast */}
            {successMsg && (
                <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-6 py-3 rounded-xl shadow-2xl font-bold text-sm flex items-center gap-2">
                    <CheckCircle2 size={18} />
                    {successMsg}
                </div>
            )}

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
                {[
                    { key: "all", label: "Semua", count: counts.all },
                    { key: "pending", label: "Menunggu", count: counts.pending },
                    { key: "approved", label: "Disetujui", count: counts.approved },
                    { key: "rejected", label: "Revisi", count: counts.rejected },
                ].map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setFilter(tab.key)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                            filter === tab.key
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                                : "bg-white text-gray-600 border border-gray-200 hover:border-indigo-300"
                        }`}
                    >
                        {tab.label} ({tab.count})
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                    <div className="relative max-w-sm">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari kegiatan..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="p-20 flex items-center justify-center">
                        <Loader2 size={32} className="animate-spin text-gray-300" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="p-20 text-center text-gray-400">
                        <p className="text-lg font-medium">Tidak ada kegiatan</p>
                        <p className="text-sm mt-1">
                            {filter !== "all" ? "Coba ubah filter di atas" : "Belum ada kegiatan yang diajukan"}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filtered.map((event) => (
                            <div key={event.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                    {/* Preview Image */}
                                    <div className="w-24 h-16 rounded-xl overflow-hidden relative bg-gray-100 flex-shrink-0">
                                        <Image
                                            src={event.image_main}
                                            alt={event.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Content Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-1">
                                            <StatusBadge status={event.status || "pending"} />
                                        </div>
                                        <h3 className="font-bold text-gray-900 text-base line-clamp-1">
                                            {event.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">📅 {event.date}</p>
                                        {event.review_note && (
                                            <div className="mt-3 bg-red-50 border border-red-100 rounded-lg px-4 py-2">
                                                <p className="text-xs font-bold text-red-700 mb-0.5">Catatan Revisi:</p>
                                                <p className="text-sm text-red-600">{event.review_note}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <Link
                                            href={`/superadmin/review/events/${event.id}`}
                                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all text-sm font-medium"
                                        >
                                            <Eye size={16} />
                                            Detail
                                        </Link>

                                        {event.status !== "approved" && (
                                            <button
                                                onClick={() => handleReview(event.id, "approve")}
                                                disabled={processing === event.id}
                                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white transition-all text-sm font-bold disabled:opacity-50"
                                            >
                                                {processing === event.id ? (
                                                    <Loader2 size={16} className="animate-spin" />
                                                ) : (
                                                    <Check size={16} />
                                                )}
                                                Approve
                                            </button>
                                        )}

                                        {event.status !== "rejected" && (
                                            <button
                                                onClick={() => {
                                                    setReviewingId(reviewingId === event.id ? null : event.id);
                                                    setReviewNote("");
                                                }}
                                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-all text-sm font-bold"
                                            >
                                                <MessageSquare size={16} />
                                                Revisi
                                            </button>
                                        )}

                                        <button
                                            onClick={() => handleDelete(event.id, event.title)}
                                            disabled={deletingId === event.id}
                                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-900 text-white transition-all text-sm font-bold disabled:opacity-50"
                                        >
                                            {deletingId === event.id ? (
                                                <Loader2 size={16} className="animate-spin" />
                                            ) : (
                                                <Trash2 size={16} />
                                            )}
                                            Hapus
                                        </button>
                                    </div>
                                </div>

                                {/* Revision Note Form */}
                                {reviewingId === event.id && (
                                    <div className="mt-4 bg-red-50/50 border border-red-100 rounded-xl p-4">
                                        <label className="block text-sm font-bold text-red-700 mb-2">
                                            Catatan Revisi untuk Admin:
                                        </label>
                                        <textarea
                                            value={reviewNote}
                                            onChange={(e) => setReviewNote(e.target.value)}
                                            rows={3}
                                            placeholder="Jelaskan apa yang perlu diperbaiki..."
                                            className="w-full px-4 py-3 rounded-xl border border-red-200 focus:border-red-400 focus:ring-2 focus:ring-red-200 outline-none transition-all text-sm resize-none"
                                        />
                                        <div className="flex gap-2 mt-3">
                                            <button
                                                onClick={() => handleReview(event.id, "reject")}
                                                disabled={!reviewNote.trim() || processing === event.id}
                                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-bold disabled:opacity-50 transition-all"
                                            >
                                                {processing === event.id ? (
                                                    <Loader2 size={14} className="animate-spin" />
                                                ) : (
                                                    <XIcon size={14} />
                                                )}
                                                Kirim Revisi
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setReviewingId(null);
                                                    setReviewNote("");
                                                }}
                                                className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 text-sm font-medium transition-all"
                                            >
                                                Batal
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
