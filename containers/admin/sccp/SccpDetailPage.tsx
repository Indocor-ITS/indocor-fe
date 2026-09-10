"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  MessageCircle,
} from "lucide-react";
import { toWhatsAppLink } from "@/lib/utils";

type VerifStatus = "belum" | "diverifikasi" | "ditolak";

type RegistrationDetail = {
  id: string;
  nama_lengkap: string;
  jenis_kelamin: string;
  nomor_wa: string;
  asal_instansi: string;
  status_peserta: string;
  opsi_pembayaran: "lunas" | "bertahap";
  verif_t1: VerifStatus;
  verif_t2?: VerifStatus;
  bukti_status_url?: string;
  mou_url?: string;
  bukti_t1_url?: string;
  bukti_t2_url?: string;
  catatan_admin?: string;
};

function verifBadge(status: VerifStatus | undefined) {
  if (status === "diverifikasi")
    return {
      label: "Diverifikasi ✅",
      className: "bg-green-100 text-green-700",
    };
  if (status === "ditolak")
    return { label: "Ditolak ❌", className: "bg-rose-100 text-rose-700" };
  return { label: "Belum Verif ⏳", className: "bg-amber-100 text-amber-700" };
}

export default function SccpDetailPage({
  basePath,
  registrationId,
}: {
  basePath: string;
  registrationId: string;
}) {
  const isSuper = basePath.includes("superadmin");
  const primaryText = isSuper ? "text-indigo-600" : "text-red";
  const primaryBg = isSuper ? "bg-indigo-600" : "bg-red";

  const [data, setData] = useState<RegistrationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [patching, setPatching] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/sccp/registrations/${registrationId}`);
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching detail:", error);
    } finally {
      setLoading(false);
    }
  }, [registrationId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  async function handleVerif(
    field: "verif_t1" | "verif_t2",
    value: VerifStatus,
  ) {
    try {
      setPatching(field);
      await fetch(`/api/sccp/registrations/${registrationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      await fetchDetail();
    } catch (error) {
      console.error("Error patching verification:", error);
    } finally {
      setPatching(null);
    }
  }

  const badge = (s: VerifStatus | undefined) => {
    const b = verifBadge(s);
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${b.className}`}
      >
        {b.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-gray-100 rounded animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 h-96 animate-pulse" />
          <div className="bg-white rounded-2xl p-6 border border-gray-100 h-96 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center text-gray-500">
        Data tidak ditemukan.
      </div>
    );
  }

  const opsiBertahap = data.opsi_pembayaran === "bertahap";

  return (
    <div>
      <div className="mb-8">
        <Link
          href={basePath}
          className={`inline-flex items-center gap-2 text-sm font-medium ${primaryText} hover:opacity-80 mb-4`}
        >
          <ArrowLeft size={16} />
          Kembali
        </Link>
        <h1
          className={`text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight border-l-4 ${primaryBg} pl-4`}
        >
          Detail Pendaftaran SCCP
        </h1>
        <p className="text-gray-500 mt-1">{data.nama_lengkap}</p>
      </div>

      {data.catatan_admin && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <FileText
              className="text-amber-600 flex-shrink-0 mt-0.5"
              size={20}
            />
            <div>
              <p className="font-bold text-amber-800 text-sm">Catatan Admin</p>
              <p className="text-amber-700 text-sm mt-1">
                {data.catatan_admin}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Data Diri</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-500 font-medium">Nama Lengkap</span>
                <p className="text-gray-900 font-semibold mt-0.5">
                  {data.nama_lengkap}
                </p>
              </div>
              <div>
                <span className="text-gray-500 font-medium">Jenis Kelamin</span>
                <p className="text-gray-900 font-semibold mt-0.5">
                  {data.jenis_kelamin}
                </p>
              </div>
              <div>
                <span className="text-gray-500 font-medium">Nomor WA</span>
                <p className="mt-0.5">
                  {(() => {
                    const waMsg = `Halo ${data.nama_lengkap}! Terkait pendaftaran SCCP 2026 INDOCOR ITS Student Chapter.`;
                    const link = toWhatsAppLink(data.nomor_wa, waMsg);
                    if (!link) {
                      return (
                        <span className="text-gray-700 font-semibold">
                          {data.nomor_wa}
                        </span>
                      );
                    }
                    return (
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Klik untuk chat WhatsApp"
                        className="inline-flex items-center gap-1.5 text-green-600 hover:text-green-700 font-semibold hover:underline"
                      >
                        <MessageCircle size={15} />
                        <span>{data.nomor_wa}</span>
                      </a>
                    );
                  })()}
                </p>
              </div>
              <div>
                <span className="text-gray-500 font-medium">Asal Instansi</span>
                <p className="text-gray-900 font-semibold mt-0.5">
                  {data.asal_instansi}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Status Peserta
            </h2>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
              {data.status_peserta}
            </span>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Pembayaran</h2>
            <div className="space-y-5 text-sm">
              <div>
                <span className="text-gray-500 font-medium">
                  Opsi Pembayaran
                </span>
                <div className="mt-1">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      data.opsi_pembayaran === "lunas"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {data.opsi_pembayaran === "lunas" ? "Lunas" : "Bertahap"}
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700 font-semibold">
                    Verifikasi Termin 1
                  </span>
                  {badge(data.verif_t1)}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleVerif("verif_t1", "diverifikasi")}
                    disabled={
                      data.verif_t1 === "diverifikasi" ||
                      patching === "verif_t1"
                    }
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-600 disabled:bg-green-200 disabled:cursor-not-allowed text-white rounded-lg px-3 py-2 text-xs font-medium transition-colors"
                  >
                    <CheckCircle2 size={14} />
                    Setujui
                  </button>
                  <button
                    onClick={() => handleVerif("verif_t1", "ditolak")}
                    disabled={
                      data.verif_t1 === "ditolak" || patching === "verif_t1"
                    }
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-200 disabled:cursor-not-allowed text-white rounded-lg px-3 py-2 text-xs font-medium transition-colors"
                  >
                    <XCircle size={14} />
                    Tolak
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700 font-semibold">
                    Verifikasi Termin 2
                  </span>
                  {opsiBertahap ? (
                    badge(data.verif_t2)
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      Tidak Perlu
                    </span>
                  )}
                </div>
                {opsiBertahap ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleVerif("verif_t2", "diverifikasi")}
                      disabled={
                        data.verif_t2 === "diverifikasi" ||
                        patching === "verif_t2"
                      }
                      className="flex-1 inline-flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-600 disabled:bg-green-200 disabled:cursor-not-allowed text-white rounded-lg px-3 py-2 text-xs font-medium transition-colors"
                    >
                      <CheckCircle2 size={14} />
                      Setujui
                    </button>
                    <button
                      onClick={() => handleVerif("verif_t2", "ditolak")}
                      disabled={
                        data.verif_t2 === "ditolak" || patching === "verif_t2"
                      }
                      className="flex-1 inline-flex items-center justify-center gap-1.5 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-200 disabled:cursor-not-allowed text-white rounded-lg px-3 py-2 text-xs font-medium transition-colors"
                    >
                      <XCircle size={14} />
                      Tolak
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 italic">
                    Opsi pembayaran Lunas, hanya perlu Termin 1.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Berkas Pendaftaran
          </h2>
          <div className="space-y-3">
            {data.bukti_status_url && (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 ${primaryBg} rounded-lg flex items-center justify-center flex-shrink-0`}
                  >
                    <FileText size={18} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      Bukti Status (PDF)
                    </p>
                    <a
                      href={data.bukti_status_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-xs font-medium ${
                        isSuper
                          ? "text-indigo-600 hover:text-indigo-700"
                          : "text-red hover:text-red/90"
                      } underline`}
                    >
                      Lihat PDF 🔗
                    </a>
                  </div>
                </div>
              </div>
            )}

            {data.mou_url && (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 ${primaryBg} rounded-lg flex items-center justify-center flex-shrink-0`}
                  >
                    <FileText size={18} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      MoU (PDF)
                    </p>
                    <a
                      href={data.mou_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-xs font-medium ${
                        isSuper
                          ? "text-indigo-600 hover:text-indigo-700"
                          : "text-red hover:text-red/90"
                      } underline`}
                    >
                      Lihat PDF 🔗
                    </a>
                  </div>
                </div>
              </div>
            )}

            {data.bukti_t1_url && (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 ${primaryBg} rounded-lg flex items-center justify-center flex-shrink-0`}
                  >
                    <FileText size={18} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      Bukti Bayar Termin 1 (Gambar)
                    </p>
                    <a
                      href={data.bukti_t1_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-xs font-medium ${
                        isSuper
                          ? "text-indigo-600 hover:text-indigo-700"
                          : "text-red hover:text-red/90"
                      } underline`}
                    >
                      Lihat Gambar 🔗
                    </a>
                  </div>
                </div>
              </div>
            )}

            {opsiBertahap && data.bukti_t2_url && (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 ${primaryBg} rounded-lg flex items-center justify-center flex-shrink-0`}
                  >
                    <FileText size={18} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      Bukti Bayar Termin 2 (Gambar)
                    </p>
                    <a
                      href={data.bukti_t2_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-xs font-medium ${
                        isSuper
                          ? "text-indigo-600 hover:text-indigo-700"
                          : "text-red hover:text-red/90"
                      } underline`}
                    >
                      Lihat Gambar 🔗
                    </a>
                  </div>
                </div>
              </div>
            )}

            {!data.bukti_status_url &&
              !data.mou_url &&
              !data.bukti_t1_url &&
              !data.bukti_t2_url && (
                <div className="text-center py-8 text-gray-500 text-sm">
                  <Clock size={24} className="mx-auto mb-2 text-gray-400" />
                  Belum ada berkas yang diunggah.
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
