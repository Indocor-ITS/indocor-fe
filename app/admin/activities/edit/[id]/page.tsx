"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Loader2, Save, UploadCloud, X } from "lucide-react";

function ImageUploadField({
    label,
    value,
    onChange,
    required = false,
}: {
    label: string;
    value: string;
    onChange: (path: string) => void;
    required?: boolean;
}) {
    const fileRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setUploadError("");

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("type", "image");

            const res = await fetch("/api/upload", { method: "POST", body: formData });
            if (!res.ok) {
                const data = await res.json();
                setUploadError(data.error || "Gagal upload");
                return;
            }
            const data = await res.json();
            onChange(data.filePath);
        } catch {
            setUploadError("Gagal upload foto");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                {label} {required && "*"}
            </label>
            {uploadError && <p className="text-red-500 text-xs mb-2">{uploadError}</p>}
            {value ? (
                <div className="relative rounded-xl border-2 border-emerald-200 bg-emerald-50 overflow-hidden">
                    <div className="relative w-full h-48">
                        <Image src={value} alt="Preview" fill className="object-cover" />
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            onChange("");
                            if (fileRef.current) fileRef.current.value = "";
                        }}
                        className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-white/90 text-gray-500 hover:text-red-500 flex items-center justify-center shadow-sm transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            ) : (
                <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 hover:border-red transition-all group cursor-pointer">
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        disabled={uploading}
                    />
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-xl bg-red/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            {uploading ? (
                                <Loader2 size={20} className="text-red animate-spin" />
                            ) : (
                                <UploadCloud size={20} className="text-red" />
                            )}
                        </div>
                        <p className="text-sm font-medium text-gray-600">{uploading ? "Mengupload..." : "Upload foto"}</p>
                        <p className="text-xs text-gray-400">JPG, PNG, WebP • Max 10MB</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function EditActivityPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [isLoading, setIsLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        title: "",
        slug: "",
        date: "",
        image_main: "",
        section1_text: "",
        image_support1: "",
        section2_text: "",
        image_support2: "",
        section3_text: "",
    });

    useEffect(() => {
        async function fetchEvent() {
            try {
                const res = await fetch(`/api/events/${id}`);
                if (!res.ok) throw new Error("Not found");
                const data = await res.json();
                setForm({
                    title: data.title || "",
                    slug: data.slug || "",
                    date: data.date || "",
                    image_main: data.image_main || "",
                    section1_text: data.section1_text || "",
                    image_support1: data.image_support1 || "",
                    section2_text: data.section2_text || "",
                    image_support2: data.image_support2 || "",
                    section3_text: data.section3_text || "",
                });
            } catch {
                setError("Kegiatan tidak ditemukan");
            } finally {
                setFetching(false);
            }
        }
        fetchEvent();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (!form.image_main) {
            setError("Foto utama event wajib diupload");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch(`/api/events/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || "Gagal mengupdate kegiatan");
                return;
            }

            router.push("/admin/activities?updated=true");
        } catch {
            setError("Terjadi kesalahan koneksi");
        } finally {
            setIsLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2 size={32} className="animate-spin text-gray-300" />
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <Link
                    href="/admin/activities"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium mb-4"
                >
                    <ArrowLeft size={16} />
                    Kembali ke Daftar Kegiatan
                </Link>
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                    Edit Kegiatan
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
                        {error}
                    </div>
                )}

                {/* Basic Info */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-6">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <span className="w-6 h-6 bg-red text-white rounded-md text-xs font-bold flex items-center justify-center">1</span>
                        Informasi Dasar
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Judul Event *</label>
                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red focus:ring-2 focus:ring-red/20 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Tanggal Event *</label>
                            <input
                                type="text"
                                name="date"
                                value={form.date}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red focus:ring-2 focus:ring-red/20 outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Section 1 */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-6">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <span className="w-6 h-6 bg-red text-white rounded-md text-xs font-bold flex items-center justify-center">2</span>
                        Section 1 — Foto Utama &amp; Penjelasan
                    </h2>
                    <ImageUploadField label="Foto Utama Event" value={form.image_main} onChange={(path) => setForm((prev) => ({ ...prev, image_main: path }))} required />
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Penjelasan Section 1</label>
                        <textarea name="section1_text" value={form.section1_text} onChange={handleChange} rows={6} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red focus:ring-2 focus:ring-red/20 outline-none transition-all resize-none" />
                    </div>
                </div>

                {/* Section 2 */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-6">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <span className="w-6 h-6 bg-red text-white rounded-md text-xs font-bold flex items-center justify-center">3</span>
                        Section 2 — Foto Pendukung &amp; Penjelasan
                    </h2>
                    <ImageUploadField label="Foto Pendukung 1" value={form.image_support1} onChange={(path) => setForm((prev) => ({ ...prev, image_support1: path }))} />
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Penjelasan Section 2</label>
                        <textarea name="section2_text" value={form.section2_text} onChange={handleChange} rows={6} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red focus:ring-2 focus:ring-red/20 outline-none transition-all resize-none" />
                    </div>
                </div>

                {/* Section 3 */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-6">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <span className="w-6 h-6 bg-red text-white rounded-md text-xs font-bold flex items-center justify-center">4</span>
                        Section 3 — Foto Pendukung &amp; Penjelasan
                    </h2>
                    <ImageUploadField label="Foto Pendukung 2" value={form.image_support2} onChange={(path) => setForm((prev) => ({ ...prev, image_support2: path }))} />
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Penjelasan Section 3</label>
                        <textarea name="section3_text" value={form.section3_text} onChange={handleChange} rows={6} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red focus:ring-2 focus:ring-red/20 outline-none transition-all resize-none" />
                    </div>
                </div>

                {/* Submit */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 md:px-8 flex justify-end">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 bg-red hover:bg-red/90 disabled:opacity-70 text-white font-bold px-8 py-3 rounded-xl transition-all text-sm shadow-lg shadow-red/20"
                    >
                        {isLoading ? (
                            <><Loader2 size={18} className="animate-spin" /><span>Menyimpan...</span></>
                        ) : (
                            <><Save size={18} /><span>Update Kegiatan</span></>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
