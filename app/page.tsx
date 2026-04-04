"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HomeContainer } from "@/containers/home";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans overflow-x-hidden">
      <Navbar />
      <HomeContainer />
      <Footer />
    </div>
  );
}
