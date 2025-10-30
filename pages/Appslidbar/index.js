"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, Wallet, HandCoins, LayoutDashboard } from "lucide-react";
import { useRouter } from "next/router";

const Sidebar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { name: "Dashboard", icon: <LayoutDashboard size={20} />, href: "/Dashboard" },
        { name: "Income", icon: <Wallet size={20} />, href: "/Income" },
        { name: "Expense", icon: < HandCoins size={20} />, href: "/Expense" },
    ];

    function handleLogout() {
        localStorage.removeItem("token");
        router.push("/");
    }

    return (
        <>
        <div className="md:hidden flex items-center justify-between sm:pt-15 bg-white border-b border-purple-100 shadow-sm fixed top-0 left-0 w-full z-50 ">
        <div className="flex items-center gap-2 px-4">
        <h1 className="text-lg font-medium text-[#7f22fe]">ExpenseTracker</h1>
        </div>
        <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-600 hover:text-[#7f22fe] transition mr-2"
         >
        {isOpen ? <Menu size={24} /> : <Menu size={24} />}
        </button>
        </div>

        <div className={`
          fixed top-0 left-0 z-40 sm:h-160 md:h-full sm:mt-7 md:mt-0 w-60 bg-white border-r border-purple-200 shadow-md flex flex-col justify-between transform transition-transform duration-300 rounded-2xl 
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0`}
        >
        <div>
                    {/* Logo (Desktop) */}
                    <div className="hidden md:flex items-center gap-3 px-6 py-5 border-b border-purple-100">
                        <h1 className="text-xl font-medium text-[#7f22fe]">ExpenseTracker</h1>
                    </div>

                    {/* Nav Links */}
                    <nav className="mt-6 flex flex-col gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-6 py-3 text-sm font-medium rounded-lg mx-2 transition-all ${pathname === item.href
                                    ? "bg-purple-600 text-[#7f22fe] text-white"
                                    : "text-gray-600 hover:bg-purple-200 hover:text-[#7f22fe]"
                                    }`}
                                onClick={() => setIsOpen(false)}
                            >
                                <span className={`${pathname === item.href
                                    ? "bg-purple-600  text-white"
                                    : "text-purple-600 hover:bg-purple-100 hover:text-[#7f22fe]"
                                    }`}>{item.icon}</span>
                                {item.name}
                            </Link>
                        ))}
                    </nav>
        </div>

                {/* Footer */}
        <div className="border-t border-purple-100 p-4">
                    <button
                        className="flex items-center gap-2 px-4 py-2 w-full text-sm font-medium text-gray-600 hover:bg-purple-200 hover:text-[#7f22fe] rounded-lg transition"
                        onClick={handleLogout}
                    >
                        <LogOut size={18} className="text-[#7f22fe]" /> Logout
                    </button>
        </div>
        </div>
        {isOpen && (
        <div
        onClick={() => setIsOpen(false)}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden z-30"
        ></div>
        )}
        </>
    );
};

export default Sidebar;
