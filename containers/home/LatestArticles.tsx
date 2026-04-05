"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Tag, Loader2 } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";

interface Article {
  id: number;
  slug: string;
  title: string;
  date: string;
  author: string;
  image_cover: string;
  pdf_file: string;
}

const CategoryBadge = ({ label }: { label: string }) => (
  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#9D0808] bg-[#9D0808]/10 px-2.5 py-1 rounded-full">
    <Tag className="w-3 h-3" />
    {label}
  </span>
);

export const LatestArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch("/api/articles");
        const data = await res.json();
        setArticles(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  // Get top 4 articles
  const topArticles = articles.slice(0, 4);
  const featured = topArticles[0];
  const second = topArticles[1];
  const third = topArticles[2];
  const fourth = topArticles[3];

  if (loading) {
    return (
      <section className="w-full bg-gray-50 py-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 size={40} className="animate-spin text-gray-300 mb-4" />
          <p className="text-gray-400 font-medium">Memuat artikel terbaru...</p>
        </div>
      </section>
    );
  }

  if (articles.length === 0) {
    return null; // Don't show the section if there are no articles
  }

  return (
    <section className="w-full bg-gray-50 py-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <FadeIn className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
          <div>
            <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-[#9D0808] mb-3 border border-[#9D0808]/30 px-3 py-1 rounded-full">
              Artikel
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-black leading-tight tracking-tight">
              Wawasan & Pengetahuan
            </h2>
            <p className="text-gray-500 mt-2 text-base max-w-md">
              Temukan artikel terbaru seputar teknik korosi, industri, dan
              sertifikasi.
            </p>
          </div>
          <Link
            href="/artikel"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-black hover:text-[#9D0808] transition-colors shrink-0"
          >
            Lihat Semua Artikel
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </FadeIn>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Featured Articles */}
          <FadeIn
            direction="left"
            delay={0.1}
            className="lg:col-span-3 flex flex-col gap-6"
          >
            {featured && (
              <Link
                href={`/artikel/${featured.slug}`}
                className="group relative rounded-2xl overflow-hidden min-h-[380px] flex flex-col justify-end shadow-lg hover:shadow-xl transition-shadow block"
              >
                <Image
                  src={
                    featured.image_cover ||
                    "/images/landing-page/background2.png"
                  }
                  alt={featured.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="relative z-10 p-8">
                  <CategoryBadge label="Teknik Korosi" />
                  <h3 className="text-2xl md:text-3xl font-extrabold text-white mt-4 mb-3 leading-snug">
                    {featured.title}
                  </h3>
                  <div className="flex items-center gap-4 text-gray-400 text-xs">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />5 min read
                    </span>
                    <span>{featured.date}</span>
                  </div>
                </div>
              </Link>
            )}

            {/* Secondary Article (Article 4) */}
            {fourth && (
              <Link
                href={`/artikel/${fourth.slug}`}
                className="group relative rounded-2xl overflow-hidden min-h-[180px] flex flex-col justify-end shadow-lg hover:shadow-xl transition-shadow block"
              >
                <Image
                  src={
                    fourth.image_cover || "/images/landing-page/background2.png"
                  }
                  alt={fourth.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="relative z-10 p-6">
                  <CategoryBadge label="Kegiatan" />
                  <h3 className="text-lg font-extrabold text-white mt-3 mb-2 leading-snug">
                    {fourth.title}
                  </h3>
                  <div className="flex items-center gap-4 text-gray-400 text-xs">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />3 min read
                    </span>
                    <span>{fourth.date}</span>
                  </div>
                </div>
              </Link>
            )}
          </FadeIn>

          {/* Related Articles (Articles 2 & 3) */}
          <FadeIn
            direction="right"
            delay={0.2}
            className="lg:col-span-2 flex flex-col gap-4"
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">
              Baca Juga
            </p>
            {[second, third].filter(Boolean).map((article) => (
              <Link
                key={article.id}
                href={`/artikel/${article.slug}`}
                className="group flex gap-4 bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-md transition-shadow items-start"
              >
                {/* Thumbnail */}
                <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden">
                  <Image
                    src={
                      article.image_cover ||
                      "/images/landing-page/background2.png"
                    }
                    alt={article.title}
                    fill
                    sizes="100px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                {/* Text */}
                <div className="flex flex-col justify-between flex-1 min-w-0 h-24">
                  <div>
                    <CategoryBadge label="Artikel" />
                    <h3 className="text-sm font-bold text-black mt-1.5 leading-snug group-hover:text-[#9D0808] transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400 text-xs">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />4 min read
                    </span>
                    <span>{article.date}</span>
                  </div>
                </div>
              </Link>
            ))}

            {/* CTA */}
            <div className="mt-auto pt-4 border-t border-gray-200">
              <Link
                href="/artikel"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-[#9D0808] hover:gap-3 transition-all"
              >
                Lihat semua artikel
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};
