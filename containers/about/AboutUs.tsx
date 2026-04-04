"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { FadeIn } from "@/components/FadeIn";
import {
    ShieldCheck,
    RadioTower,
    Award,
    Users,
    Mic2,
    Building2,
    GraduationCap,
    CalendarDays,
    Target,
    Eye,
} from "lucide-react";
import Image from "next/image";


const visiText =
    "INDOCOR ITS SC menjadi organisasi keilmuan korosi yang kredibel dan profesional melalui kolaborasi strategis untuk mendukung pengembangan keilmuan dan kontribusi nyata sehingga dapat menjadi organisasi yang berkelanjutan.";

const misiList = [
    "Membangun tata kelola organisasi INDOCOR ITS SC yang profesional, tertib, dan akuntabel melalui sistem kerja yang terstandarisasi serta monitoring dan evaluasi yang konsisten sebagai fondasi kredibilitas birokrasi kampus.",
    "Mengembangkan kolaborasi strategis INDOCOR ITS SC dengan INDOCOR pusat dan mitra eksternal melalui hubungan yang berkelanjutan dan saling menguntungkan untuk memperkuat branding serta keberjalanan organisasi.",
    "Mewujudkan profesionalisme INDOCOR ITS SC dengan meningkatkan kualitas kinerja organisasi melalui penguatan sistem pengendalian, pemerataan kapasitas SDM, dan internalisasi nilai profesionalisme dalam setiap proses organisasi.",
    "Menjamin keberlanjutan INDOCOR ITS SC melalui pengelolaan sumber daya yang adaptif, penguatan budaya organisasi, dan fokus pada program prioritas berimpact tinggi dalam menghadapi keterbatasan dukungan dan legalitas.",
];

const indocorFacts = [
    { label: "Didirikan", value: "1973" },
    { label: "Fokus", value: "Korosi" },
    { label: "Dampak Korosi", value: "2–5% GNP" },
    { label: "SC Pertama", value: "ITS 2015" },
];

const indocorFeatures = [
    {
        icon: RadioTower,
        title: "Media Informasi",
        desc: "Jembatan komunikasi dan berbagi pengalaman para profesional korosi di seluruh Indonesia.",
    },
    {
        icon: ShieldCheck,
        title: "Sertifikasi Profesional",
        desc: "Menyelenggarakan sertifikasi seperti Corrosion Inspector untuk standar kompetensi industri.",
    },
    {
        icon: Award,
        title: "Konferensi & Pelatihan",
        desc: "Menggelar konferensi nasional dan pelatihan teknis secara rutin bagi para praktisi.",
    },
];

const itscPrograms = [
    {
        icon: GraduationCap,
        title: "ICCP",
        subtitle: "Indonesian Corrosion Certification Project",
        desc: "Pelatihan dan sertifikasi korosi bagi mahasiswa, mempersiapkan mereka masuk ke dunia kerja profesional.",
    },
    {
        icon: CalendarDays,
        title: "ICW",
        subtitle: "Indonesian Corrosion Week",
        desc: "Acara tahunan besar yang mencakup kompetisi inovasi dan seminar pencegahan korosi bagi generasi muda.",
    },
    {
        icon: Building2,
        title: "Company Visit",
        subtitle: "Kunjungan Industri",
        desc: "Kunjungan ke perusahaan industri untuk melihat langsung implementasi pengendalian korosi di lapangan.",
    },
    {
        icon: Mic2,
        title: "CORPODS",
        subtitle: "Podcast Edukatif",
        desc: "Podcast yang membahas dunia korosi (#CorMunication) dan kehidupan kampus (#Inpods).",
    },
];

/* Hero */

