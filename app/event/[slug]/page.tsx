import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import EventDetail from '@/containers/event/EventDetail';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;

    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            "SELECT title, section1_text FROM events WHERE slug = ?",
            [slug]
        );

        if (rows.length === 0) {
            return { title: 'Kegiatan Tidak Ditemukan - INDOCOR ITS SC' };
        }

        return {
            title: `${rows[0].title} - INDOCOR ITS SC`,
            description: rows[0].section1_text ? rows[0].section1_text.substring(0, 160) : undefined,
        };
    } catch {
        return { title: 'Event - INDOCOR ITS SC' };
    }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            "SELECT * FROM events WHERE slug = ?",
            [slug]
        );

        if (rows.length === 0) {
            notFound();
        }

        const row = rows[0];
        const event = {
            id: String(row.id),
            slug: row.slug,
            title: row.title,
            date: row.date,
            image_main: row.image_main,
            section1_text: row.section1_text || "",
            image_support1: row.image_support1 || "",
            section2_text: row.section2_text || "",
            image_support2: row.image_support2 || "",
            section3_text: row.section3_text || "",
        };

        return (
            <main className="bg-white min-h-screen pt-20">
                <Navbar />
                <EventDetail event={event} />
                <Footer />
            </main>
        );
    } catch {
        notFound();
    }
}
