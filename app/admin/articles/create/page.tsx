"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Loader2, Save, UploadCloud, FileText, X } from "lucide-react";
import Link from "next/link";

export default function CreateArticlePage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    const coverInputRef = useRef<HTMLInputElement>(null);
    const [uploadingCover, setUploadingCover] = useState(false);

    const [form, setForm] = useState({
        title: "",
        slug: "",
        date: "",
        author: "",
        image_cover: "",
        pdf_file: "",
    });

    const [pdfFileName, setPdfFileName] = useState("");

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim();
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
            ...(name === "title" ? { slug: generateSlug(value) } : {}),
        }));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            setError("Hanya file PDF yang diperbolehkan");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            setError("Ukuran file maksimal 10MB");
            return;
        }

        setUploading(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || "Gagal upload file");
                return;
            }

            const data = await res.json();
            setForm((prev) => ({ ...prev, pdf_file: data.filePath }));
            setPdfFileName(file.name);
        } catch {
            setError("Gagal upload file");
        } finally {
            setUploading(false);
        }
    };

    const removePdf = () => {
        setForm((prev) => ({ ...prev, pdf_file: "" }));
        setPdfFileName("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (!form.pdf_file) {
            setError("File PDF wajib diupload");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/articles", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || "Gagal menambahkan artikel");
                return;
            }

            router.push("/admin/articles");
        } catch {
            setError("Terjadi kesalahan koneksi");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="mb-8">
                <Link
                    href="/admin/articles"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium mb-4"
                >
                    <ArrowLeft size={16} />
                    Kembali ke Daftar Artikel
                </Link>
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                    Upload Artikel Baru
                </h1>
                <p className="text-gray-500 mt-1">Upload file PDF artikel dan lengkapi informasi berikut</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 md:p-8 space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
                            {error}
                        </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Judul */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Judul Artikel *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                required
                                placeholder="Masukkan judul artikel..."
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red focus:ring-2 focus:ring-red/20 outline-none transition-all"
                            />
                        </div>

                        {/* Tanggal */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Tanggal Pembuatan *
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={form.date}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red focus:ring-2 focus:ring-red/20 outline-none transition-all"
                            />
                        </div>

                        {/* Penulis */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Dibuat Oleh *
                            </label>
                            <input
                                type="text"
                                name="author"
                                value={form.author}
                                onChange={handleChange}
                                required
                                placeholder="Nama individu atau Divisi Research INDOCOR"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red focus:ring-2 focus:ring-red/20 outline-none transition-all"
                            />
                            <p className="text-xs text-gray-400 mt-1.5">
                                Bisa atas nama perseorangan atau divisi, contoh: &quot;Divisi Research INDOCOR&quot;
                            </p>
                        </div>

                        {/* Cover Image */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Cover Image (opsional)
                            </label>
                            {form.image_cover ? (
                                <div className="relative rounded-xl border-2 border-emerald-200 bg-emerald-50 overflow-hidden">
                                    <div className="relative w-full h-48">
                                        <Image src={form.image_cover} alt="Cover" fill className="object-cover" />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setForm((prev) => ({ ...prev, image_cover: "" }));
                                            if (coverInputRef.current) coverInputRef.current.value = "";
                                        }}
                                        className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-white/90 text-gray-500 hover:text-red-500 flex items-center justify-center shadow-sm transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 hover:border-red transition-all group cursor-pointer">
                                    <input
                                        ref={coverInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            setUploadingCover(true);
                                            try {
                                                const fd = new FormData();
                                                fd.append("file", file);
                                                fd.append("type", "image");
                                                const res = await fetch("/api/upload", { method: "POST", body: fd });
                                                if (res.ok) {
                                                    const data = await res.json();
                                                    setForm((prev) => ({ ...prev, image_cover: data.filePath }));
                                                }
                                            } catch { } finally { setUploadingCover(false); }
                                        }}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        disabled={uploadingCover}
                                    />
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-12 h-12 rounded-xl bg-red/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            {uploadingCover ? <Loader2 size={20} className="text-red animate-spin" /> : <UploadCloud size={20} className="text-red" />}
                                        </div>
                                        <p className="text-sm font-medium text-gray-600">{uploadingCover ? "Mengupload..." : "Upload cover image"}</p>
                                        <p className="text-xs text-gray-400">JPG, PNG, WebP • Max 10MB</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* PDF Upload */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                File PDF *
                            </label>

                            {form.pdf_file ? (
                                /* Preview uploaded file */
                                <div className="flex items-center gap-4 p-4 rounded-xl border-2 border-emerald-200 bg-emerald-50">
                                    <div className="w-12 h-12 rounded-xl bg-red/10 flex items-center justify-center flex-shrink-0">
                                        <FileText size={24} className="text-red" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 truncate">
                                            {pdfFileName || "File PDF"}
                                        </p>
                                        <p className="text-xs text-emerald-600 font-medium mt-0.5">
                                            ✓ Berhasil diupload
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={removePdf}
                                        className="w-8 h-8 rounded-lg bg-white text-gray-400 hover:text-red-500 flex items-center justify-center border border-gray-200 transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                /* Upload area */
                                <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 hover:border-red transition-all group">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileUpload}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        disabled={uploading}
                                    />
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-14 h-14 rounded-2xl bg-red/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            {uploading ? (
                                                <Loader2 size={24} className="text-red animate-spin" />
                                            ) : (
                                                <UploadCloud className="text-red" size={24} />
                                            )}
                                        </div>
                                        <div>
                                            {uploading ? (
                                                <p className="font-semibold text-gray-900">Mengupload PDF...</p>
                                            ) : (
                                                <>
                                                    <p className="font-semibold text-gray-900">
                                                        Klik atau drag &amp; drop file PDF
                                                    </p>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        Maksimal 10MB • Format .pdf
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 md:px-8 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button
                        type="submit"
                        disabled={isLoading || uploading}
                        className="inline-flex items-center gap-2 bg-red hover:bg-red/90 disabled:opacity-70 text-white font-bold px-8 py-3 rounded-xl transition-all text-sm shadow-lg shadow-red/20"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                <span>Menyimpan...</span>
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                <span>Simpan Artikel</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
