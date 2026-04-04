"use client";

import Image from "next/image";
import { FadeIn } from "@/components/FadeIn";

/* Data */

const executiveBoard = [
  { name: "Gregorius Adhiyasta S.W", role: "President of INDOCOR ITS SC" },
];

const vicePresidentsAndSecretaries = [
  { name: "Fattah Rizkia Darmawan", role: "Vice President 1" },
  { name: "Christopher Thaddeus", role: "Vice President 2" },
  { name: "Ni Made Dwinna P", role: "Secretary" },
  { name: "Ni Kadek Dyah V", role: "Treasurer" },
];

const boardOfDirectors = [
  { name: "Aulia Bilbina Mardiana", role: "Director of Event & Relation" },
  { name: "Fauzan Akif Syamsudin", role: "Director of HRD" },
  { name: "M. Aufa Rifqi Zaidan", role: "Director of Research & Competition" },
  { name: "Sefilla Destia Putri", role: "Director of Branding & Marketing" },
  { name: "Anastasya Melody Litania", role: "Director of Finance" },
];

const boardOfManagers = [
  { name: "Alexa Zerlinda Mahendro", role: "Manager of Event" },
  { name: "Siti Aisyah", role: "Manager of External Relation" },
  { name: "Pradhana Tafindya Putra", role: "Manager of Staff Advance" },
  { name: "Dewi Yuliana", role: "Director of Member Development" },
  { name: "Aima Fazila Radhiyana", role: "Manager of SMM" },
  { name: "Elisabeth Anna Andaru P", role: "Manager of Creative" },
  { name: "Muhammad Falah K", role: "Manager of Web Development" },
  { name: "Johan Alwi Guevara H", role: "Manager of Competition Development" },
  { name: "Reni Nurdiana", role: "Manager of Research & Scientific" },
  { name: "Shahra Habiba", role: "Manager of Fundraising" },
  { name: "Fiona Keyne Shifa P", role: "Manager of Sponsorship" },
];

/* Sub-components */

function TeamMemberCard({ name, role }: { name: string; role: string }) {
  return (
    <div className="flex flex-col items-center sm:items-start text-center sm:text-left group w-full">
      <div className="relative w-full aspect-[4/5] mb-4 overflow-hidden rounded-md bg-gray-200">
        <Image
          src="/images/our-team/cuma-dummy.jpeg"
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </div>
      <h3 className="font-bold text-gray-900 text-sm md:text-base tracking-tight mb-0.5 w-full">
        {name}
      </h3>
      <p className="text-[11px] md:text-xs text-gray-500 font-medium w-full">
        {role}
      </p>
    </div>
  );
}

export default function OurTeam() {
  return (
    <main className="bg-white text-black min-h-screen pt-20">
      {/* Hero */}
      <section className="relative w-full h-[40vh] md:h-[60vh] lg:h-[70vh] bg-gray-100">
        <Image
          src="/images/our-team/our-team.JPG"
          alt="INDOCOR ITS SC Team"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Gradient overlap */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </section>

      {/* Team Section */}
      <section className="py-20 md:py-28 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
        {/* Header */}
        <FadeIn direction="up">
          <div className="text-center mb-20">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 mb-3">
              The People Behind the Vision
            </h1>
            <p className="text-lg md:text-xl text-gray-500 font-light">
              Driven by Passion, Built on Expertise
            </p>
          </div>
        </FadeIn>

        {/* President */}
        <FadeIn direction="up" delay={0.1}>
          <div className="flex justify-center mb-16">
            <div className="w-full max-w-[280px] sm:max-w-[320px]">
              {executiveBoard.map((member) => (
                <TeamMemberCard key={member.name} {...member} />
              ))}
            </div>
          </div>
        </FadeIn>

        {/* VP & Secretaries */}
        <FadeIn direction="up" delay={0.2}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-24">
            {vicePresidentsAndSecretaries.map((member) => (
              <TeamMemberCard key={member.name} {...member} />
            ))}
          </div>
        </FadeIn>

        {/* Directors */}
        <FadeIn direction="up" delay={0.3}>
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
              Board of Director
            </h2>
          </div>
        </FadeIn>

        <FadeIn direction="up" delay={0.4}>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {boardOfDirectors.map((member) => (
              <div
                key={member.name}
                className="w-[calc(50%-12px)] lg:w-[calc(25%-24px)] max-w-[320px]"
              >
                <TeamMemberCard {...member} />
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Managers */}
        <FadeIn direction="up" delay={0.5}>
          <div className="text-center mb-12 mt-20">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
              Board of Manager
            </h2>
          </div>
        </FadeIn>

        <FadeIn direction="up" delay={0.6}>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {boardOfManagers.map((member) => (
              <div
                key={member.name}
                className="w-[calc(50%-12px)] lg:w-[calc(25%-24px)] max-w-[320px]"
              >
                <TeamMemberCard {...member} />
              </div>
            ))}
          </div>
        </FadeIn>
      </section>
    </main>
  );
}
