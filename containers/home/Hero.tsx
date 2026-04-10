import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const Hero = () => {
  return (
    <section className="relative w-full bg-white">
      {/* Top content: heading + tagline */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-32 md:pt-40">
        <div className="max-w-3xl mb-16 md:mb-20">
          <h1 className="text-[clamp(2.5rem,7vw,5rem)] font-extrabold leading-[1.05] tracking-tight text-black">
            INDOCOR ITS SC
          </h1>
          <p className="text-[clamp(2rem,5.5vw,3.8rem)] font-light leading-[1.1] tracking-wide text-black mt-2">
            REDEFINING GLORY
          </p>
          <p className="text-base md:text-lg text-gray-600 mt-6 max-w-xl leading-relaxed">
            Indocor ITS berfokus mempersiapkan jalur karir bagi mahasiswa ITS
            agar siap terjun sebagai tenaga profesional di bidang korosi.
          </p>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row gap-6 mb-[-260px] sm:mb-[-100px] md:mb-[-120px]">
          <Link
            href="/event"
            className="group flex flex-col justify-between rounded-xl bg-red p-6 sm:p-8 w-full sm:max-w-[320px] min-h-[220px] text-white transition-all hover:scale-[1.02] shadow-sm hover:shadow-md"
          >
            <div>
              <h3 className="text-xl font-bold mb-3">Popular Event</h3>
              <p className="text-sm leading-relaxed opacity-90 line-clamp-3">
                Kenalan langsung dengan dunia industri korosi lewat kunjungan ke
                perusahaan mitra. Peserta diajak melihat penerapan proteksi
                katodik, sistem inspeksi korosi, dan berdiskusi dengan engineer
                profesional di lapangan.
              </p>
            </div>
            <div className="flex justify-end mt-4">
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          <Link
            href="#"
            className="group flex flex-col justify-between rounded-xl bg-gray-900 p-6 sm:p-8 w-full sm:max-w-[320px] min-h-[220px] text-white transition-all hover:scale-[1.02] shadow-sm hover:shadow-md"
          >
            <div>
              <h3 className="text-xl font-bold mb-3">Popular Article</h3>
              <p className="text-sm leading-relaxed opacity-90 line-clamp-3">
                Pengenalan dasar SCCP dan cara melindungi pipa, kapal, dan
                struktur lepas pantai dari korosi.
              </p>
            </div>
            <div className="flex justify-end mt-4">
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </div>

      <div className="relative z-0 w-full h-[500px] sm:h-auto overflow-hidden">
        <Image
          src="/images/landing-page/background2.png"
          alt="Hero background"
          width={1920}
          height={1080}
          className="w-full h-full object-cover object-bottom block"
          priority
        />
      </div>
    </section>
  );
};
