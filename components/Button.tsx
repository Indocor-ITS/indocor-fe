"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface ButtonProps {
    href?: string;
    onClick?: () => void;
    children: ReactNode;
    className?: string;
    variant?: "primary" | "secondary" | "outline";
}

export default function Button({
    href,
    onClick,
    children,
    className = "",
    variant = "primary",
}: ButtonProps) {
    const baseStyles =
        "inline-flex items-center justify-center px-6 py-3 font-medium transition-all duration-300 rounded-[6px] hover:rounded-[32px] w-max";

    const variants = {
        primary: "bg-[#9FFF66] hover:bg-[#8cee54] text-gray-900 shadow-sm",
        secondary: "bg-forest hover:bg-forest/90 text-white shadow-sm",
        outline: "border border-gray-300 hover:border-forest text-gray-800",
    };

    const buttonClass = `${baseStyles} ${variants[variant]} ${className}`;

    if (href) {
        return (
            <Link href={href} className={buttonClass}>
                {children}
            </Link>
        );
    }

    return (
        <button onClick={onClick} className={buttonClass}>
            {children}
        </button>
    );
}
