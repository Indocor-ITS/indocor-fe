import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Wrench, Award, ChevronRight } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";

const benefits = [
    {
        icon: ShieldCheck,
        title: "Kompetensi Terstandarisasi",
        desc: "Sertifikasi ICCP memastikan tenaga ahli memiliki standar kompetensi internasional dalam proteksi katodik.",
    },
    {
        icon: Wrench,
        title: "Aplikasi Industri Nyata",
        desc: "Mencakup sistem perlindungan untuk pipa bawah laut, tangki, kapal, dan struktur logam di lingkungan korosif.",
    },
    {
        icon: Award,
        title: "Diakui Industri",
        desc: "Diterbitkan oleh INDOCOR bersama ITS — lembaga terpercaya di bidang korosi di Indonesia.",
    },
];

export const ICCPSection = () => {
    return (
        <section className="w-full bg-white py-24 px-6 md:px-12 lg:px-20 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <FadeIn>
                    <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-[#9D0808] mb-4 border border-[#9D0808]/30 px-3 py-1 rounded-full">
                        Sertifikasi
                    </span>
                </FadeIn>

                {/* Main grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left — text content */}
                    <FadeIn direction="left" delay={0.1}>
                        <h2 className="text-5xl md:text-6xl font-extrabold text-black leading-[1.05] tracking-tight mb-6">
                            ICCP
                            <span className="block text-2xl md:text-3xl font-light text-gray-500 mt-2 tracking-wide">
                                Indonesia Corrosion Certification Project
                            </span>
                        </h2>

                        <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-10 max-w-xl">
                            INDOCOR ITS SC membuka jalur sertifikasi{" "}
                            <span className="font-semibold text-black">
                                Impressed Current Cathodic Protection (ICCP)
                            </span>{" "}
                            — sertifikasi kompetensi bagi para profesional yang menangani
                            sistem proteksi katodik pada infrastruktur kritis di industri
                            minyak & gas, kelautan, dan konstruksi.
                        </p>

                        {/* Benefits list */}
                        <ul className="space-y-5 mb-10">
                            {benefits.map(({ icon: Icon, title, desc }) => (
                                <li key={title} className="flex gap-4 items-start">
                                    <Icon className="flex-shrink-0 w-7 h-7 text-[#9D0808] mt-0.5" strokeWidth={2.5} />
                                    <div>
                                        <p className="font-semibold text-black text-sm">{title}</p>
                                        <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {/* CTA */}
                        <Link
                            href="/register-iccp"
                            className="group inline-flex items-center gap-2 bg-[#9D0808] hover:bg-red-800 text-white font-semibold py-3.5 px-8 rounded-[20px] transition-all hover:scale-[1.02] shadow-md hover:shadow-lg"
                        >
                            Daftar Sertifikasi ICCP
                            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </FadeIn>

                    {/* Right — image + floating stat cards */}
                    <FadeIn direction="right" delay={0.2} className="relative h-[480px] lg:h-[560px]">
                        {/* Main image */}
                        <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl">
                            <Image
                                src="/images/landing-page/background2.png"
                                alt="ICCP Cathodic Protection"
                                fill
                                className="object-cover"
                            />
                            {/* Dark overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                        </div>

                        {/* Floating card — penyelenggara */}
                        <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl p-5 shadow-xl border border-gray-100">
                            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1 font-medium">
                                Penyelenggara
                            </p>
                            <p className="text-black font-bold text-base leading-snug">
                                INDOCOR × Institut Teknologi Sepuluh Nopember (ITS)
                            </p>
                            <p className="text-gray-500 text-sm mt-1">
                                Satu-satunya lembaga sertifikasi ICCP di lingkungan akademis ITS.
                            </p>
                        </div>

                        {/* Floating badge — top right */}
                        <div className="absolute top-6 right-6 bg-[#9D0808] text-white rounded-xl px-4 py-3 shadow-lg text-center">
                            <p className="text-2xl font-extrabold leading-none">ICCP</p>
                            <p className="text-[10px] tracking-widest uppercase opacity-80 mt-0.5">Certified</p>
                        </div>
                    </FadeIn>
                </div>

                {/* Bottom stats bar */}
                <FadeIn delay={0.1}>
                    <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-px bg-red-500 rounded-2xl overflow-hidden shadow-sm">
                        {[
                            { value: "2015", label: "Berdiri Sejak" },
                            { value: "Minyak & Gas · Kelautan · Konstruksi", label: "Industri yang Dicakup" },
                            { value: "INDOCOR × ITS", label: "Lembaga Penyelenggara" },
                        ].map(({ value, label }) => (
                            <div key={label} className="bg-white px-8 py-8 text-center">
                                <p className="text-xl md:text-2xl font-extrabold text-black mb-1">{value}</p>
                                <p className="text-gray-400 text-sm">{label}</p>
                            </div>
                        ))}
                    </div>
                </FadeIn>
            </div>
        </section>
    );
};
