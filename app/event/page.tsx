import { Metadata } from 'next';
import EventPage from '@/containers/event/EventPage';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
    title: 'Events - INDOCOR ITS SC 2026',
    description: 'Daftar kegiatan, seminar, dan sertifikasi yang diselenggarakan oleh INDOCOR ITS Student Chapter.',
    keywords: 'Acara INDOCOR, Event ITS, Sertifikasi Korosi, Seminar Nasional',
};

export default function Page() {
    return (
        <main className="bg-white min-h-screen pt-20">
            <Navbar />
            <EventPage />
            <Footer />
        </main>
    );
}
