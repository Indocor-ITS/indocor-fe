"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import {
  UploadCloud,
  CheckCircle2,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Search,
  XCircle,
  Info,
  ExternalLink,
  ScrollText,
} from "lucide-react";

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

type PelunasanCache = {
  namaLengkap?: FormDataEntryValue | null;
  nomorWA?: FormDataEntryValue | null;
  asalInstansi?: FormDataEntryValue | null;
  savedAt?: string;
} | null;

type UserIndexEntry = {
  nomorWA?: FormDataEntryValue | null;
  asalInstansi?: FormDataEntryValue | null;
  savedAt?: string;
};

/* ── Main Component ──────────────────────────────────────────── */

type ValidationMessage = {
  type: "error" | "warn" | "info" | "success";
  title: string;
  text: string;
  errorCode?: string;
  linkHref?: string;
  linkLabel?: string;
} | null;

export default function RegisterSCCPPelunasan() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationMsg, setValidationMsg] = useState<ValidationMessage>(null);
  const [namaLengkap, setNamaLengkap] = useState<string>("");
  const [nomorWA, setNomorWA] = useState<string>("");
  const [asalInstansi, setAsalInstansi] = useState<string>("");
  const [isCached, setIsCached] = useState<boolean>(false);
  const [lookupSource, setLookupSource] = useState<string>("");
  const [namaStatus, setNamaStatus] = useState<
    "idle" | "matched" | "unmatched"
  >("idle");

  const [buktiPelunasan, setBuktiPelunasan] = useState<FileState>({
    name: "",
    mimeType: "",
    content: "",
  });
  const buktiPelunasanRef = useRef<HTMLInputElement>(null);

  const loadByNama = (nama: string): UserIndexEntry | null => {
    const key = nama.trim().toLowerCase();
    if (!key) return null;
    try {
      const raw = localStorage.getItem("sccp_users_by_name");
      if (!raw) return null;
      const index: Record<string, UserIndexEntry> = JSON.parse(raw);
      return index[key] ?? null;
    } catch {
      return null;
    }
  };

  // On page load: isi dari dedicated cache sccp_pelunasan_data (setelah submit pendaftaran)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("sccp_pelunasan_data");
      if (raw) {
        const data: PelunasanCache = JSON.parse(raw);
        if (data?.namaLengkap) setNamaLengkap(String(data.namaLengkap));
        if (data?.nomorWA) setNomorWA(String(data.nomorWA));
        if (data?.asalInstansi) setAsalInstansi(String(data.asalInstansi));
        setIsCached(true);
        setLookupSource("cached");
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Saat user mengetik nama: cari di indexed map sccp_users_by_name
  const handleNamaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNamaLengkap(val);
    setValidationMsg(null);

    if (!val.trim()) {
      setNamaStatus("idle");
      setIsCached(false);
      setLookupSource("");
      return;
    }

    const match = loadByNama(val);
    if (match) {
      if (match.nomorWA) setNomorWA(String(match.nomorWA));
      if (match.asalInstansi) setAsalInstansi(String(match.asalInstansi));
      setLookupSource("lookup");
      setIsCached(true);
      setNamaStatus("matched");
    } else {
      setNamaStatus("unmatched");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (![".png", ".jpg", ".jpeg"].includes(ext)) {
      alert("Format file tidak didukung. Gunakan: .png / .jpg / .jpeg");
      if (buktiPelunasanRef.current) buktiPelunasanRef.current.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file terlalu besar. Maksimal 5MB.");
      if (buktiPelunasanRef.current) buktiPelunasanRef.current.value = "";
      return;
    }

    try {
      const content = await readFileToBase64(file);
      setBuktiPelunasan({
        name: file.name,
        mimeType: ext,
        content,
      });
      setError(null);
    } catch {
      setError("Gagal membaca file. Coba upload ulang.");
    }
  };

  const scrollToTopForm = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 200, behavior: "smooth" });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setValidationMsg(null);

    const formData = new FormData(e.currentTarget);
    const nama = String(formData.get("namaLengkap") || "").trim();

    if (!nama) {
      setError("Masukkan nama lengkap Anda.");
      setIsLoading(false);
      scrollToTopForm();
      return;
    }
    if (!buktiPelunasan.content) {
      setError("Upload bukti pembayaran pelunasan terlebih dahulu.");
      setIsLoading(false);
      scrollToTopForm();
      return;
    }

    const payload = {
      type: "pelunasan",
      timestamp: new Date().toISOString(),
      namaLengkap: nama,
      nomorWA: String(formData.get("nomorWA") || ""),
      asalInstansi: String(formData.get("asalInstansi") || ""),
      buktiPelunasanFileName: buktiPelunasan.name,
      buktiPelunasanMimeType: buktiPelunasan.mimeType,
      buktiPelunasanContent: buktiPelunasan.content,
    };

    try {
      const res = await fetch("/api/sccp/pelunasan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      type ApiResp = {
        error?: string;
        error_code?: string;
        message?: string;
        current_status_t2?: string;
      };
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
        const errCode =
          data && typeof data === "object" && "error_code" in data
            ? data.error_code
            : undefined;

        if (errCode === "NAMA_TIDAK_TERDAFTAR") {
          setValidationMsg({
            type: "error",
            title: "Anda Belum Mendaftar SCCP 2026!",
            text:
              errMsg ||
              "Nama tidak ditemukan di database pendaftaran. Silakan isi form pendaftaran terlebih dahulu sebelum melakukan pelunasan Termin 2.",
            errorCode: errCode,
            linkHref: "/register-sccp",
            linkLabel: "👉 Klik Di Sini Untuk Daftar Dulu",
          });
        } else if (errCode === "OPSI_LUNAS") {
          setValidationMsg({
            type: "warn",
            title: "Anda Tidak Perlu Bayar Termin 2",
            text: errMsg || "Karena Anda memilih opsi LUNAS saat pendaftaran.",
            errorCode: errCode,
          });
        } else if (errCode === "SUDAH_UPLOAD_T2") {
          setValidationMsg({
            type: "info",
            title: "Bukti Pelunasan Sudah Diterima",
            text:
              errMsg ||
              "Tidak perlu upload berulang, silakan tunggu verifikasi.",
            errorCode: errCode,
          });
        } else {
          setError(
            errMsg ||
              `Gagal mengirim pelunasan (HTTP ${res.status}). Silakan coba lagi.`,
          );
        }

        setIsLoading(false);
        scrollToTopForm();
        return;
      }

      localStorage.removeItem("sccp_pelunasan_data");
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : undefined;
      setError(
        msg || "Terjadi kesalahan saat mengirim data. Silakan coba lagi.",
      );
      scrollToTopForm();
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
              Pelunasan Berhasil Dikirim!
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              Terima kasih, bukti pembayaran Termin 2 Anda telah kami terima.
              Tim kami akan segera mengonfirmasi melalui WhatsApp. Sampai
              bertemu di acara SCCP 2026!
            </p>
            <button
              onClick={() => (window.location.href = "/")}
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
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <FadeIn direction="up">
          <div className="mb-10">
            <button
              onClick={() => (window.location.href = "/register-sccp")}
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-red transition-colors mb-6"
            >
              <ArrowLeft size={16} />
              <span>Kembali ke Form Pendaftaran</span>
            </button>

            <div className="text-center">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-amber-600 mb-3 block">
                Periode 30 September – 6 Oktober 2026
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
                Formulir Pelunasan SCCP 2026
              </h1>
              <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
                Termin 2: Rp 1.000.000. Khusus peserta yang memilih opsi
                pembayaran bertahap.
              </p>
            </div>
          </div>
        </FadeIn>

        <FadeIn direction="up" delay={0.1}>
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            {validationMsg && (
              <div
                className={`${
                  validationMsg.type === "error"
                    ? "bg-red-50 border-red-200"
                    : validationMsg.type === "warn"
                      ? "bg-yellow-50 border-yellow-200"
                      : validationMsg.type === "success"
                        ? "bg-green-50 border-green-200"
                        : "bg-blue-50 border-blue-200"
                } border-t-[6px] ${
                  validationMsg.type === "error"
                    ? "border-t-red-600"
                    : validationMsg.type === "warn"
                      ? "border-t-yellow-500"
                      : validationMsg.type === "success"
                        ? "border-t-green-600"
                        : "border-t-blue-600"
                }`}
              >
                <div className="px-8 md:px-12 py-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center ${
                        validationMsg.type === "error"
                          ? "bg-red-100 text-red-700"
                          : validationMsg.type === "warn"
                            ? "bg-yellow-100 text-yellow-700"
                            : validationMsg.type === "success"
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {validationMsg.type === "error" ? (
                        <XCircle size={22} />
                      ) : validationMsg.type === "warn" ? (
                        <AlertCircle size={22} />
                      ) : validationMsg.type === "success" ? (
                        <CheckCircle2 size={22} />
                      ) : (
                        <Info size={22} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`text-base md:text-lg font-extrabold mb-2 ${
                          validationMsg.type === "error"
                            ? "text-red-900"
                            : validationMsg.type === "warn"
                              ? "text-yellow-900"
                              : validationMsg.type === "success"
                                ? "text-green-900"
                                : "text-blue-900"
                        }`}
                      >
                        {validationMsg.title}
                      </h3>
                      <p
                        className={`text-sm leading-relaxed mb-3 ${
                          validationMsg.type === "error"
                            ? "text-red-800"
                            : validationMsg.type === "warn"
                              ? "text-yellow-800"
                              : validationMsg.type === "success"
                                ? "text-green-800"
                                : "text-blue-800"
                        }`}
                      >
                        {validationMsg.text}
                      </p>
                      {validationMsg.linkHref && validationMsg.linkLabel && (
                        <div className="mt-1">
                          <Link
                            href={validationMsg.linkHref}
                            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm shadow-sm transition-all hover:shadow-md hover:scale-[1.02] ${
                              validationMsg.type === "error"
                                ? "bg-red-600 text-white hover:bg-red-700"
                                : validationMsg.type === "warn"
                                  ? "bg-yellow-500 text-white hover:bg-yellow-600"
                                  : validationMsg.type === "success"
                                    ? "bg-green-600 text-white hover:bg-green-700"
                                    : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                          >
                            <ScrollText size={16} />
                            <span>{validationMsg.linkLabel}</span>
                            <ExternalLink size={15} />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="p-8 md:p-12 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center font-bold">
                  1
                </span>
                Data Diri
              </h2>

              {isCached && (
                <div
                  className={`${
                    lookupSource === "lookup"
                      ? "bg-blue-50 border-blue-200 text-blue-800"
                      : "bg-green-50 border-green-200 text-green-800"
                  } border rounded-lg p-4 mb-6 text-xs leading-relaxed flex items-start gap-2`}
                >
                  {lookupSource === "lookup" ? (
                    <Search size={16} className="flex-shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" />
                  )}
                  <span>
                    {lookupSource === "lookup"
                      ? "Data ditemukan berdasarkan nama yang Anda ketik. No WA dan asal instansi otomatis terisi."
                      : "Data Anda diambil dari pendaftaran sebelumnya. Silakan periksa dan lanjutkan upload bukti pembayaran."}
                  </span>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="namaLengkap"
                    required
                    value={namaLengkap}
                    onChange={handleNamaChange}
                    placeholder="Ketik nama sesuai pendaftaran untuk auto-fill data"
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-1 outline-none transition-all ${
                      namaStatus === "matched"
                        ? "border-green-400 bg-green-50/50 focus:border-green-600 focus:ring-green-600"
                        : namaStatus === "unmatched"
                          ? "border-amber-400 bg-amber-50/40 focus:border-amber-600 focus:ring-amber-600"
                          : "border-gray-200 focus:border-red focus:ring-red"
                    }`}
                  />
                  {namaStatus === "matched" && (
                    <p className="text-xs text-green-700 mt-2 flex items-center gap-1.5 font-medium">
                      <CheckCircle2 size={13} />✅ Nama ditemukan di data
                      pendaftaran Anda (cache browser). No WA &amp; instansi
                      otomatis terisi.
                    </p>
                  )}
                  {namaStatus === "unmatched" && (
                    <p
                      className="text-xs mt-2 flex items-start gap-1.5"
                      style={{ color: "#b45309" }}
                    >
                      <AlertCircle size={13} className="mt-0.5 flex-shrink-0" />
                      <span>
                        ⚠️ Nama{" "}
                        <strong>tidak ditemukan di cache browser</strong>. Jika
                        Anda yakin sudah mendaftar (beda device / bersihkan
                        cache) tetap submit saja, sistem akan{" "}
                        <em>cek otomatis ke database</em>. Jika belum daftar
                        nanti akan muncul tombol &quot;Daftar Dulu&quot;.
                      </span>
                    </p>
                  )}
                  {namaStatus === "idle" && (
                    <p className="text-xs text-gray-500 mt-2">
                      💡 Tip: Ketik nama lengkap persis seperti saat mendaftar,
                      maka No WA &amp; asal instansi akan terisi otomatis.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nomor WhatsApp
                  </label>
                  <input
                    type="tel"
                    name="nomorWA"
                    value={nomorWA}
                    onChange={(e) => setNomorWA(e.target.value)}
                    placeholder="Opsional"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    onInput={(e) => {
                      e.currentTarget.value = e.currentTarget.value.replace(
                        /[^0-9]/g,
                        "",
                      );
                    }}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-red focus:ring-1 focus:ring-red outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Asal Instansi / Universitas
                  </label>
                  <input
                    type="text"
                    name="asalInstansi"
                    value={asalInstansi}
                    onChange={(e) => setAsalInstansi(e.target.value)}
                    placeholder="Opsional"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-red focus:ring-1 focus:ring-red outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="p-8 md:p-12">
              <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center font-bold">
                  2
                </span>
                Bukti Pembayaran Pelunasan
              </h2>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5 mb-6">
                <p className="text-sm text-yellow-800 leading-relaxed">
                  Silakan transfer untuk Termin 2:
                  <br />
                  <strong>Nominal: Rp 1.000.000</strong>
                  <br />
                  Ke rekening:
                  <br />
                  <strong>BNI: 2006303006 a.n Alexa Zerlinda Mahendro</strong>
                </p>
              </div>

              <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 hover:border-red transition-all group">
                <input
                  ref={buktiPelunasanRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  required
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-red/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <UploadCloud className="text-red" size={24} />
                  </div>
                  <div>
                    {buktiPelunasan.name ? (
                      <>
                        <p className="font-semibold text-gray-900 break-all">
                          {buktiPelunasan.name}
                        </p>
                        <p className="text-xs text-green-600 mt-1 font-medium">
                          Berkas siap diupload
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-semibold text-gray-900">
                          Upload Bukti Pelunasan
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Klik atau drag &amp; drop file di sini (PNG / JPG,
                          Maks 5MB)
                        </p>
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
                className="w-full md:w-auto bg-amber-600 hover:bg-amber-700 disabled:opacity-70 disabled:cursor-not-allowed text-white px-10 py-4 rounded-full font-bold text-base transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Memproses Data...</span>
                  </>
                ) : (
                  "Kirim Bukti Pelunasan"
                )}
              </button>
            </div>
          </form>
        </FadeIn>
      </div>
    </main>
  );
}
