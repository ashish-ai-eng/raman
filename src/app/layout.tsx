import "./globals.css";
import React from "react";

export const metadata = {
  title: "PhysLab Studio",
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
        {children}
      </body>
    </html>
  );
}
