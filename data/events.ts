export type EventStatus = "upcoming" | "past";

export interface Event {
  id: string;
  slug: string;
  title: string;
  date: string;
  location: string;
  status: EventStatus;
  image: string;
  description: string;
  speakers?: { name: string; role: string; image: string }[];
  registrationLink?: string;
}

export const eventsData: Event[] = [
  {
    id: "ev-1",
    slug: "iccp-2026",
    title: "Student Corrosion Certification Program (SCCP) 2026",
    date: "15 - 18 Agustus 2026",
    location: "Gedung Robotika ITS & Zoom Meeting",
    status: "upcoming",
    image: "/images/landing-page/about.png", // Using existing placeholder
    description:
      "Program sertifikasi korosi tingkat nasional yang diadakan oleh INDOCOR ITS Student Chapter. Kegiatan ini bertujuan untuk mencetak inspektur korosi yang handal dan diakui secara profesional oleh industri.",
    speakers: [
      {
        name: "Dr. Eng. Yanuardi",
        role: "Head of INDOCOR National",
        image: "/foto-dummy.webp",
      },
      {
        name: "Prof. Sulistijono",
        role: "Corrosion Expert ITS",
        image: "/foto-dummy.webp",
      },
    ],
    registrationLink: "/register-iccp",
  },
  {
    id: "ev-2",
    slug: "corrosion-week-2025",
    title: "Corrosion Awareness Week 2025",
    date: "10 - 12 November 2025",
    location: "Auditorium Pascasarjana ITS",
    status: "past",
    image: "/images/landing-page/about.png",
    description:
      "Pekan peduli korosi yang berisi seminar nasional, lomba essay, dan pameran teknologi pengendalian korosi terbaru. Acara ini dihadiri oleh lebih dari 500 peserta dari berbagai universitas di Indonesia.",
    speakers: [
      {
        name: "Ir. Budi Santoso",
        role: "VP Engineering PT. Pertamina",
        image: "/foto-dummy.webp",
      },
    ],
  },
  {
    id: "ev-3",
    slug: "webinar-cathodic-protection",
    title: "Webinar: Fundamentals of Cathodic Protection",
    date: "5 Mei 2025",
    location: "Zoom Cloud Meetings",
    status: "past",
    image: "/images/landing-page/about.png",
    description:
      "Webinar interaktif yang membahas dasar-dasar proteksi katodik untuk pipa bawah tanah dan struktur lepas pantai. Peserta mendapatkan e-certificate dan modul pembelajaran gratis.",
    speakers: [
      {
        name: "Andi Wijaya, S.T., M.T.",
        role: "Senior Cathodic Protection Engineer",
        image: "/foto-dummy.webp",
      },
    ],
  },
];
