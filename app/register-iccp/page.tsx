import RegisterICCP from "@/containers/register/RegisterICCP";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
    title: "Daftar ICCP 2026 | INDOCOR ITS Student Chapter",
    description: "Formulir pendaftaran untuk program sertifikasi Indonesia Corrosion Certification Project (ICCP) 2026.",
};

export default function RegisterIccpPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans overflow-x-hidden">
            <Navbar />
            <RegisterICCP />
            <Footer />
        </div>
    );
}
