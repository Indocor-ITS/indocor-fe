"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { CalendarDays, ArrowRight, Loader2 } from "lucide-react";

interface EventItem {
    id: number;
    slug: string;
    title: string;
    date: string;
    image_main: string;
    section1_text: string;
}

export default function EventPage() {
    const [events, setEvents] = useState<EventItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchEvents() {
            try {
                const res = await fetch("/api/events");
                const data = await res.json();
                setEvents(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchEvents();
    }, []);

    return (
        <main className="min-h-screen bg-gray-50 pb-24">
            {/* Hero */}
            <section className="bg-black py-20 md:py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/landing-page/background2.png')] bg-cover bg-center opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />

                <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 relative z-10 text-center">
                    <FadeIn direction="up">
                        <span className="inline-block py-1 px-3 rounded-full bg-white text-black border border-black text-xs font-bold tracking-widest uppercase mb-6">
                            Kegiatan Kami
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight">
                            Explore Our Events
                        </h1>
                        <p className="text-gray-300 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
                            Temukan berbagai program, sertifikasi, dan seminar unggulan yang kami selenggarakan untuk kemajuan profesionalisme Anda di bidang korosi.
                        </p>
                    </FadeIn>
                </div>
            </section>

            {/* Content */}
            <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 -mt-10 relative z-20">
                {loading ? (
                    <div className="flex items-center justify-center py-32">
                        <Loader2 size={40} className="animate-spin text-gray-300" />
                    </div>
                ) : events.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.map((event, index) => (
                            <FadeIn key={event.id} direction="up" delay={0.1 * (index + 1)}>
                                <Link href={`/event/${event.slug}`} className="block h-full">
                                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 h-full flex flex-col group hover:-translate-y-1">
                                        {/* Image */}
                                        <div className="relative h-56 w-full overflow-hidden">
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                                            <Image
                                                src={event.image_main}
                                                alt={event.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 md:p-8 flex flex-col flex-grow">
                                            <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-red transition-colors">
                                                {event.title}
                                            </h3>

                                            <div className="flex items-center gap-3 text-gray-600 text-sm mb-4">
                                                <CalendarDays size={16} className="text-red flex-shrink-0" />
                                                <span>{event.date}</span>
                                            </div>

                                            {event.section1_text && (
                                                <p className="text-sm text-gray-500 line-clamp-3 mb-6 flex-grow">
                                                    {event.section1_text}
                                                </p>
                                            )}

                                            <div className="flex items-center text-red font-bold text-sm group-hover:gap-2 transition-all mt-auto pt-4 border-t border-gray-100">
                                                <span>Lihat Selengkapnya</span>
                                                <ArrowRight size={16} className="ml-1" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </FadeIn>
                        ))}
                    </div>
                ) : (
                    <FadeIn direction="up">
                        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 border-dashed">
                            <CalendarDays size={48} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Belum ada kegiatan</h3>
                            <p className="text-gray-500">Saat ini belum ada kegiatan yang dipublikasikan.</p>
                        </div>
                    </FadeIn>
                )}
            </section>
        </main>
    );
}
