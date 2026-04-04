import { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogDetail from "@/containers/blog/BlogDetail";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import supabase from "@/lib/db";

// Generate dynamic metadata based on the blog slug
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const { data } = await supabase
      .from("articles")
      .select("title, author")
      .eq("slug", slug)
      .single();

    if (!data) {
      return { title: "Artikel Tidak Ditemukan - INDOCOR ITS SC" };
    }

    return {
      title: `${data.title} - INDOCOR ITS SC`,
      description: `Artikel oleh ${data.author} - INDOCOR ITS Student Chapter`,
    };
  } catch {
    return { title: "Artikel - INDOCOR ITS SC" };
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!data) {
    notFound();
  }

  const blog = {
    id: String(data.id),
    slug: data.slug,
    title: data.title,
    date: data.date,
    author: data.author,
    pdf_file: data.pdf_file,
  };

  return (
    <main className="bg-white min-h-screen pt-20">
      <Navbar />
      <BlogDetail blog={blog} />
      <Footer />
    </main>
  );
}
