import RegisterSCCPPelunasan from "@/containers/register/RegisterSCCPPelunasan";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Pelunasan SCCP 2026 | INDOCOR ITS Student Chapter",
  description:
    "Formulir pelunasan Termin 2 untuk program Student Corrosion Certification Program (SCCP) 2026.",
};

export default function RegisterSccpPelunasanPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans overflow-x-hidden">
      <Navbar />
      <RegisterSCCPPelunasan />
      <Footer />
    </div>
  );
}
