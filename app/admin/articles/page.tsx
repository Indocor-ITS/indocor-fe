"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Loader2, Search, FileText, Download, Clock, CheckCircle2, XCircle } from "lucide-react";

interface Article {
    id: number;
    slug: string;
    title: string;
    date: string;
    author: string;
    pdf_file: string;
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

export default function AdminArticlesPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");


    const fetchArticles = async () => {
        try {
            const res = await fetch("/api/articles?all=true");
            const data = await res.json();
            setArticles(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);



    const filtered = articles.filter((a) =>
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.author.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                        Kelola Artikel
                    </h1>
                    <p className="text-gray-500 mt-1">{articles.length} artikel PDF tersedia</p>
                </div>
                <Link
                    href="/admin/articles/create"
                    className="inline-flex items-center gap-2 bg-red hover:bg-red/90 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-red/20 text-sm"
                >
                    <Plus size={18} />
                    <span>Upload Artikel</span>
                </Link>
            </div>

            {/* Search */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                    <div className="relative max-w-sm">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari artikel..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-red focus:ring-2 focus:ring-red/20 outline-none transition-all text-sm"
                        />
                    </div>
                </div>

                {/* Table */}
                {loading ? (
                    <div className="p-20 flex items-center justify-center">
                        <Loader2 size={32} className="animate-spin text-gray-300" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="p-20 text-center text-gray-400">
                        <FileText size={48} className="mx-auto mb-4 text-gray-200" />
                        <p className="text-lg font-medium">Belum ada artikel</p>
                        <p className="text-sm mt-1">Upload artikel PDF pertama kamu</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100 text-left">
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">#</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Judul</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Penulis</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Tanggal</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">PDF</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((article, idx) => (
                                    <tr key={article.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-400 font-mono">{idx + 1}</td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-semibold text-gray-900 line-clamp-1">{article.title}</p>
                                            {article.review_note && article.status === "rejected" && (
                                                <p className="text-xs text-red-500 mt-1 line-clamp-1">📝 {article.review_note}</p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">{article.author}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 hidden lg:table-cell">{article.date}</td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={article.status || "pending"} />
                                        </td>
                                        <td className="px-6 py-4 hidden lg:table-cell">
                                            <a
                                                href={article.pdf_file}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                                            >
                                                <Download size={14} />
                                                Lihat PDF
                                            </a>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/articles/edit/${article.id}`}
                                                    className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors"
                                                    title="Edit"
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
