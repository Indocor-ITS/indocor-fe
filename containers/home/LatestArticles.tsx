import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Tag } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";

const articles = [
    {
        id: 1,
        category: "Teknik Korosi",
        title: "Mengenal Sistem Proteksi Katodik ICCP pada Pipa Bawah Laut",
        excerpt:
            "Impressed Current Cathodic Protection (ICCP) adalah metode andalan untuk melindungi struktur logam dari korosi di lingkungan kelautan. Pelajari cara kerjanya.",
        date: "28 Feb 2026",
        readTime: "5 min read",
        image: "/images/landing-page/background2.png",
        href: "/blog/iccp-pipa-bawah-laut",
        featured: true,
    },
    {
        id: 2,
        category: "Industri",
        title: "Korosi pada Industri Minyak & Gas: Ancaman Diam yang Merugikan",
        excerpt:
            "Setiap tahun industri minyak dan gas mengalami kerugian besar akibat korosi. Bagaimana cara mitigasinya?",
        date: "20 Feb 2026",
        readTime: "4 min read",
        image: "/images/landing-page/background2.png",
        href: "/blog/korosi-minyak-gas",
        featured: false,
    },
    {
        id: 3,
        category: "Sertifikasi",
        title: "Manfaat Sertifikasi ICCP bagi Karier Insinyur Korosi di Indonesia",
        excerpt:
            "Sertifikasi ICCP membuka peluang karier yang lebih luas di industri energi, maritim, dan infrastruktur nasional.",
        date: "14 Feb 2026",
        readTime: "3 min read",
        image: "/images/landing-page/background2.png",
        href: "/blog/manfaat-sertifikasi-iccp",
        featured: false,
    },
    {
        id: 4,
        category: "Kegiatan",
        title: "Highlight Company Visit INDOCOR ITS SC 2025",
        excerpt:
            "Kunjungan industri ke salah satu perusahaan energi terkemuka memberikan wawasan nyata tentang penerapan sistem proteksi korosi di lapangan.",
        date: "5 Feb 2026",
        readTime: "3 min read",
        image: "/images/landing-page/background2.png",
        href: "/blog/company-visit-2025",
        featured: false,
    },
];

const CategoryBadge = ({ label }: { label: string }) => (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#9D0808] bg-[#9D0808]/10 px-2.5 py-1 rounded-full">
        <Tag className="w-3 h-3" />
        {label}
    </span>
);

export const LatestArticles = () => {
    const [featured, second, third, fourth] = articles;

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
                            Temukan artikel terbaru seputar teknik korosi, industri, dan sertifikasi.
                        </p>
                    </div>
                    <Link
                        href="/blog"
                        className="group inline-flex items-center gap-2 text-sm font-semibold text-black hover:text-[#9D0808] transition-colors shrink-0"
                    >
                        Lihat Semua Artikel
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </FadeIn>

                {/* Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                    {/* Featured Articles */}
                    <FadeIn direction="left" delay={0.1} className="lg:col-span-3 flex flex-col gap-6">
                        <Link
                            href={featured.href}
                            className="group relative rounded-2xl overflow-hidden min-h-[380px] flex flex-col justify-end shadow-lg hover:shadow-xl transition-shadow block"
                        >
                            <Image src={featured.image} alt={featured.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                            <div className="relative z-10 p-8">
                                <CategoryBadge label={featured.category} />
                                <h3 className="text-2xl md:text-3xl font-extrabold text-white mt-4 mb-3 leading-snug">{featured.title}</h3>
                                <p className="text-gray-300 text-sm leading-relaxed line-clamp-2 mb-5">{featured.excerpt}</p>
                                <div className="flex items-center gap-4 text-gray-400 text-xs">
                                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{featured.readTime}</span>
                                    <span>{featured.date}</span>
                                </div>
                            </div>
                        </Link>

                        {/* Secondary Article */}
                        <Link
                            href={fourth.href}
                            className="group relative rounded-2xl overflow-hidden min-h-[180px] flex flex-col justify-end shadow-lg hover:shadow-xl transition-shadow block"
                        >
                            <Image src={fourth.image} alt={fourth.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                            <div className="relative z-10 p-6">
                                <CategoryBadge label={fourth.category} />
                                <h3 className="text-lg font-extrabold text-white mt-3 mb-2 leading-snug">{fourth.title}</h3>
                                <div className="flex items-center gap-4 text-gray-400 text-xs">
                                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{fourth.readTime}</span>
                                    <span>{fourth.date}</span>
                                </div>
                            </div>
                        </Link>
                    </FadeIn>

                    {/* Related Articles */}
                    <FadeIn direction="right" delay={0.2} className="lg:col-span-2 flex flex-col gap-4">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Baca Juga</p>
                        {[second, third].map((article) => (
                            <Link
                                key={article.id}
                                href={article.href}
                                className="group flex gap-4 bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-md transition-shadow items-start"
                            >
                                {/* Thumbnail */}
                                <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden">
                                    <Image src={article.image} alt={article.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                                </div>
                                {/* Text */}
                                <div className="flex flex-col justify-between flex-1 min-w-0 h-24">
                                    <div>
                                        <CategoryBadge label={article.category} />
                                        <h3 className="text-sm font-bold text-black mt-1.5 leading-snug group-hover:text-[#9D0808] transition-colors line-clamp-2">
                                            {article.title}
                                        </h3>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-400 text-xs">
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{article.readTime}</span>
                                        <span>{article.date}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}

                        {/* CTA */}
                        <div className="mt-auto pt-4 border-t border-gray-200">
                            <Link href="/blog" className="group inline-flex items-center gap-2 text-sm font-semibold text-[#9D0808] hover:gap-3 transition-all">
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
