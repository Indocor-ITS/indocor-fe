"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    ArrowLeft, Loader2, Check, MessageSquare,
    Clock, CheckCircle2, XCircle, Save, Download,
    X as XIcon, FileText, CalendarDays
} from "lucide-react";

interface ContentData {
    id: number;
    slug: string;
    title: string;
    date: string;
    status: string;
    review_note: string | null;
    reviewed_at: string | null;
    // Article fields
    author?: string;
    pdf_file?: string;
    image_cover?: string;
    // Event fields
    image_main?: string;
    section1_text?: string;
    image_support1?: string;
    section2_text?: string;
    image_support2?: string;
    section3_text?: string;
}

function StatusBadge({ status }: { status: string }) {
    const config: Record<string, { bg: string; text: string; label: string; icon: React.ReactNode }> = {
        pending: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", label: "Menunggu Review", icon: <Clock size={14} /> },
        approved: { bg: "bg-green-50 border-green-200", text: "text-green-700", label: "Disetujui ✓", icon: <CheckCircle2 size={14} /> },
        rejected: { bg: "bg-red-50 border-red-200", text: "text-red-700", label: "Perlu Revisi", icon: <XCircle size={14} /> },
    };
    const c = config[status] || config.pending;
    return (
        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border ${c.bg} ${c.text}`}>
            {c.icon}
            {c.label}
        </span>
    );
}

export default function ReviewDetailPage({ params }: { params: Promise<{ type: string; id: string }> }) {
    const { type, id } = use(params);
    const router = useRouter();
    const [data, setData] = useState<ContentData | null>(null);
    const [editData, setEditData] = useState<ContentData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [reviewNote, setReviewNote] = useState("");
    const [showRejectForm, setShowRejectForm] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

    const isArticle = type === "articles";
    const apiPath = isArticle ? "/api/articles" : "/api/events";

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`${apiPath}/${id}`);
                if (!res.ok) throw new Error("Not found");
                const result = await res.json();
                setData(result);
                setEditData(result);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [apiPath, id]);

    const handleSaveEdit = async () => {
        if (!editData) return;
        setSaving(true);
        try {
            const res = await fetch(`${apiPath}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editData),
            });
            if (res.ok) {
                setData(editData);
                setIsEditing(false);
                setSuccessMsg("Perubahan berhasil disimpan!");
                setTimeout(() => setSuccessMsg(""), 3000);
            }
        } catch (error) {
            console.error("Error saving:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleReview = async (action: "approve" | "reject") => {
        setProcessing(true);
        try {
            const res = await fetch("/api/superadmin/review", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type,
                    id: Number(id),
                    action,
                    review_note: action === "reject" ? reviewNote : null,
                }),
            });

            if (res.ok) {
                setSuccessMsg(action === "approve" ? "Konten berhasil disetujui dan dipublikasikan!" : "Catatan revisi berhasil dikirim!");
                setTimeout(() => {
                    router.push(isArticle ? "/superadmin/articles" : "/superadmin/activities");
                }, 1500);
            }
        } catch (error) {
            console.error("Error reviewing:", error);
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 size={32} className="animate-spin text-gray-300" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center py-20">
                <p className="text-lg font-bold text-gray-500">Konten tidak ditemukan</p>
                <Link href={isArticle ? "/superadmin/articles" : "/superadmin/activities"} className="text-indigo-600 text-sm font-medium mt-2 inline-block">
                    ← Kembali
                </Link>
            </div>
        );
    }

    return (
        <div>
            {/* Success Toast */}
            {successMsg && (
                <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-6 py-3 rounded-xl shadow-2xl font-bold text-sm flex items-center gap-2">
                    <CheckCircle2 size={18} />
                    {successMsg}
                </div>
            )}

            {/* Header */}
            <div className="mb-8">
                <Link
                    href={isArticle ? "/superadmin/articles" : "/superadmin/activities"}
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium mb-4"
                >
                    <ArrowLeft size={16} />
                    Kembali ke {isArticle ? "Review Artikel" : "Review Kegiatan"}
                </Link>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            {isArticle ? <FileText size={20} className="text-blue-600" /> : <CalendarDays size={20} className="text-emerald-600" />}
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                                {isArticle ? "Artikel" : "Kegiatan"}
                            </span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                            {data.title}
                        </h1>
                    </div>
                    <StatusBadge status={data.status || "pending"} />
                </div>
            </div>

            {/* Review Note (if rejected) */}
            {data.review_note && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
                    <div className="flex items-start gap-3">
                        <XCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                        <div>
                            <p className="font-bold text-red-800 text-sm">Catatan Revisi Sebelumnya:</p>
                            <p className="text-red-700 text-sm mt-1">{data.review_note}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Content Preview */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-bold text-gray-900">Detail Konten</h2>
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                            ✏️ Edit Konten
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={handleSaveEdit}
                                disabled={saving}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all"
                            >
                                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                Simpan
                            </button>
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditData(data);
                                }}
                                className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 text-sm font-medium transition-all"
                            >
                                Batal
                            </button>
                        </div>
                    )}
                </div>

                <div className="p-6 space-y-6">
                    {/* Basic Info */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Judul</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editData?.title || ""}
                                    onChange={(e) => setEditData((prev) => prev ? { ...prev, title: e.target.value } : null)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm"
                                />
                            ) : (
                                <p className="text-gray-900 font-medium">{data.title}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Tanggal</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editData?.date || ""}
                                    onChange={(e) => setEditData((prev) => prev ? { ...prev, date: e.target.value } : null)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm"
                                />
                            ) : (
                                <p className="text-gray-700">{data.date}</p>
                            )}
                        </div>
                    </div>

                    {/* Article-specific fields */}
                    {isArticle && (
                        <>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Penulis</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editData?.author || ""}
                                            onChange={(e) => setEditData((prev) => prev ? { ...prev, author: e.target.value } : null)}
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm"
                                        />
                                    ) : (
                                        <p className="text-gray-700">{data.author}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">File PDF</label>
                                    <a
                                        href={data.pdf_file}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm"
                                    >
                                        <Download size={16} />
                                        Lihat / Download PDF
                                    </a>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Event-specific fields */}
                    {!isArticle && (
                        <>
                            {/* Main Image */}
                            {data.image_main && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Foto Utama</label>
                                    <div className="relative w-full h-64 rounded-xl overflow-hidden bg-gray-100">
                                        <Image src={data.image_main} alt="Main" fill className="object-cover" />
                                    </div>
                                </div>
                            )}

                            {/* Section 1 */}
                            {data.section1_text && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Section 1 — Penjelasan</label>
                                    {isEditing ? (
                                        <textarea
                                            value={editData?.section1_text || ""}
                                            onChange={(e) => setEditData((prev) => prev ? { ...prev, section1_text: e.target.value } : null)}
                                            rows={5}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm resize-none"
                                        />
                                    ) : (
                                        <div className="bg-gray-50 rounded-xl p-4 text-gray-700 text-sm whitespace-pre-wrap">{data.section1_text}</div>
                                    )}
                                </div>
                            )}

                            {/* Support Image 1 */}
                            {data.image_support1 && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Foto Pendukung 1</label>
                                    <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gray-100">
                                        <Image src={data.image_support1} alt="Support 1" fill className="object-cover" />
                                    </div>
                                </div>
                            )}

                            {/* Section 2 */}
                            {data.section2_text && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Section 2 — Penjelasan</label>
                                    {isEditing ? (
                                        <textarea
                                            value={editData?.section2_text || ""}
                                            onChange={(e) => setEditData((prev) => prev ? { ...prev, section2_text: e.target.value } : null)}
                                            rows={5}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm resize-none"
                                        />
                                    ) : (
                                        <div className="bg-gray-50 rounded-xl p-4 text-gray-700 text-sm whitespace-pre-wrap">{data.section2_text}</div>
                                    )}
                                </div>
                            )}

                            {/* Support Image 2 */}
                            {data.image_support2 && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Foto Pendukung 2</label>
                                    <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gray-100">
                                        <Image src={data.image_support2} alt="Support 2" fill className="object-cover" />
                                    </div>
                                </div>
                            )}

                            {/* Section 3 */}
                            {data.section3_text && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Section 3 — Penjelasan</label>
                                    {isEditing ? (
                                        <textarea
                                            value={editData?.section3_text || ""}
                                            onChange={(e) => setEditData((prev) => prev ? { ...prev, section3_text: e.target.value } : null)}
                                            rows={5}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm resize-none"
                                        />
                                    ) : (
                                        <div className="bg-gray-50 rounded-xl p-4 text-gray-700 text-sm whitespace-pre-wrap">{data.section3_text}</div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Review Actions */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-bold text-gray-900 mb-4">Aksi Review</h2>

                {/* Reject Form */}
                {showRejectForm && (
                    <div className="bg-red-50/50 border border-red-100 rounded-xl p-4 mb-4">
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
                    </div>
                )}

                <div className="flex flex-wrap gap-3">
                    {data.status !== "approved" && (
                        <button
                            onClick={() => handleReview("approve")}
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-bold disabled:opacity-50 transition-all shadow-lg shadow-green-600/20"
                        >
                            {processing ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                            Approve & Publikasikan
                        </button>
                    )}

                    {data.status !== "rejected" && !showRejectForm && (
                        <button
                            onClick={() => setShowRejectForm(true)}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 text-sm font-bold transition-all"
                        >
                            <MessageSquare size={18} />
                            Minta Revisi
                        </button>
                    )}

                    {showRejectForm && (
                        <>
                            <button
                                onClick={() => handleReview("reject")}
                                disabled={!reviewNote.trim() || processing}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold disabled:opacity-50 transition-all"
                            >
                                {processing ? <Loader2 size={18} className="animate-spin" /> : <XIcon size={18} />}
                                Kirim Revisi
                            </button>
                            <button
                                onClick={() => {
                                    setShowRejectForm(false);
                                    setReviewNote("");
                                }}
                                className="px-6 py-3 rounded-xl text-gray-600 hover:bg-gray-100 text-sm font-medium transition-all"
                            >
                                Batal
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
