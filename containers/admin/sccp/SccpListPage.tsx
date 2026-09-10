"use client";

import { useEffect, useState } from "react";
import {
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { toWhatsAppLink } from "@/lib/utils";

type Registration = {
  id: string;
  nama_lengkap: string;
  nomor_wa: string;
  asal_instansi: string;
  status_peserta: string;
  opsi_pembayaran: "lunas" | "bertahap";
  verif_t1: "belum" | "diverifikasi" | "ditolak";
  verif_t2?: "belum" | "diverifikasi" | "ditolak";
};

type StatusBadge = {
  label: string;
  className: string;
};

function getLunasStatus(r: Registration): StatusBadge {
  const opsi = r.opsi_pembayaran;
  const t1 = r.verif_t1;
  const t2 = r.verif_t2;

  if (opsi === "lunas" && t1 === "diverifikasi") {
    return { label: "Lunas ✅", className: "bg-green-100 text-green-700" };
  }
  if (opsi === "bertahap" && t1 === "diverifikasi" && t2 === "diverifikasi") {
    return { label: "Lunas ✅", className: "bg-green-100 text-green-700" };
  }
  if (t1 === "ditolak" || t2 === "ditolak") {
    return { label: "Ditolak ❌", className: "bg-rose-100 text-rose-700" };
  }
  return { label: "Belum Lunas ⏳", className: "bg-amber-100 text-amber-700" };
}

export default function SccpListPage({ basePath }: { basePath: string }) {
  const isSuper = basePath.includes("superadmin");
  const primaryColor = isSuper ? "bg-indigo-600" : "bg-red";
  const primaryHover = isSuper ? "hover:bg-indigo-700" : "hover:bg-red/90";
  const primaryLight = isSuper ? "bg-indigo-50" : "bg-red-50";
  const primaryText = isSuper ? "text-indigo-600" : "text-red";

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOpsi, setFilterOpsi] = useState<string>("semua");
  const [filterVerif, setFilterVerif] = useState<string>("semua");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (filterOpsi !== "semua") params.set("opsi_pembayaran", filterOpsi);
        if (filterVerif !== "semua") params.set("status_verif", filterVerif);
        const qs = params.toString() ? `?${params.toString()}` : "";
        const res = await fetch(`/api/sccp/registrations${qs}`);
        const data = await res.json();
        setRegistrations(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching SCCP registrations:", error);
        setRegistrations([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [filterOpsi, filterVerif]);

  const totalPendaftar = registrations.length;
  const totalLunas = registrations.filter((r) => {
    const opsi = r.opsi_pembayaran;
    const t1 = r.verif_t1;
    const t2 = r.verif_t2;
    if (opsi === "lunas" && t1 === "diverifikasi") return true;
    if (opsi === "bertahap" && t1 === "diverifikasi" && t2 === "diverifikasi")
      return true;
    return false;
  }).length;
  const totalPending = registrations.filter((r) => {
    const t1 = r.verif_t1;
    const t2 = r.verif_t2;
    if (t1 === "belum") return true;
    if (r.opsi_pembayaran === "bertahap" && t2 === "belum") return true;
    return false;
  }).length;
  const totalBelumLunas = totalPendaftar - totalLunas;

  const statCards = [
    {
      title: "Total Pendaftar",
      value: totalPendaftar,
      icon: Users,
      color: primaryColor,
      lightColor: primaryLight,
      textColor: primaryText,
    },
    {
      title: "Lunas ✅",
      value: totalLunas,
      icon: CheckCircle2,
      color: "bg-green-500",
      lightColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Pending Verifikasi ⏳",
      value: totalPending,
      icon: Clock,
      color: "bg-amber-500",
      lightColor: "bg-amber-50",
      textColor: "text-amber-600",
    },
    {
      title: "Belum Lunas 🔴",
      value: totalBelumLunas,
      icon: XCircle,
      color: "bg-rose-500",
      lightColor: "bg-rose-50",
      textColor: "text-rose-600",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
          SCCP Registrations
        </h1>
        <p className="text-gray-500 mt-1">
          Kelola data pendaftar dan verifikasi pembayaran SCCP 2026
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 ${card.lightColor} rounded-xl flex items-center justify-center`}
              >
                <card.icon size={22} className={card.textColor} />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                {card.title}
              </p>
              {loading ? (
                <div className="h-8 w-16 bg-gray-100 rounded animate-pulse" />
              ) : (
                <p className="text-3xl font-extrabold text-gray-900">
                  {card.value}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex flex-wrap gap-3 items-center mb-6">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              Opsi Pembayaran:
            </label>
            <select
              value={filterOpsi}
              onChange={(e) => setFilterOpsi(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red/20 focus:border-red"
            >
              <option value="semua">Semua</option>
              <option value="lunas">Lunas</option>
              <option value="bertahap">Bertahap</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              Status Verifikasi:
            </label>
            <select
              value={filterVerif}
              onChange={(e) => setFilterVerif(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red/20 focus:border-red"
            >
              <option value="semua">Semua</option>
              <option value="belum">Belum Verif</option>
              <option value="diverifikasi">Diverifikasi</option>
              <option value="ditolak">Ditolak</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-4 py-3 font-bold text-gray-700">
                  Nama Lengkap
                </th>
                <th className="text-left px-4 py-3 font-bold text-gray-700">
                  WA
                </th>
                <th className="text-left px-4 py-3 font-bold text-gray-700">
                  Instansi
                </th>
                <th className="text-left px-4 py-3 font-bold text-gray-700">
                  Status Peserta
                </th>
                <th className="text-left px-4 py-3 font-bold text-gray-700">
                  Opsi Bayar
                </th>
                <th className="text-left px-4 py-3 font-bold text-gray-700">
                  Status Lunas
                </th>
                <th className="text-left px-4 py-3 font-bold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    {Array.from({ length: 7 }).map((__, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : registrations.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center px-4 py-12 text-gray-500"
                  >
                    Tidak ada data pendaftar.
                  </td>
                </tr>
              ) : (
                registrations.map((r) => {
                  const badge = getLunasStatus(r);
                  return (
                    <tr
                      key={r.id}
                      className="border-b border-gray-50 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {r.nama_lengkap}
                      </td>
                      <td className="px-4 py-3">
                        {(() => {
                          const link = toWhatsAppLink(r.nomor_wa);
                          if (!link)
                            return (
                              <span className="text-gray-500">
                                {r.nomor_wa}
                              </span>
                            );
                          return (
                            <a
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Buka chat WhatsApp"
                              className="inline-flex items-center gap-1.5 text-green-600 hover:text-green-700 font-medium hover:underline"
                            >
                              <MessageCircle size={14} />
                              <span>{r.nomor_wa}</span>
                            </a>
                          );
                        })()}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {r.asal_instansi}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {r.status_peserta}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            r.opsi_pembayaran === "lunas"
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {r.opsi_pembayaran === "lunas" ? "Lunas" : "Bertahap"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`${basePath}/${r.id}`}
                          className={`inline-flex ${primaryColor} ${primaryHover} text-white rounded-lg px-3 py-1.5 text-xs font-medium transition-colors`}
                        >
                          Lihat Detail
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
