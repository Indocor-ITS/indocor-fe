import AboutUs from "@/containers/about/AboutUs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
    title: "About Us | INDOCOR ITS Student Chapter",
    description:
        "Mengenal INDOCOR (Asosiasi Korosi Indonesia) dan INDOCOR ITS SC — organisasi profesi korosi nasional dan student chapter-nya di Institut Teknologi Sepuluh Nopember.",
};

export default function AboutUsPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col font-sans overflow-x-hidden">
            <Navbar />
            <AboutUs />
            <Footer />
        </div>
    );
}
