import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Wrench, Award, ChevronRight } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";

const benefits = [
  {
    icon: ShieldCheck,
    title: "Kompetensi Terstandarisasi",
    desc: "Sertifikasi SCCP mendukung terciptanya junior engineering dengan standar kompetensi dalam material dan korosi.",
  },
  {
    icon: Wrench,
    title: "Fundamental dan Pengantar Aplikasi Industri",
    desc: "Mencakup dasar-dasar metalurgi, pengujian material, surface engineering, dasar-dasar korosi, monitoring dan kontrol korosi.",
  },
  {
    icon: Award,
    title: "Diakui Industri",
    desc: "Diterbitkan oleh INDOCOR Indonesia bersama INDOCOR ITS SC.",
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
              SCCP
              <span className="block text-2xl md:text-3xl font-light text-gray-500 mt-2 tracking-wide">
                Student Corrosion Certification Program
              </span>
            </h2>

            <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6 max-w-xl">
              Sertifikasi kompetensi di bidang korosi yang ditujukan bagi
              mahasiswa dan fresh graduate yang mencakup dasar-dasar metalurgi,
              material, hingga monitoring dan kontrol korosi.
            </p>

            {/* Sasaran Peserta */}
            <div className="mb-8">
              <p className="font-semibold text-black text-sm mb-2">
                Sasaran Peserta:
              </p>
              <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 ml-1">
                <li>Mahasiswa tingkat akhir</li>
                <li>Fresh Graduate (belum bekerja)</li>
              </ul>
            </div>

            {/* Benefits list */}
            <ul className="space-y-5 mb-10">
              {benefits.map(({ icon: Icon, title, desc }) => (
                <li key={title} className="flex gap-4 items-start">
                  <Icon
                    className="flex-shrink-0 w-7 h-7 text-[#9D0808] mt-0.5"
                    strokeWidth={2.5}
                  />
                  <div>
                    <p className="font-semibold text-black text-sm">{title}</p>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link
              href="/register-iccp"
              className="group inline-flex items-center gap-2 bg-[#9D0808] hover:bg-red-800 text-white font-semibold py-3.5 px-8 rounded-[20px] transition-all hover:scale-[1.02] shadow-md hover:shadow-lg"
            >
              Daftar Sertifikasi SCCP
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </FadeIn>

          {/* Right — image + floating stat cards */}
          <FadeIn
            direction="right"
            delay={0.2}
            className="relative h-[480px] lg:h-[560px]"
          >
            {/* Main image */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/landing-page/background2.png"
                alt="SCCP Student Corrosion Certification"
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
                INDOCOR Indonesia × INDOCOR ITS SC
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Sertifikasi kompetensi korosi untuk mahasiswa dan fresh graduate
                di lingkungan akademis ITS.
              </p>
            </div>

            {/* Floating badge — top right */}
            <div className="absolute top-6 right-6 bg-[#9D0808] text-white rounded-xl px-4 py-3 shadow-lg text-center">
              <p className="text-2xl font-extrabold leading-none">SCCP</p>
              <p className="text-[10px] tracking-widest uppercase opacity-80 mt-0.5">
                Certified
              </p>
            </div>
          </FadeIn>
        </div>

        {/* Bottom stats bar - Connected Line Design */}
        <FadeIn delay={0.1}>
          <div className="mt-24 flex flex-col md:flex-row items-center justify-between gap-10 md:gap-0 max-w-6xl mx-auto relative">
            {/* Stat 1 */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left min-w-[120px]">
              <p className="text-3xl md:text-4xl font-bold text-black mb-2 tracking-tight">
                2015
              </p>
              <p className="text-[10px] md:text-xs font-semibold text-gray-400 uppercase tracking-widest">
                Berdiri Sejak
              </p>
            </div>

            {/* Connecting Line 1 */}
            <div className="hidden md:block flex-1 mx-12 h-[2px] bg-red-500" />

            {/* Stat 2 */}
            <div className="flex flex-col items-center text-center px-4 max-w-md">
              <p className="text-xl md:text-2xl font-bold text-black mb-2 leading-tight">
                Mahasiswa · Fresh Graduate
              </p>
              <p className="text-[10px] md:text-xs font-semibold text-gray-400 uppercase tracking-widest">
                Sasaran Peserta
              </p>
            </div>

            {/* Connecting Line 2 */}
            <div className="hidden md:block flex-1 mx-12 h-[2px] bg-red-500" />

            {/* Stat 3 */}
            <div className="flex flex-col items-center md:items-end text-center md:text-right min-w-[160px]">
              <p className="text-xl md:text-2xl font-bold text-black mb-2 tracking-tight">
                INDOCOR × ITS
              </p>
              <p className="text-[10px] md:text-xs font-semibold text-gray-400 uppercase tracking-widest">
                Lembaga Penyelenggara
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};
