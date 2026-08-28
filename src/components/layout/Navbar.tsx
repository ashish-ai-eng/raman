"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navbar: React.FC = () => {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Interactive Stage" },
    { href: "/teacher/agent-builder", label: "Teacher AI Studio" },
    { href: "/teacher", label: "Teacher Dashboard" },
    { href: "/student/lab/pendulum-101", label: "Student Lab Runner" },
    { href: "/student/rewards", label: "Sticker Album 🏆" },
  ];

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center font-black text-white text-sm shadow">
            ⚛
          </div>
          <span className="font-extrabold text-base tracking-tight text-white">
            PhysLab<span className="text-brand-400 font-semibold">Studio</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${
                  isActive
                    ? "bg-brand-600 text-white shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono bg-slate-800 text-emerald-400 border border-slate-700 px-2.5 py-0.5 rounded-full">
            v1.0 Ready
          </span>
        </div>
      </div>
    </header>
  );
};
