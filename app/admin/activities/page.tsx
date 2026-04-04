"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Loader2, Search, Clock, CheckCircle2, XCircle } from "lucide-react";

interface EventItem {
    id: number;
    slug: string;
    title: string;
    date: string;
    image_main: string;
    status: string;
    review_note: string | null;
}

function StatusBadge({ status }: { status: string }) {
    const config: Record<string, { bg: string; text: string; label: string; icon: React.ReactNode }> = {
        pending: { bg: "bg-amber-50", text: "text-amber-700", label: "Menunggu Review", icon: <Clock size={12} /> },
        approved: { bg: "bg-green-50", text: "text-green-700", label: "Disetujui", icon: <CheckCircle2 size={12} /> },
        rejected: { bg: "bg-red-50", text: "text-red-700", label: "Perlu Revisi", icon: <XCircle size={12} /> },
    };
    const c = config[status] || config.pending;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${c.bg} ${c.text}`}>
            {c.icon}
            {c.label}
        </span>
    );
}

export default function AdminActivitiesPage() {
    const [events, setEvents] = useState<EventItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");


    useEffect(() => {
        async function fetchEvents() {
            try {
                const res = await fetch("/api/events?all=true");
                const data = await res.json();
                setEvents(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchEvents();
    }, []);



    const filtered = events.filter((e) =>
        e.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                        Kelola Kegiatan
                    </h1>
                    <p className="text-gray-500 mt-1">{events.length} kegiatan tersedia</p>
                </div>
                <Link
                    href="/admin/activities/create"
                    className="inline-flex items-center gap-2 bg-red hover:bg-red/90 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-red/20 text-sm"
                >
                    <Plus size={18} />
                    <span>Tambah Kegiatan</span>
                </Link>
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
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-red focus:ring-2 focus:ring-red/20 outline-none transition-all text-sm"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="p-20 flex items-center justify-center">
                        <Loader2 size={32} className="animate-spin text-gray-300" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="p-20 text-center text-gray-400">
                        <p className="text-lg font-medium">Belum ada kegiatan</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100 text-left">
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">#</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Foto</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Kegiatan</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Tanggal</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((event, idx) => (
                                    <tr key={event.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-400 font-mono">{idx + 1}</td>
                                        <td className="px-6 py-4">
                                            <div className="w-14 h-10 rounded-lg overflow-hidden relative bg-gray-100">
                                                <Image
                                                    src={event.image_main}
                                                    alt={event.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-semibold text-gray-900 line-clamp-1">{event.title}</p>
                                            {event.review_note && event.status === "rejected" && (
                                                <p className="text-xs text-red-500 mt-1 line-clamp-1">📝 {event.review_note}</p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">{event.date}</td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={event.status || "pending"} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/activities/edit/${event.id}`}
                                                    className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors"
                                                >
                                                    <Pencil size={16} />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
