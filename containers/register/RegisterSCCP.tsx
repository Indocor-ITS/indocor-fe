"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import {
  UploadCloud,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Calendar,
  MapPin,
  Gift,
  ChevronDown,
  BookOpen,
  Hourglass,
  CalendarClock,
  ArrowRight,
} from "lucide-react";

const acara = {
  deskripsi:
    "Student Corrosion Certification Project (SCCP) merupakan salah satu acara besar yang bertujuan untuk mendapatkan sertifikasi korosi yang diselenggarakan secara offline di Surabaya. Selain itu, Student Corrosion Certification Program juga memberikan wawasan dan pelatihan skill bagi mahasiswa tingkat akhir dan fresh graduate sehingga dapat meningkatkan nilai tambah pada curriculum vitae yang sesuai dengan permintaan perusahaan. Sebagai seseorang yang akan mencari pekerjaan di perusahaan, penting untuk mengetahui situasi, kondisi, dan penanganan korosi dalam dunia kerja, sehingga dapat mempersiapkan diri dengan baik dalam menghadapi proses rekrutmen di masa depan. Diharapkan peserta Student Corrosion Certification Program dapat mengaplikasikan ilmu yang diperoleh dengan baik di perusahaan nantinya.",
  jadwal: [
    {
      hari: "Jum'at",
      tanggal: "9 Oktober 2026",
      jam: "08.00 – 16.00 WIB",
      kegiatan: "Pre-test, Pemberian Materi, dan Post-test",
    },
    {
      hari: "Sabtu",
      tanggal: "10 Oktober 2026",
      jam: "08.00 – 17.00 WIB",
      kegiatan: "Pre-test, Pemberian Materi, dan Post-test",
    },
    {
      hari: "Minggu",
      tanggal: "11 Oktober 2026",
      jam: "08.00 – 15.00 WIB",
      kegiatan: "Ujian tulis dan Interview",
    },
  ],
  fasilitas: [
    "e-Certificate",
    "e-Modul",
    "Snack",
    "Makan siang",
    "Coffee break",
  ],
  lokasi:
    "Institut Teknologi Sepuluh Nopember (detail lokasi diinfokan lebih lanjut)",
};

const opsiPembayaran = [
  {
    id: "lunas",
    label: "Lunas",
    harga: "Rp 3.000.000",
    desc: "Bayar sekali lunas",
  },
  {
    id: "bertahap",
    label: "Bertahap",
    harga: "Rp 2.000.000 (Termin 1)",
    desc: "Termin 1 sekarang, Termin 2 Rp 1.000.000 (30 Sep – 6 Okt 2026)",
  },
];

/* ── Helpers ──────────────────────────────────────────────────── */

const readFileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const full = e.target?.result as string;
      resolve(full.split(",")[1] ?? "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

type FileState = {
  name: string;
  mimeType: string;
  content: string;
};

const emptyFile = (): FileState => ({
  name: "",
  mimeType: "",
  content: "",
});

/* ── Main Component ──────────────────────────────────────────── */

export default function RegisterSCCP() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [status, setStatus] = useState<string>("");
  const [pembayaran, setPembayaran] = useState<string>("");

  const [buktiStatus, setBuktiStatus] = useState<FileState>(emptyFile());
  const [mou, setMou] = useState<FileState>(emptyFile());
  const [buktiBayar, setBuktiBayar] = useState<FileState>(emptyFile());
  const [isDescOpen, setIsDescOpen] = useState(false);

  const buktiStatusRef = useRef<HTMLInputElement>(null);
  const mouRef = useRef<HTMLInputElement>(null);
  const buktiBayarRef = useRef<HTMLInputElement>(null);

  const buildFileHandler =
    (
      setState: React.Dispatch<React.SetStateAction<FileState>>,
      ref: React.RefObject<HTMLInputElement | null>,
      acceptExts: string[],
      maxMb: number,
    ) =>
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
      if (!acceptExts.includes(ext)) {
        alert(`Format file tidak didukung. Gunakan: ${acceptExts.join(", ")}`);
        if (ref.current) ref.current.value = "";
        return;
      }
      if (file.size > maxMb * 1024 * 1024) {
        alert(`Ukuran file terlalu besar. Maksimal ${maxMb}MB.`);
        if (ref.current) ref.current.value = "";
        return;
      }

      try {
        const content = await readFileToBase64(file);
        setState({
          name: file.name,
          mimeType: ext,
          content,
        });
        setError(null);
      } catch {
        setError("Gagal membaca file. Coba upload ulang.");
      }
    };

  const handleBuktiStatus = buildFileHandler(
    setBuktiStatus,
    buktiStatusRef,
    [".pdf"],
    5,
  );
  const handleMou = buildFileHandler(setMou, mouRef, [".pdf"], 5);
  const handleBuktiBayar = buildFileHandler(
    setBuktiBayar,
    buktiBayarRef,
    [".png", ".jpg", ".jpeg"],
    5,
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!status) {
      setError("Pilih status (Mahasiswa tingkat akhir / Fresh graduate).");
      setIsLoading(false);
      return;
    }
    if (!buktiStatus.content) {
      setError("Upload bukti status terlebih dahulu.");
      setIsLoading(false);
      return;
    }
    if (!mou.content) {
      setError("Upload MoU terlebih dahulu.");
      setIsLoading(false);
      return;
    }
    if (!pembayaran) {
      setError("Pilih opsi pembayaran.");
      setIsLoading(false);
      return;
    }
    if (!buktiBayar.content) {
      setError("Upload bukti pembayaran terlebih dahulu.");
      setIsLoading(false);
      return;
    }

    const formData = new FormData(e.currentTarget);

    const payload = {
      type: "pendaftaran",
      timestamp: new Date().toISOString(),
      namaLengkap: formData.get("namaLengkap"),
      jenisKelamin: formData.get("jenisKelamin"),
      nomorWA: formData.get("nomorWA"),
      asalInstansi: formData.get("asalInstansi"),
      status,
      buktiStatusFileName: buktiStatus.name,
      buktiStatusMimeType: buktiStatus.mimeType,
      buktiStatusContent: buktiStatus.content,
      mouFileName: mou.name,
      mouMimeType: mou.mimeType,
      mouContent: mou.content,
      pembayaran,
      buktiBayarFileName: buktiBayar.name,
      buktiBayarMimeType: buktiBayar.mimeType,
      buktiBayarContent: buktiBayar.content,
    };

    try {
      const res = await fetch("/api/sccp/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      type ApiResp = { error?: string; message?: string };
      let data: ApiResp | null = null;
      try {
        data = (await res.json()) as ApiResp;
      } catch {
        // body kosong atau bukan JSON, biarkan null
      }

      if (!res.ok) {
        const errMsg =
          data && typeof data === "object" && "error" in data
            ? data.error
            : undefined;
        setError(
          errMsg || `Gagal mendaftar (HTTP ${res.status}). Silakan coba lagi.`,
        );
        return;
      }

      if (pembayaran === "bertahap") {
        const cache = {
          namaLengkap: formData.get("namaLengkap"),
          nomorWA: formData.get("nomorWA"),
          asalInstansi: formData.get("asalInstansi"),
          savedAt: new Date().toISOString(),
        };
        localStorage.setItem("sccp_pelunasan_data", JSON.stringify(cache));

        // Index map: agar di halaman pelunasan bisa dicari berdasarkan nama
        try {
          const rawIndex = localStorage.getItem("sccp_users_by_name");
          const index: Record<
            string,
            Omit<typeof cache, "namaLengkap">
          > = rawIndex ? JSON.parse(rawIndex) : {};
          const key = String(cache.namaLengkap || "")
            .trim()
            .toLowerCase();
          if (key) {
            index[key] = {
              nomorWA: cache.nomorWA,
              asalInstansi: cache.asalInstansi,
              savedAt: cache.savedAt,
            };
            localStorage.setItem("sccp_users_by_name", JSON.stringify(index));
          }
        } catch {
          // ignore: quota / parse issues
        }
      } else {
        localStorage.removeItem("sccp_pelunasan_data");
      }

      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : undefined;
      setError(
        msg || "Terjadi kesalahan saat mengirim data. Silakan coba lagi.",
      );
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
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Pendaftaran Berhasil!
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              Terima kasih telah mendaftar program sertifikasi SCCP 2026. Data
              dan berkas Anda telah kami terima. Tim kami akan segera
              menghubungi Anda melalui WhatsApp.
              {pembayaran === "bertahap" && (
                <>
                  <br />
                  <br />
                  <span className="font-semibold text-amber-700">
                    Informasi Pelunasan Termin 2 (Rp 1.000.000):
                  </span>
                  <br />
                  Silakan akses halaman pelunasan pada periode 30 September – 6
                  Oktober 2026. Data Anda telah tersimpan secara lokal.
                </>
              )}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {pembayaran === "bertahap" && (
                <button
                  onClick={() =>
                    (window.location.href = "/register-sccp/pelunasan")
                  }
                  className="bg-amber-600 hover:bg-amber-700 text-white font-medium px-6 py-3 rounded-full transition-colors"
                >
                  Buka Halaman Pelunasan
                </button>
              )}
              <button
                onClick={() => (window.location.href = "/")}
                className="bg-red hover:bg-red/90 text-white font-medium px-8 py-3 rounded-full transition-colors"
              >
                Kembali ke Beranda
              </button>
            </div>
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
              Formulir Pendaftaran SCCP 2026
            </h1>
            <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Student Corrosion Certification Program — kolaborasi INDOCOR ITS
              SC dengan INDOCOR. Lengkapi data diri di bawah ini.
            </p>
          </div>
        </FadeIn>

        <FadeIn direction="up" delay={0.05}>
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-12 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Calendar size={20} className="text-red" />
              Informasi Acara
            </h2>

            {/* ── Dropdown Deskripsi Kegiatan ──────────────── */}
            <div className="mb-8 border border-gray-100 rounded-xl overflow-hidden hover:border-red/30 transition-colors">
              <button
                type="button"
                onClick={() => setIsDescOpen((prev) => !prev)}
                aria-expanded={isDescOpen}
                className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 hover:bg-red/5 transition-colors text-left"
              >
                <span className="flex items-center gap-2 font-semibold text-gray-800">
                  <BookOpen size={17} className="text-red" />
                  Deskripsi Kegiatan
                </span>
                <ChevronDown
                  size={18}
                  className={`text-gray-500 transition-transform duration-300 ${
                    isDescOpen ? "rotate-180 text-red" : ""
                  }`}
                />
              </button>
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isDescOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-5 py-4 text-sm text-gray-700 leading-relaxed bg-white border-t border-gray-100">
                    {acara.deskripsi}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Gift size={16} className="text-red" />
                  Fasilitas
                </h3>
                <ul className="flex flex-col gap-2">
                  {acara.fasilitas.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm text-gray-700"
                    >
                      <CheckCircle2 size={15} className="text-green-500" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="font-semibold text-gray-800 mt-6 mb-4 flex items-center gap-2">
                  <Hourglass size={16} className="text-red" />
                  Deadline Penting
                </h3>
                <div className="flex flex-col gap-3">
                  <div className="border border-gray-100 rounded-lg p-4 hover:border-red/30 transition-colors bg-gray-50/40">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm text-gray-900 flex items-center gap-1.5">
                        <Calendar size={13} className="text-red-600" />
                        Open Registration
                      </span>
                      <span className="text-[11px] font-bold bg-red-600 text-white px-2.5 py-1 rounded-full tracking-wide uppercase">
                        Wajib!
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-red-700 mb-0.5">
                      16 September 2026 – 26 September 2026
                    </p>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Batas akhir pengisian formulir pendaftaran &amp; upload
                      semua berkas (Bukti Status, MoU, Bukti Bayar Termin 1).
                    </p>
                  </div>

                  <div className="border border-gray-100 rounded-lg p-4 hover:border-amber-400/60 transition-colors bg-yellow-50/40">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm text-gray-900 flex items-center gap-1.5">
                        <CalendarClock size={13} className="text-amber-600" />
                        Pelunasan Termin 2
                      </span>
                      <span className="text-[11px] font-bold bg-amber-500 text-white px-2.5 py-1 rounded-full tracking-wide uppercase">
                        Bertahap
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-amber-700 mb-0.5">
                      30 September 2026 – 6 Oktober 2026
                    </p>
                    <p className="text-xs text-gray-600 leading-relaxed mb-3">
                      Khusus peserta opsi pembayaran bertahap (Rp 1.000.000
                      Termin 2).
                    </p>
                    <Link
                      href="/register-sccp/pelunasan"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition-all hover:shadow-md hover:scale-[1.02]"
                    >
                      <span>Buka Form Pelunasan Termin 2</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>

                <h3 className="font-semibold text-gray-800 mt-6 mb-4 flex items-center gap-2">
                  <MapPin size={16} className="text-red" />
                  Lokasi
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {acara.lokasi}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-4">
                  Jadwal Kegiatan
                </h3>
                <div className="flex flex-col gap-3">
                  {acara.jadwal.map((j) => (
                    <div
                      key={j.hari}
                      className="border border-gray-100 rounded-lg p-4 hover:border-red/30 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm text-gray-900">
                          {j.hari}
                        </span>
                        <span className="text-xs text-red font-medium">
                          {j.tanggal}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-1">{j.jam}</p>
                      <p className="text-sm text-gray-700">{j.kegiatan}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </FadeIn>

        <FadeIn direction="up" delay={0.1}>
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            {/* Section 1: Data Diri */}
            <div className="p-8 md:p-12 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-red text-white text-xs flex items-center justify-center font-bold">
                  1
                </span>
                Data Diri Peserta
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="namaLengkap"
                    required
                    placeholder="Contoh: Alexa Zerlinda Mahendro"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-red focus:ring-1 focus:ring-red outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Jenis Kelamin
                  </label>
                  <select
                    name="jenisKelamin"
                    required
                    defaultValue=""
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-red focus:ring-1 focus:ring-red outline-none transition-colors bg-white appearance-none"
                  >
                    <option value="" disabled>
                      Pilih jenis kelamin
                    </option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nomor WhatsApp
                  </label>
                  <input
                    type="tel"
                    name="nomorWA"
                    required
                    placeholder="Contoh: 08xxx atau 62xxx"
                    pattern="(62|0)[0-9]+"
                    inputMode="numeric"
                    onInput={(e) => {
                      e.currentTarget.value = e.currentTarget.value.replace(
                        /[^0-9]/g,
                        "",
                      );
                    }}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-red focus:ring-1 focus:ring-red outline-none transition-colors"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Bisa ditulis mulai dari <strong>08…</strong> atau{" "}
                    <strong>62…</strong> (tanpa spasi, tanda plus, atau strip).
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Asal Instansi / Universitas
                  </label>
                  <input
                    type="text"
                    name="asalInstansi"
                    required
                    placeholder="Contoh: Institut Teknologi Sepuluh Nopember"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-red focus:ring-1 focus:ring-red outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Status & Bukti */}
            <div className="p-8 md:p-12 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-red text-white text-xs flex items-center justify-center font-bold">
                  2
                </span>
                Status & Bukti Pendukung
              </h2>

              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Status
                  </label>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      {
                        v: "Mahasiswa tingkat akhir",
                        desc: "Semester akhir / tingkat terakhir",
                      },
                      {
                        v: "Fresh graduate",
                        desc: "Lulus maksimal 1 tahun & belum bekerja",
                      },
                    ].map((o) => (
                      <label
                        key={o.v}
                        className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-sm ${
                          status === o.v
                            ? "border-red/60 bg-red/5"
                            : "border-gray-200 bg-white"
                        }`}
                      >
                        <input
                          type="radio"
                          name="statusRadio"
                          value={o.v}
                          checked={status === o.v}
                          onChange={(e) => setStatus(e.target.value)}
                          className="absolute top-4 right-4 w-5 h-5 accent-red cursor-pointer"
                        />
                        <span className="font-semibold text-gray-900 pr-8">
                          {o.v}
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          {o.desc}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Upload Bukti Status */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bukti Status
                  </label>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3 text-xs text-blue-800 leading-relaxed">
                    <strong>Persyaratan:</strong>
                    <ul className="list-disc list-inside mt-1 space-y-0.5">
                      <li>
                        Mahasiswa: upload <strong>KTM / KRSM</strong> (PDF)
                      </li>
                      <li>
                        Fresh graduate: upload{" "}
                        <strong>Surat pernyataan belum bekerja</strong> (format
                        bebas, boleh bertanda tangan digital)
                      </li>
                    </ul>
                  </div>
                  <FileUploadBox
                    innerRef={buktiStatusRef}
                    accept=".pdf"
                    fileName={buktiStatus.name}
                    onChange={handleBuktiStatus}
                    title="Upload Bukti Status"
                    hint="PDF, Maks 5MB"
                    required
                  />
                </div>

                {/* Upload MoU */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    MoU (Memorandum of Understanding)
                  </label>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3 text-xs text-blue-800 leading-relaxed">
                    <strong>Instruksi:</strong>
                    <ol className="list-decimal list-inside mt-1 space-y-0.5">
                      <li>
                        Buka template MoU berikut:
                        <br />
                        <a
                          href="https://its.id/m/MOUSCCP2026"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-700 underline font-semibold hover:text-blue-900 break-all inline-block mt-0.5"
                        >
                          Template MoU SCCP 2026
                        </a>
                      </li>
                      <li>
                        Pilih menu <em>File &rarr; Make a copy</em> lalu isi
                        data sesuai arahan.
                      </li>
                      <li>
                        Tanda tangan digital diperbolehkan, selanjutnya ekspor
                        sebagai <strong>PDF</strong> dan upload di bawah ini.
                      </li>
                    </ol>
                  </div>
                  <FileUploadBox
                    innerRef={mouRef}
                    accept=".pdf"
                    fileName={mou.name}
                    onChange={handleMou}
                    title="Upload MoU (PDF)"
                    hint="PDF, Maks 5MB"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Pembayaran */}
            <div className="p-8 md:p-12">
              <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-red text-white text-xs flex items-center justify-center font-bold">
                  3
                </span>
                Pembayaran
              </h2>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5 mb-6">
                <p className="text-sm text-yellow-800 leading-relaxed">
                  Silakan transfer sesuai dengan nominal opsi yang dipilih ke
                  rekening berikut:
                  <br />
                  <strong>BNI: 2006303006 a.n Alexa Zerlinda Mahendro</strong>
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {opsiPembayaran.map((o) => (
                  <label
                    key={o.id}
                    className={`relative flex flex-col p-5 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${
                      pembayaran === o.id
                        ? "border-red/60 bg-white"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="pembayaranRadio"
                      value={o.id}
                      checked={pembayaran === o.id}
                      onChange={(e) => setPembayaran(e.target.value)}
                      className="absolute top-5 right-5 w-5 h-5 accent-red cursor-pointer"
                    />
                    <div className="mb-1 pr-8">
                      <span className="font-semibold text-gray-900">
                        {o.label}
                      </span>
                    </div>
                    <p className="text-lg font-extrabold text-red mb-1">
                      {o.harga}
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {o.desc}
                    </p>
                  </label>
                ))}
              </div>

              <FileUploadBox
                innerRef={buktiBayarRef}
                accept="image/png,image/jpeg,image/jpg"
                fileName={buktiBayar.name}
                onChange={handleBuktiBayar}
                title="Upload Bukti Pembayaran"
                hint="PNG / JPG, Maks 5MB. Open Registration mulai dari 16-26 September 2026"
                required
              />

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

/* ── Sub Component: File Upload Box ───────────────────────────── */

type FileUploadBoxProps = {
  innerRef: React.RefObject<HTMLInputElement | null>;
  accept: string;
  fileName: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  title: string;
  hint: string;
  required?: boolean;
};

function FileUploadBox({
  innerRef,
  accept,
  fileName,
  onChange,
  title,
  hint,
  required,
}: FileUploadBoxProps) {
  return (
    <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 md:p-8 text-center hover:bg-gray-50 hover:border-red transition-all group">
      <input
        ref={innerRef}
        type="file"
        accept={accept}
        required={required}
        onChange={onChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-red/10 flex items-center justify-center group-hover:scale-110 transition-transform">
          <UploadCloud className="text-red" size={24} />
        </div>
        <div>
          {fileName ? (
            <>
              <p className="font-semibold text-gray-900 break-all">
                {fileName}
              </p>
              <p className="text-xs text-green-600 mt-1 font-medium">
                Berkas siap diupload
              </p>
            </>
          ) : (
            <>
              <p className="font-semibold text-gray-900">{title}</p>
              <p className="text-sm text-gray-500 mt-1">
                Klik atau drag &amp; drop file di sini ({hint})
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
