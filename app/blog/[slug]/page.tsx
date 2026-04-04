import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogDetail from '@/containers/blog/BlogDetail';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

// Generate dynamic metadata based on the blog slug
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;

    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            "SELECT title, author FROM articles WHERE slug = ?",
            [slug]
        );

        if (rows.length === 0) {
            return { title: 'Artikel Tidak Ditemukan - INDOCOR ITS SC' };
        }

        return {
            title: `${rows[0].title} - INDOCOR ITS SC`,
            description: `Artikel oleh ${rows[0].author} - INDOCOR ITS Student Chapter`,
        };
    } catch {
        return { title: 'Artikel - INDOCOR ITS SC' };
    }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            "SELECT * FROM articles WHERE slug = ?",
            [slug]
        );

        if (rows.length === 0) {
            notFound();
        }

        const blog = {
            id: String(rows[0].id),
            slug: rows[0].slug,
            title: rows[0].title,
            date: rows[0].date,
            author: rows[0].author,
            pdf_file: rows[0].pdf_file,
        };

        return (
            <main className="bg-white min-h-screen pt-20">
                <Navbar />
                <BlogDetail blog={blog} />
                <Footer />
            </main>
        );
    } catch {
        notFound();
    }
}
