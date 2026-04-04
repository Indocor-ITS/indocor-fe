"use client";

import { useState, useRef } from "react";
import { FadeIn } from "@/components/FadeIn";
import { UploadCloud, CheckCircle2, Loader2, AlertCircle } from "lucide-react";


const packages = [
    {
        id: "non-akomodasi",
        name: "Non Akomodasi",
        price: "Rp 3.500.000",
        features: [
            "Fee Sertifikasi",
            "Merchandise (Rp 60.000 / pax)",
            "Snack pagi (Rp 25.000 / pax, 3 hari)",
            "Meeting package (Rp 3.250.000)",
            "Makan siang (Rp 45.000 / pax, 3 hari)",
        ],
    },
    {
        id: "akomodasi",
        name: "Akomodasi",
        price: "Rp 4.500.000",
        features: [
            "Hotel (Rp 990.000 / pax, 3 malam) *Tanpa sarapan",
            "Fee Sertifikasi",
            "Merchandise (Rp 60.000 / pax)",
            "Snack pagi (Rp 25.000 / pax, 3 hari)",
            "Meeting package (Rp 3.250.000)",
            "Makan siang (Rp 45.000 / pax, 3 hari)",
        ],
        highlight: true,
    },
];

/* ── Main Component ──────────────────────────────────────────── */

