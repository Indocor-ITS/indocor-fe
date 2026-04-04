"use client";

import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { CalendarDays, ArrowLeft } from "lucide-react";

interface EventProps {
    id: string;
    slug: string;
    title: string;
    date: string;
    image_main: string;
    section1_text: string;
    image_support1: string;
    section2_text: string;
    image_support2: string;
    section3_text: string;
}

interface EventDetailProps {
    event: EventProps;
}

export default function EventDetail({ event }: EventDetailProps) {
    // Split text into paragraphs (by newline)
    const renderParagraphs = (text: string) => {
        if (!text) return null;
        return text.split("\n").filter(Boolean).map((para, idx) => (
            <p key={idx} className="text-gray-600 leading-relaxed text-lg mb-4 last:mb-0">
                {para}
            </p>
        ));
    };

    return (
        <article className="min-h-screen bg-white pb-24">

            {/* Hero — Main Photo */}
            <section className="relative h-[60vh] min-h-[500px] bg-black overflow-hidden flex items-end">
                <div className="absolute inset-0 z-0">
                    <Image
                        src={event.image_main}
                        alt={event.title}
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                </div>

                <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 lg:px-20 w-full pb-16">
                    <FadeIn direction="up">
                        <Link
                            href="/event"
                            className="inline-flex items-center text-gray-300 hover:text-white transition-colors mb-8 group"
                        >
                            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Events
                        </Link>

                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight">
                            {event.title}
                        </h1>

                        <div className="flex items-center gap-3 text-gray-300">
                            <CalendarDays size={20} className="text-red flex-shrink-0" />
                            <span className="text-lg">{event.date}</span>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* Section 1 — Text */}
            {event.section1_text && (
                <section className="max-w-4xl mx-auto px-6 md:px-12 lg:px-20 py-16">
                    <FadeIn direction="up">
                        <div className="prose prose-lg max-w-none">
                            {renderParagraphs(event.section1_text)}
                        </div>
                    </FadeIn>
                </section>
            )}

            {/* Section 2 — Support Photo 1 + Text */}
            {(event.image_support1 || event.section2_text) && (
                <section className="bg-gray-50">
                    <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            {event.image_support1 && (
                                <FadeIn direction="up">
                                    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                                        <Image
                                            src={event.image_support1}
                                            alt={`${event.title} - Foto Pendukung 1`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </FadeIn>
                            )}
                            {event.section2_text && (
                                <FadeIn direction="up" delay={0.1}>
                                    <div className="prose prose-lg max-w-none">
                                        {renderParagraphs(event.section2_text)}
                                    </div>
                                </FadeIn>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Section 3 — Support Photo 2 + Text */}
            {(event.image_support2 || event.section3_text) && (
                <section>
                    <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            {event.section3_text && (
                                <FadeIn direction="up">
                                    <div className="prose prose-lg max-w-none">
                                        {renderParagraphs(event.section3_text)}
                                    </div>
                                </FadeIn>
                            )}
                            {event.image_support2 && (
                                <FadeIn direction="up" delay={0.1}>
                                    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                                        <Image
                                            src={event.image_support2}
                                            alt={`${event.title} - Foto Pendukung 2`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </FadeIn>
                            )}
                        </div>
                    </div>
                </section>
            )}
        </article>
    );
}
