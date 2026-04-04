import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";

export const CTASection = () => {
    return (
        <section className="relative w-full py-24 px-6 md:px-12 lg:px-20 text-center overflow-hidden">
            {/* Background image */}
            <Image
                src="/images/landing-page/cta.jpg"
                alt="CTA background"
                fill
                className="object-cover object-center z-0"
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/65 z-10" />

            {/* Content */}
            <FadeIn className="relative z-20 max-w-2xl mx-auto flex flex-col items-center gap-6">
                <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
                    Siap Terjun ke Dunia<br />
                    <span className="text-white">Teknik Korosi?</span>
                </h2>

                <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                    Bergabunglah dengan INDOCOR ITS SC — komunitas mahasiswa teknik korosi
                    terdepan di ITS. Kembangkan diri, raih sertifikasi ICCP, dan bangun
                    karier yang relevan dengan industri energi & infrastruktur Indonesia.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mt-2">
                    <Link
                        href="/register-iccp"
                        className="group inline-flex items-center justify-center gap-2 bg-[#9D0808] hover:bg-red-800 text-white font-semibold py-3.5 px-8 rounded-[20px] transition-all hover:scale-[1.02]"
                    >
                        Daftar Sertifikasi ICCP
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link
                        href="/about"
                        className="inline-flex items-center justify-center gap-2 border border-white/40 hover:border-white/70 text-white font-semibold py-3.5 px-8 rounded-[20px] transition-all hover:scale-[1.02]"
                    >
                        <Mail className="w-4 h-4" />
                        Hubungi Kami
                    </Link>
                </div>
            </FadeIn>
        </section>
    );
};
