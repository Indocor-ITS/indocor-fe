import Link from "next/link";
import { Mail, MapPin, Instagram, Linkedin, Youtube } from "lucide-react";

const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Tentang Kami", href: "/about" },
  { label: "Kegiatan", href: "/activities" },
  { label: "Tim", href: "/team" },
];

const programLinks = [
  { label: "Sertifikasi ICCP", href: "/register-iccp" },
  { label: "Blog & Artikel", href: "/artikel" },
  { label: "Coming Soon", href: "/coming-soon" },
];

const socials = [
  {
    icon: Instagram,
    href: "https://instagram.com/indocor_its",
    label: "Instagram",
  },
  {
    icon: Linkedin,
    href: "https://linkedin.com/company/indocor-its",
    label: "LinkedIn",
  },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="relative w-full bg-gray-50 text-gray-500 border-t border-gray-200 overflow-hidden">
      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand column */}
        <div className="sm:col-span-2 lg:col-span-1 space-y-5">
          <Link href="/" className="inline-flex flex-row items-center gap-3">
            <img
              src="/images/logo/logo-besar.svg"
              alt="INDOCOR ITS SC"
              className="h-12 w-auto"
            />
            <div className="flex flex-col leading-none">
              <span className="text-2xl font-extrabold text-black tracking-tight">
                INDOCOR
              </span>
              <span className="text-xs font-light text-gray-400 tracking-widest uppercase mt-1">
                ITS Student Chapter
              </span>
            </div>
          </Link>
          <p className="text-sm leading-relaxed max-w-xs">
            Indonesian Corrosion Association Student Chapter — mempersiapkan
            profesional muda di bidang teknik korosi for Indonesia dan dunia.
          </p>
          {/* Social icons */}
          <div className="flex items-center gap-4 pt-1">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-gray-200 hover:bg-[#9D0808] hover:text-white flex items-center justify-center transition-colors"
              >
                <Icon
                  size={16}
                  className="text-gray-600 group-hover:text-white"
                />
              </a>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="space-y-4">
          <h4 className="text-black font-semibold text-sm uppercase tracking-widest">
            Navigasi
          </h4>
          <ul className="space-y-2.5">
            {navLinks.map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="text-sm hover:text-black transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Programs */}
        <div className="space-y-4">
          <h4 className="text-black font-semibold text-sm uppercase tracking-widest">
            Program
          </h4>
          <ul className="space-y-2.5">
            {programLinks.map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="text-sm hover:text-black transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-4">
          <h4 className="text-black font-semibold text-sm uppercase tracking-widest">
            Kontak
          </h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <MapPin size={16} className="text-[#9D0808] shrink-0 mt-0.5" />
              <span className="text-sm leading-relaxed">
                Departemen Teknik Material dan Metalurgi,
                <br />
                Institut Teknologi Sepuluh Nopember,
                <br />
                Surabaya, Indonesia
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={16} className="text-[#9D0808] shrink-0" />
              <a
                href="mailto:indocor@its.ac.id"
                className="text-sm hover:text-black transition-colors"
              >
                indocor@its.ac.id
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
          <p className="text-gray-400">
            © {new Date().getFullYear()} INDOCOR ITS Student Chapter. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
