"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FadeIn } from "@/components/FadeIn";
import {
  CalendarDays,
  ArrowRight,
  User,
  Loader2,
  FileText,
  Download,
} from "lucide-react";

interface Article {
  id: number;
  slug: string;
  title: string;
  date: string;
  author: string;
  image_cover: string;
  pdf_file: string;
}

export default function ArtikelPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch("/api/articles");
        const data = await res.json();
        setArticles(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  const filtered = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.author.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      {/* Hero */}
      <section className="bg-gray-950 py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/landing-page/background2.png')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 relative z-10 text-center">
          <FadeIn direction="up">
            <span className="inline-block py-1 px-3 rounded-full bg-white text-black border border-black text-xs font-bold tracking-widest uppercase mb-6">
              Publikasi & Artikel
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight">
              Our Articles
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
              Kumpulan artikel dan publikasi dari INDOCOR ITS Student Chapter.
              Tersedia dalam format PDF untuk kemudahan akses dan distribusi.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 -mt-10 relative z-20">
        {/* Search */}
        <FadeIn direction="up" delay={0.1}>
          <div className="flex justify-center mb-16">
            <div className="bg-white p-2 rounded-full shadow-lg border border-gray-100 flex items-center w-full max-w-xl">
              <input
                type="text"
                placeholder="Cari artikel atau penulis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-3 bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
              />
              <div className="w-12 h-12 bg-red rounded-full flex items-center justify-center text-white shrink-0 shadow-sm cursor-pointer hover:bg-red/90 transition-colors">
                <ArrowRight size={20} />
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 size={40} className="animate-spin text-gray-300" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((article, index) => (
              <FadeIn key={article.id} direction="up" delay={0.1 * (index + 1)}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 h-full flex flex-col group hover:-translate-y-1">
                  {/* Cover Image or PDF Icon */}
                  {article.image_cover ? (
                    <div className="relative w-full h-48 overflow-hidden">
                      <Image
                        src={article.image_cover}
                        alt={article.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-red/5 to-red/10 p-8 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <FileText size={36} className="text-red" />
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6 md:p-8 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-red transition-colors leading-snug">
                      {article.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-500 mb-6">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays size={14} className="text-red" />
                        <span>{article.date}</span>
                      </div>
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      <div className="flex items-center gap-1.5">
                        <User size={14} className="text-red" />
                        <span className="truncate max-w-[150px]">
                          {article.author}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-auto pt-5 border-t border-gray-100 flex items-center gap-3">
                      <Link
                        href={`/artikel/${article.slug}`}
                        className="flex-1 py-2.5 text-center text-sm font-bold text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        Lihat Detail
                      </Link>
                      <a
                        href={article.pdf_file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 text-center text-sm font-bold text-white bg-red rounded-xl hover:bg-red/90 transition-colors inline-flex items-center justify-center gap-2"
                      >
                        <Download size={14} />
                        Download
                      </a>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        ) : (
          <FadeIn direction="up">
            <div className="text-center py-32 bg-white rounded-3xl border border-gray-100 shadow-sm px-6">
              <div className="w-20 h-20 bg-gray-50 rounded-full mx-auto flex items-center justify-center mb-6">
                <FileText size={32} className="text-gray-300" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Artikel Tidak Ditemukan
              </h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                {searchQuery
                  ? `Tidak ada artikel dengan kata kunci "${searchQuery}".`
                  : "Belum ada artikel yang dipublikasikan."}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-8 px-8 py-3 bg-red text-white text-sm font-bold rounded-full hover:bg-red/90 transition-colors"
                >
                  Reset Pencarian
                </button>
              )}
            </div>
          </FadeIn>
        )}
      </section>
    </main>
  );
}
