import { Metadata } from 'next';
import BlogPage from '@/containers/blog/BlogPage';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
    title: 'Blog - INDOCOR ITS SC 2026',
    description: 'Kumpulan artikel, insight industri, dan aktivitas seputar korosi dari INDOCOR ITS Student Chapter.',
    keywords: 'Blog INDOCOR, Artikel Korosi, Insight Industri, Mahasiswa ITS, Berita INDOCOR',
};

export default function Page() {
    return (
        <main className="bg-white min-h-screen pt-20">
            <Navbar />
            <BlogPage />
            <Footer />
        </main>
    );
}
