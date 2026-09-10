import RegisterSCCP from "@/containers/register/RegisterSCCP";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Daftar SCCP 2026 | INDOCOR ITS Student Chapter",
  description:
    "Formulir pendaftaran untuk program Student Corrosion Certification Program (SCCP) 2026.",
};

export default function RegisterSccpPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans overflow-x-hidden">
      <Navbar />
      <RegisterSCCP />
      <Footer />
    </div>
  );
}
