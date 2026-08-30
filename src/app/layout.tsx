import "./globals.css";
import React from "react";
import { Navbar } from "@/components/layout/Navbar";

export const metadata = {
  title: "PhiLab Studio",
  description: "Generative Physics Lab Studio & Interactive Companion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 min-h-screen">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
