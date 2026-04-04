"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";

export const EventSection = () => {
    const [activeIndex, setActiveIndex] = useState<number>(0);

    const events = [
        {
            id: "01",
            title: "Company Visit",
            desc: "Rooftop and ground-mounted solar systems for homes, offices, and institutions.",
            image: "/images/landing-page/background2.png",
        },
        {
            id: "02",
            title: "Bootcamp",
            desc: "Rooftop and ground-mounted solar systems for homes, offices, and institutions.",
            image: "/images/landing-page/background2.png",
        },
        {
            id: "03",
            title: "Guest Lecture",
            desc: "Rooftop and ground-mounted solar systems for homes, offices, and institutions.",
            image: "/images/landing-page/background2.png",
        },
        {
            id: "04",
            title: "Guest Lecture",
            desc: "Rooftop and ground-mounted solar systems for homes, offices, and institutions.",
            image: "/images/landing-page/background2.png",
        }
    ];

    return (
        <section className="py-24 w-full bg-white">
            <FadeIn className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <h2 className="text-[2.5rem] md:text-[3.5rem] font-bold text-black leading-[1.1] tracking-tight">
                    Where Ideas Get<br />Energized.
                </h2>
                <Link
                    href="/event"
                    className="inline-block bg-[#9D0808] hover:bg-red-800 text-white font-medium py-3 px-8 rounded-full transition-colors shrink-0"
                >
                    View Our Event
                </Link>
            </FadeIn>

            <div className="w-full flex flex-col">
                {events.map((event, index) => {
                    const isActive = activeIndex === index;
                    return (
                        <div
                            key={event.id}
                            className="w-full flex flex-col border-b border-white/20 bg-[#EF3D3D]"
                            onMouseEnter={() => setActiveIndex(index)}
                        >
                            {/* Header */}
                            <div className={`w-full py-8 md:py-10 px-6 md:px-12 lg:px-20 flex items-center justify-between cursor-pointer transition-colors ${isActive ? 'bg-[#EF3D3D]' : 'bg-[#EF3D3D] hover:bg-[#D32F2F]'}`}>
                                <div className="flex items-start md:items-center gap-8 md:gap-16 w-full max-w-[1400px] mx-auto">
                                    <span className="text-4xl md:text-5xl font-bold text-white shrink-0">
                                        {event.id}
                                    </span>
                                    <div className="flex-1 text-white flex flex-col md:flex-row md:items-center gap-2 md:gap-8 justify-between">
                                        <div className="flex flex-col gap-1 w-full md:w-3/4">
                                            <h3 className="text-2xl md:text-3xl font-semibold">{event.title}</h3>
                                            <p className="text-white/90 text-sm md:text-base font-light">
                                                {event.desc}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="shrink-0 text-white opacity-80">
                                        <motion.div
                                            animate={{ rotate: isActive ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <ChevronDown size={32} strokeWidth={1.5} />
                                        </motion.div>
                                    </div>
                                </div>
                            </div>

                            <AnimatePresence initial={false}>
                                {isActive && (
                                    <motion.div
                                        key="content"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "400px", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
                                        className="w-full relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0">
                                            <Image
                                                src={event.image}
                                                alt={event.title}
                                                fill
                                                className="object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/20 mix-blend-multiply"></div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )
                })}
            </div>
        </section>
    );
};
