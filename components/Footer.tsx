import Link from "next/link";
import { Mail, MapPin, Instagram, Linkedin } from "lucide-react";
import React from "react";

const TiktokIcon = ({
  size = 24,
  className,
  ...props
}: React.SVGProps<SVGSVGElement> & { size?: number | string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill="currentColor"
    className={`bi bi-tiktok ${className || ""}`}
    viewBox="0 0 16 16"
    {...props}
  >
    <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z" />
  </svg>
);

const ShopeeIcon = ({
  size = 24,
  className,
  ...props
}: React.SVGProps<SVGSVGElement> & { size?: number | string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 109.59 122.88"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M74.98,91.98C76.15,82.36,69.96,76.22,53.6,71c-7.92-2.7-11.66-6.24-11.57-11.12 c0.33-5.4,5.36-9.34,12.04-9.47c4.63,0.09,9.77,1.22,14.76,4.56c0.59,0.37,1.01,0.32,1.35-0.2c0.46-0.74,1.61-2.53,2-3.17 c0.26-0.42,0.31-0.96-0.35-1.44c-0.95-0.7-3.6-2.13-5.03-2.72c-3.88-1.62-8.23-2.64-12.86-2.63c-9.77,0.04-17.47,6.22-18.12,14.47 c-0.42,5.95,2.53,10.79,8.86,14.47c1.34,0.78,8.6,3.67,11.49,4.57c9.08,2.83,13.8,7.9,12.69,13.81c-1.01,5.36-6.65,8.83-14.43,8.93 c-6.17-0.24-11.71-2.75-16.02-6.1c-0.11-0.08-0.65-0.5-0.72-0.56c-0.53-0.42-1.11-0.39-1.47,0.15c-0.26,0.4-1.92,2.8-2.34,3.43 c-0.39,0.55-0.18,0.86,0.23,1.2c1.8,1.5,4.18,3.14,5.81,3.97c4.47,2.28,9.32,3.53,14.48,3.72c3.32,0.22,7.5-0.49,10.63-1.81 C70.63,102.67,74.25,97.92,74.98,91.98L74.98,91.98z M54.79,7.18c-10.59,0-19.22,9.98-19.62,22.47h39.25 C74.01,17.16,65.38,7.18,54.79,7.18L54.79,7.18z M94.99,122.88l-0.41,0l-80.82-0.01h0c-5.5-0.21-9.54-4.66-10.09-10.19l-0.05-1 l-3.61-79.5v0C0,32.12,0,32.06,0,32c0-1.28,1.03-2.33,2.3-2.35l0,0h25.48C28.41,13.15,40.26,0,54.79,0s26.39,13.15,27.01,29.65 h25.4h0.04c1.3,0,2.35,1.05,2.35,2.35c0,0.04,0,0.08,0,0.12v0l-3.96,79.81l-0.04,0.68C105.12,118.21,100.59,122.73,94.99,122.88 L94.99,122.88z" />
  </svg>
);

const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Tentang Kami", href: "/about" },
  { label: "Kegiatan", href: "/activities" },
  { label: "Tim", href: "/team" },
];

const programLinks = [
  { label: "Sertifikasi SCCP", href: "/register-iccp" },
  { label: "Blog & Artikel", href: "/artikel" },
  { label: "Coming Soon", href: "/coming-soon" },
];

const socials = [
  {
    icon: Instagram,
    href: "https://www.instagram.com/indocoritssc/",
    label: "Instagram",
  },
  {
    icon: Linkedin,
    href: "https://www.linkedin.com/company/indocorits-sc/posts/?feedView=all",
    label: "LinkedIn",
  },
  {
    icon: TiktokIcon,
    href: "https://www.tiktok.com/@indocoritssc",
    label: "TikTok",
  },
  {
    icon: ShopeeIcon,
    href: "https://shopee.co.id/indocor_its",
    label: "Shopee",
  },
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
