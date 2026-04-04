"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
    LayoutDashboard,
    FileText,
    CalendarDays,
    LogOut,
    Menu,
    X,
    ChevronRight,
    Shield,
    Users,
} from "lucide-react";

const navItems = [
    { href: "/superadmin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/superadmin/articles", label: "Review Artikel", icon: FileText },
    { href: "/superadmin/activities", label: "Review Kegiatan", icon: CalendarDays },
    { href: "/superadmin/admins", label: "Kelola Admin", icon: Users },
];

export default function SuperAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

    useEffect(() => {
        const auth = localStorage.getItem("superadmin_logged_in");
        if (pathname === "/superadmin/login") {
            setIsLoggedIn(true);
            return;
        }
        if (!auth) {
            router.replace("/superadmin/login");
        } else {
            setIsLoggedIn(true);
        }
    }, [pathname, router]);

    const handleLogout = () => {
        localStorage.removeItem("superadmin_logged_in");
        localStorage.removeItem("superadmin_user");
        router.replace("/superadmin/login");
    };

    // Login page — no sidebar
    if (pathname === "/superadmin/login") {
        return <>{children}</>;
    }

    // Loading state
    if (isLoggedIn === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-950">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-gray-950 text-white flex flex-col transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                    }`}
            >
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
                    <Link href="/superadmin" className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-extrabold text-sm">
                            <Shield size={16} />
                        </div>
                        <span className="text-lg font-bold tracking-tight">
                            Super Admin
                        </span>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-gray-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-4 py-6 space-y-1">
                    {navItems.map((item) => {
                        const isActive =
                            pathname === item.href ||
                            (item.href !== "/superadmin" && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                <item.icon size={20} />
                                <span>{item.label}</span>
                                {isActive && (
                                    <ChevronRight size={16} className="ml-auto" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="px-4 py-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all w-full"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main area */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Top bar */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 gap-4 sticky top-0 z-30">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden text-gray-600 hover:text-gray-900"
                    >
                        <Menu size={24} />
                    </button>
                    <div className="flex-1" />
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-sm font-bold">
                            <Shield size={16} />
                        </div>
                        <span className="text-sm font-medium text-gray-700 hidden sm:block">
                            Super Admin
                        </span>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-6 md:p-8">{children}</main>
            </div>
        </div>
    );
}
