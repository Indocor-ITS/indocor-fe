"use client";

import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import {
  CalendarDays,
  User,
  ArrowLeft,
  Download,
  FileText,
  ExternalLink,
} from "lucide-react";

interface Article {
  id: string;
  slug: string;
  title: string;
  date: string;
  author: string;
  pdf_file: string;
  image_cover?: string;
}

interface BlogDetailProps {
  blog: Article;
}

export default function ArtikelDetail({ blog }: BlogDetailProps) {
  return (
    <article className="min-h-screen bg-gray-50/50 pb-24 pt-10">
      <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-20">
        <FadeIn direction="up">
          {/* Back */}
          <Link
            href="/artikel"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium mb-8 group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Kembali ke Daftar Artikel
          </Link>

          {/* Header Card */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-8">
            {/* Image header */}
            {blog.image_cover ? (
              <div className="relative w-full h-64 md:h-80 overflow-hidden">
                <Image
                  src={blog.image_cover}
                  alt={blog.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 800px"
                />
              </div>
            ) : (
              <div className="bg-gradient-to-br from-red/5 via-red/10 to-red/5 p-12 flex items-center justify-center">
                <div className="w-24 h-24 rounded-3xl bg-white shadow-md flex items-center justify-center">
                  <FileText size={48} className="text-red" />
                </div>
              </div>
            )}

            {/* Info */}
            <div className="p-8 md:p-12">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight mb-6">
                {blog.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-8 pb-8 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <CalendarDays size={16} className="text-red" />
                  <span className="font-medium">{blog.date}</span>
                </div>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <div className="flex items-center gap-2">
                  <User size={16} className="text-red" />
                  <span className="font-medium">{blog.author}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={blog.pdf_file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-3 bg-red hover:bg-red/90 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-lg shadow-red/20 text-sm"
                >
                  <ExternalLink size={18} />
                  Buka PDF di Tab Baru
                </a>
                <a
                  href={blog.pdf_file}
                  download
                  className="flex-1 inline-flex items-center justify-center gap-3 bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-2xl transition-all text-sm"
                >
                  <Download size={18} />
                  Download PDF
                </a>
              </div>
            </div>
          </div>

          {/* PDF Embed viewer */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                Preview Dokumen
              </h2>
              <a
                href={blog.pdf_file}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-red hover:text-red/80 transition-colors"
              >
                <ExternalLink size={14} />
                Buka Penuh
              </a>
            </div>
            <div className="w-full" style={{ height: "80vh" }}>
              <iframe
                src={blog.pdf_file}
                className="w-full h-full border-0"
                title={blog.title}
              />
            </div>
          </div>
        </FadeIn>
      </div>
    </article>
  );
}
