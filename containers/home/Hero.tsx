import { ArrowRight } from "lucide-react";

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
                    <a
                        href="#"
                        className="group flex flex-col justify-between rounded-xl bg-red p-6 sm:p-8 w-full sm:max-w-[320px] min-h-[220px] text-white transition-all hover:scale-[1.02] shadow-sm hover:shadow-md"
                    >
                        <div>
                            <h3 className="text-xl font-bold mb-3">Popular Event</h3>
                            <p className="text-sm leading-relaxed opacity-90 line-clamp-3">
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam,
                            </p>
                        </div>
                        <div className="flex justify-end mt-4">
                            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </div>
                    </a>

                    <a
                        href="#"
                        className="group flex flex-col justify-between rounded-xl bg-gray-900 p-6 sm:p-8 w-full sm:max-w-[320px] min-h-[220px] text-white transition-all hover:scale-[1.02] shadow-sm hover:shadow-md"
                    >
                        <div>
                            <h3 className="text-xl font-bold mb-3">Popular Article</h3>
                            <p className="text-sm leading-relaxed opacity-90 line-clamp-3">
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam,
                            </p>
                        </div>
                        <div className="flex justify-end mt-4">
                            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </div>
                    </a>
                </div>
            </div>

            <img
                src="/images/landing-page/background2.png"
                alt="Hero background"
                className="relative z-0 w-full h-[500px] sm:h-auto object-cover object-bottom block"
            />
        </section>
    );
};
