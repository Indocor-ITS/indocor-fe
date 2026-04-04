import { Metadata } from "next";
import { notFound } from "next/navigation";
import EventDetail from "@/containers/event/EventDetail";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import supabase from "@/lib/db";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const { data } = await supabase
      .from("events")
      .select("title, section1_text")
      .eq("slug", slug)
      .single();

    if (!data) {
      return { title: "Kegiatan Tidak Ditemukan - INDOCOR ITS SC" };
    }

    return {
      title: `${data.title} - INDOCOR ITS SC`,
      description: data.section1_text
        ? data.section1_text.substring(0, 160)
        : undefined,
    };
  } catch {
    return { title: "Event - INDOCOR ITS SC" };
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!data) {
    notFound();
  }

  const event = {
    id: String(data.id),
    slug: data.slug,
    title: data.title,
    date: data.date,
    image_main: data.image_main,
    section1_text: data.section1_text || "",
    image_support1: data.image_support1 || "",
    section2_text: data.section2_text || "",
    image_support2: data.image_support2 || "",
    section3_text: data.section3_text || "",
  };

  return (
    <main className="bg-white min-h-screen pt-20">
      <Navbar />
      <EventDetail event={event} />
      <Footer />
    </main>
  );
}