function ParallaxHero() {
    const heroRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"],
    });

    // Background moves up slowly
    const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    // Text slides up and fades out faster
    const textY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
    const textOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);

    const bgYSpring = useSpring(bgY, { stiffness: 80, damping: 20 });
    const textYSpring = useSpring(textY, { stiffness: 80, damping: 20 });

    return (
        <section
            ref={heroRef}
            className="relative h-screen min-h-[600px] overflow-hidden bg-black"
        >
            {/* Background */}
            <motion.div
                className="absolute inset-0 w-full h-[130%] top-[-15%]"
                style={{ y: bgYSpring }}
            >
                <Image
                    src="/images/about/bg1.png"
                    alt="INDOCOR ITS SC Background"
                    fill
                    priority
                    className="object-cover object-center"
                    sizes="100vw"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
            </motion.div>

            {/* Content */}
            <motion.div
                className="absolute inset-0 flex flex-col justify-center items-center text-center z-20 px-6"
                style={{ y: textYSpring, opacity: textOpacity }}
            >
                {/* Eyebrow */}
                <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-[10px] md:text-xs font-semibold tracking-[0.4em] uppercase text-white mb-4 md:mb-5"
                >
                    Student Chapter · ITS Surabaya
                </motion.p>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="text-[clamp(3rem,9vw,7rem)] font-extrabold leading-[1.0] tracking-tight text-white mb-4 md:mb-6"
                >
                    INDOCOR ITS SC
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-xs md:text-sm font-medium tracking-[0.15em] uppercase text-gray-400 mb-6 md:mb-8"
                >
                    Indonesian Corrosion Association
                </motion.p>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.25 }}
                    className="hidden md:block max-w-xl text-base text-gray-400 leading-relaxed"
                >
                    Student chapter <strong className="text-white">pertama</strong> yang dibentuk langsung oleh INDOCOR Pusat —
                    jembatan antara dunia akademik dan industri korosi Indonesia.
                </motion.p>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="hidden md:flex flex-wrap justify-center gap-10 mt-12"
                >
                    {[
                        { val: "2015", label: "Tahun Berdiri" },
                        { val: "#1", label: "SC Pertama" },
                        { val: "ITS", label: "Surabaya" },
                        { val: "TMMT", label: "Teknik Material" },
                    ].map((s) => (
                        <div key={s.label} className="text-center">
                            <p className="text-2xl font-extrabold text-white">{s.val}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">{s.label}</p>
                        </div>
                    ))}
                </motion.div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
                style={{ opacity: textOpacity }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <span className="text-[10px] text-gray-500 tracking-[0.3em] uppercase">Scroll</span>
                <motion.div
                    className="w-px h-8 bg-gray-600"
                    animate={{ scaleY: [1, 0.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                />
            </motion.div>
        </section>
    );
}

/* Visi Misi */

function VisiMisiSection() {
    return (
        <section className="py-28 bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">

                {/* Section label */}
                <FadeIn direction="up">
                    <div className="flex items-center gap-3 mb-16">
                        <span className="h-px w-8 bg-red" />
                        <span className="text-xs font-semibold tracking-[0.2em] uppercase text-red">
                            Visi &amp; Misi
                        </span>
                    </div>
                </FadeIn>

                <div className="grid lg:grid-cols-2 gap-12 items-stretch">

                    {/* Visi card */}
                    <FadeIn direction="right">
                        <div className="relative h-full rounded-sm overflow-hidden border border-gray-100 bg-black p-10 flex flex-col justify-between group hover:border-red/40 transition-colors duration-300">
                            {/* Background tint */}
                            <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-red/10 pointer-events-none" />

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <h2 className="text-2xl font-extrabold text-white tracking-tight">VISI</h2>
                                </div>

                                <p className="text-gray-300 text-base md:text-lg leading-relaxed font-light">
                                    &ldquo;{visiText}&rdquo;
                                </p>
                            </div>

                            {/* Decorative corner */}
                            <div className="absolute bottom-0 right-0 w-24 h-24 bg-red/5 rounded-tl-full pointer-events-none" />
                        </div>
                    </FadeIn>

                    {/* Misi card */}
                    <FadeIn direction="left" delay={0.1}>
                        <div className="relative h-full rounded-sm overflow-hidden border border-gray-100 bg-gray-950 p-10 flex flex-col group hover:border-red/40 transition-colors duration-300">
                            <div className="absolute inset-0 bg-gradient-to-bl from-black via-gray-950 to-red/5 pointer-events-none" />

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <h2 className="text-2xl font-extrabold text-white tracking-tight">MISI</h2>
                                </div>

                                <ol className="flex flex-col gap-4">
                                    {misiList.map((item, i) => (
                                        <li key={i} className="flex gap-4">
                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red/20 border border-red/40 flex items-center justify-center text-[11px] font-bold text-red mt-0.5">
                                                {i + 1}
                                            </span>
                                            <p className="text-sm text-gray-400 leading-relaxed">{item}</p>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}

/* National */

function IndocorNationalSection() {
    return (
        <section className="py-24 bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">

                <FadeIn direction="up">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="h-px w-8 bg-red" />
                        <span className="text-xs font-semibold tracking-[0.2em] uppercase text-red">
                            Organisasi Profesi Nasional
                        </span>
                    </div>
                </FadeIn>

                <div className="grid lg:grid-cols-2 gap-16 items-start mt-4">

                    {/* Left text */}
                    <FadeIn direction="right" delay={0.05}>
                        <h2 className="text-[clamp(2rem,4.5vw,3.2rem)] font-extrabold leading-tight tracking-tight text-black mb-6">
                            INDOCOR
                            <span className="block text-base font-semibold tracking-widest text-gray-400 mt-2 normal-case">
                                Asosiasi Korosi Indonesia
                            </span>
                        </h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            INDOCOR didirikan secara resmi pada{" "}
                            <strong>19 Januari 1973</strong> sebagai wadah bagi para profesional
                            untuk mengatasi masalah korosi di sektor industri Indonesia.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            Menjadi media informasi, komunikasi, dan berbagi pengalaman terkait
                            pengendalian korosi di berbagai infrastruktur — dengan tujuan menekan
                            kerugian ekonomi akibat korosi yang diperkirakan mencapai{" "}
                            <strong>2–5% dari GNP</strong> negara.
                        </p>
                    </FadeIn>

                    {/* Right: stats + features */}
                    <div className="flex flex-col gap-8">
                        <FadeIn direction="left" delay={0.1}>
                            <div className="grid grid-cols-2 gap-4">
                                {indocorFacts.map((f) => (
                                    <div key={f.label} className="border border-gray-200 p-5 rounded-sm bg-white hover:border-red/40 transition-colors">
                                        <p className="text-2xl font-extrabold tracking-tight text-black">{f.value}</p>
                                        <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">{f.label}</p>
                                    </div>
                                ))}
                            </div>
                        </FadeIn>

                        <FadeIn direction="left" delay={0.2}>
                            <div className="flex flex-col gap-4">
                                {indocorFeatures.map((feat) => (
                                    <div
                                        key={feat.title}
                                        className="flex gap-4 p-5 border border-gray-100 rounded-sm hover:border-red/40 transition-colors group"
                                    >
                                        <feat.icon size={22} className="text-red flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-sm text-black mb-1">{feat.title}</p>
                                            <p className="text-sm text-gray-500 leading-relaxed">{feat.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* Programs */

function ProgramSection() {
    return (
        <section className="py-28 bg-white">
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">

                <FadeIn direction="up">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="h-px w-8 bg-red" />
                        <span className="text-xs font-semibold tracking-[0.2em] uppercase text-red">
                            Program Unggulan
                        </span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
                        <h2 className="text-[clamp(2rem,4.5vw,3.2rem)] font-extrabold leading-tight tracking-tight text-black">
                            Apa yang Kami Lakukan
                        </h2>
                        <p className="text-gray-500 text-sm max-w-sm leading-relaxed md:text-right">
                            Dari sertifikasi hingga podcast — INDOCOR ITS SC hadir dengan program
                            yang mempersiapkan mahasiswa untuk industri.
                        </p>
                    </div>
                </FadeIn>

                <div className="grid sm:grid-cols-2 gap-6">
                    {itscPrograms.map((prog, i) => (
                        <FadeIn key={prog.title} direction="up" delay={i * 0.08}>
                            <div className="group relative border border-gray-200 p-8 rounded-sm hover:border-red/50 hover:shadow-lg transition-all duration-300 bg-white overflow-hidden h-full">
                                {/* Hover left accent */}
                                <div className="absolute top-0 left-0 w-0 group-hover:w-1 h-full bg-red transition-all duration-300" />

                                {/* Icon + title */}
                                <div className="flex items-center gap-4 mb-5">
                                    <div className="w-12 h-12 rounded-sm bg-gray-50 group-hover:bg-red/10 border border-gray-100 group-hover:border-red/30 flex items-center justify-center transition-all duration-300">
                                        <prog.icon size={22} className="text-red" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg text-black leading-none">{prog.title}</p>
                                        <p className="text-[11px] text-gray-400 mt-1 font-medium tracking-wide">{prog.subtitle}</p>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-600 leading-relaxed">{prog.desc}</p>
                            </div>
                        </FadeIn>
                    ))}
                </div>

                {/* CTA */}
                <FadeIn direction="up" delay={0.35}>
                    <div className="mt-16 border border-gray-200 rounded-sm p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-gray-50">
                        <div className="flex items-center gap-4">
                            <Users size={28} className="text-red flex-shrink-0" />
                            <div>
                                <p className="font-bold text-black leading-tight">
                                    Bergabung dengan INDOCOR ITS SC
                                </p>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    Ikuti program sertifikasi ICCP dan jadilah bagian dari komunitas korosi Indonesia.
                                </p>
                            </div>
                        </div>
                        <a
                            href="/register-iccp"
                            className="flex-shrink-0 bg-red hover:bg-red/90 text-white px-7 py-3 rounded-[20px] font-semibold text-sm transition-all hover:scale-[1.02] whitespace-nowrap"
                        >
                            Daftar ICCP 2026
                        </a>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}

/* Intro */

function IntroSection() {
    const highlights = [
        {
            label: "Asal Usul",
            desc: "INDOCOR (pusat) didirikan pada 19 Januari 1973 sebagai organisasi nirlaba yang berfokus pada teknologi pengendalian korosi di Indonesia.",
        },
        {
            label: "Peran INDOCOR ITS",
            desc: "Merupakan wadah keprofesian di lingkungan ITS yang bertujuan meningkatkan wawasan mahasiswa tingkat akhir terkait dunia korosi.",
        },
        {
            label: "Aktivitas Utama",
            desc: "ICCP (Indonesia Corrosion Certification Project) — sertifikasi mahasiswa. Company Visit — wawasan industri langsung. Corrosion Presentation Challenge — kompetisi ilmiah korosi.",
        },
    ];

    return (
        <section className="py-24 border-b border-gray-100 bg-white">
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left — headline */}
                    <FadeIn direction="right">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="h-px w-8 bg-red" />
                            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-red">
                                Tentang Kami
                            </span>
                        </div>
                        <h2 className="text-[clamp(2rem,4.5vw,3.2rem)] font-extrabold leading-tight tracking-tight text-black mb-6">
                            Apa itu{" "}
                            <span className="text-red">INDOCOR ITS SC?</span>
                        </h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            <strong>INDOCOR ITS SC (Student Chapter)</strong> adalah organisasi mahasiswa
                            di bawah naungan <strong>Asosiasi Korosi Indonesia (INDOCOR)</strong>.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            Dibentuk untuk mendalami ilmu korosi, INDOCOR ITS SC aktif menyelenggarakan
                            kegiatan seperti Indonesia Corrosion Certification Project (ICCP) dan
                            kunjungan industri, guna membekali mahasiswa dengan keterampilan praktis
                            yang sesuai kebutuhan industri.
                        </p>
                        <p className="text-gray-500 text-sm leading-relaxed mt-6 border-l-2 border-red pl-4 italic">
                            INDOCOR ITS terus berupaya menjembatani pengetahuan akademis dengan
                            kebutuhan industri, khususnya dalam pengelolaan korosi yang berdampak
                            besar pada pembangunan.
                        </p>
                    </FadeIn>

                    {/* Right — key points */}
                    <div className="flex flex-col gap-5">
                        {highlights.map((item, i) => (
                            <FadeIn key={item.label} direction="left" delay={i * 0.1}>
                                <div className="group flex gap-5 p-6 border border-gray-100 rounded-sm hover:border-red/40 hover:shadow-sm transition-all duration-300 bg-white">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red/10 border border-red/30 flex items-center justify-center">
                                        <span className="text-xs font-bold text-red">{i + 1}</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-black mb-1">{item.label}</p>
                                        <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

/* Main Export */

export default function AboutUs() {
    return (
        <main className="bg-white text-black">
            <ParallaxHero />
            <IntroSection />
            <VisiMisiSection />
            <IndocorNationalSection />
            <ProgramSection />
        </main>
    );
}
