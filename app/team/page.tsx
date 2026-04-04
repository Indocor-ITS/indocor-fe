import OurTeam from "@/containers/team/OurTeam";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
    title: "Our Team | INDOCOR ITS Student Chapter",
    description: "Meet the people behind INDOCOR ITS SC. Driven by Passion, Built on Expertise.",
};

export default function OurTeamPage() {
    return (
        <div className="min-h-screen bg-white flex flex-col font-sans overflow-x-hidden">
            <Navbar />
            <OurTeam />
            <Footer />
        </div>
    );
}