export default function RegisterICCP() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [fileName, setFileName] = useState<string>("");
    const [fileBase64, setFileBase64] = useState<string>("");

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Handle File Upload to Base64 (for Google Sheets/Apps Script)
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size (limit to ~3MB for Google Apps Script payload limits)
        if (file.size > 3 * 1024 * 1024) {
            alert("Ukuran file terlalu besar. Maksimal 3MB.");
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        setFileName(file.name);
        setError(null);

        const reader = new FileReader();
        reader.onload = (event) => {
            const base64String = event.target?.result as string;
            // Get raw base64 without data URI prefix for easier saving
            const base64Data = base64String.split(",")[1];
            setFileBase64(base64Data);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);

        // Construct payload to send to Google Apps Script Web App
        const payload = {
            namaLengkap: formData.get("namaLengkap"),
            jenisKelamin: formData.get("jenisKelamin"),
            nomorWA: formData.get("nomorWA"),
            asalInstansi: formData.get("asalInstansi"),
            paket: formData.get("paket"),
            fileName: fileName,
            fileMimeType: fileName.substring(fileName.lastIndexOf('.')),
            fileContent: fileBase64, // The base64 image data
        };

        try {
            const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx5D-SfoQeEulglojrgXB69Kykzkgi5vh1td1RuNRD__JCoBI8GY4UmHTvPTDbfhJzq/exec";

            // Google Apps Script requires 'text/plain' or no-cors to avoid strict preflight errors
            await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "text/plain",
                },
                body: JSON.stringify(payload),
            });

            // Because 'no-cors' returns an opaque response, we assume success 
            // if the fetch block didn't throw a network error.
            setIsSuccess(true);

        } catch (err) {
            console.error(err);
            setError("Terjadi kesalahan saat mengirim data. Silakan coba lagi.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <main className="min-h-screen bg-gray-50 flex items-center justify-center pt-20 px-6">
                <FadeIn direction="up">
                    <div className="bg-white p-10 md:p-14 rounded-xl shadow-sm border border-gray-100 text-center max-w-lg w-full">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 size={40} className="text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Pendaftaran Berhasil!</h2>
                        <p className="text-gray-600 leading-relaxed mb-8">
                            Terima kasih telah mendaftar program sertifikasi ICCP 2026. Data dan bukti pembayaran Anda telah kami terima dan masuk ke dalam database kami. Tim kami akan segera menghubungi Anda melalui WhatsApp.
                        </p>
                        <button
                            onClick={() => window.location.href = "/"}
                            className="bg-red hover:bg-red/90 text-white font-medium px-8 py-3 rounded-full transition-colors"
                        >
                            Kembali ke Beranda
                        </button>
                    </div>
                </FadeIn>
            </main>
        );
    }

    return (
        <main className="bg-gray-50 min-h-screen pt-28 pb-20">
            <div className="max-w-4xl mx-auto px-6 md:px-12">

                <FadeIn direction="up">
                    <div className="mb-12 text-center">
                        <span className="text-xs font-semibold tracking-[0.2em] uppercase text-red mb-3 block">
                            Pendaftaran Dibuka
                        </span>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
                            Formulir Pendaftaran ICCP 2026
                        </h1>
                        <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
                            Pilih paket sertifikasi yang sesuai dengan kebutuhan Anda dan lengkapi data diri di bawah ini.
                        </p>
                    </div>
                </FadeIn>

                <FadeIn direction="up" delay={0.1}>
                    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

                        <div className="p-8 md:p-12 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-red text-white text-xs flex items-center justify-center font-bold">1</span>
                                Data Diri Peserta
                            </h2>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Nama Lengkap */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
                                    <input
                                        type="text"
                                        name="namaLengkap"
                                        required
                                        placeholder="Masukkan nama lengkap beserta gelar (jika ada)"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-red focus:ring-1 focus:ring-red outline-none transition-colors"
                                    />
                                </div>

                                {/* Jenis Kelamin */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Jenis Kelamin</label>
                                    <select
                                        name="jenisKelamin"
                                        required
                                        defaultValue=""
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-red focus:ring-1 focus:ring-red outline-none transition-colors bg-white appearance-none"
                                    >
                                        <option value="" disabled>Pilih jenis kelamin</option>
                                        <option value="Laki-laki">Laki-laki</option>
                                        <option value="Perempuan">Perempuan</option>
                                    </select>
                                </div>

                                {/* Nomor WA */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor WhatsApp</label>
                                    <input
                                        type="tel"
                                        name="nomorWA"
                                        required
                                        placeholder="Contoh: 081234567890"
                                        pattern="[0-9]*"
                                        inputMode="numeric"
                                        onInput={(e) => {
                                            e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
                                        }}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-red focus:ring-1 focus:ring-red outline-none transition-colors"
                                    />
                                </div>

                                {/* Asal Instansi */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Asal Instansi / Universitas</label>
                                    <input
                                        type="text"
                                        name="asalInstansi"
                                        required
                                        placeholder="Contoh: Institut Teknologi Sepuluh Nopember / PT. Pertamina"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-red focus:ring-1 focus:ring-red outline-none transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-8 md:p-12 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-red text-white text-xs flex items-center justify-center font-bold">2</span>
                                Pilihan Paket Sertifikasi
                            </h2>

                            <div className="grid md:grid-cols-2 gap-6">
                                {packages.map((pkg) => (
                                    <label
                                        key={pkg.id}
                                        className={`relative flex flex-col p-6 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${pkg.highlight ? "bg-white border-red/40" : "bg-white border-gray-200"
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="paket"
                                            value={pkg.name}
                                            required
                                            className="absolute top-6 right-6 w-5 h-5 accent-red text-red cursor-pointer"
                                        />
                                        <div className="mb-4 pr-8">
                                            <h3 className="text-lg font-bold text-gray-900">{pkg.name}</h3>
                                            <p className="text-xl font-extrabold text-red mt-1">{pkg.price}</p>
                                        </div>
                                        <ul className="flex flex-col gap-2 mt-auto">
                                            {pkg.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                                                    <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                                                    <span className="leading-tight">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="p-8 md:p-12">
                            <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-red text-white text-xs flex items-center justify-center font-bold">3</span>
                                Bukti Pembayaran
                            </h2>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5 mb-6">
                                <p className="text-sm text-yellow-800 leading-relaxed">
                                    Silakan transfer sesuai dengan nominal paket yang dipilih ke rekening berikut:<br />
                                    <strong>BCA: 1234567890 a.n INDOCOR ITS SC</strong><br />
                                    <strong>Mandiri: 0987654321 a.n INDOCOR ITS SC</strong>
                                </p>
                            </div>

                            <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 hover:border-red transition-all group">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    required
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-red/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <UploadCloud className="text-red" size={24} />
                                    </div>
                                    <div>
                                        {fileName ? (
                                            <p className="font-semibold text-gray-900">{fileName}</p>
                                        ) : (
                                            <>
                                                <p className="font-semibold text-gray-900">Upload Bukti Transfer</p>
                                                <p className="text-sm text-gray-500 mt-1">Klik atau drag & drop file di sini (Max 3MB, .jpg, .png)</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="mt-6 flex items-start gap-3 bg-red/10 text-red p-4 rounded-lg text-sm">
                                    <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                                    <p>{error}</p>
                                </div>
                            )}

                        </div>

                        <div className="px-8 py-6 md:px-12 md:py-8 bg-gray-50 border-t border-gray-100 flex justify-end">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full md:w-auto bg-red hover:bg-red/90 disabled:opacity-70 disabled:cursor-not-allowed text-white px-10 py-4 rounded-full font-bold text-base transition-all flex items-center justify-center gap-2 shadow-lg"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        <span>Memproses Data...</span>
                                    </>
                                ) : (
                                    "Kirim Pendaftaran"
                                )}
                            </button>
                        </div>

                    </form>
                </FadeIn>
            </div>
        </main>
    );
}
