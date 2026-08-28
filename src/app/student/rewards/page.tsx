"use client";

import React from "react";
import Link from "next/link";

interface StickerBadge {
  id: string;
  name: string;
  category: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
  icon: string;
}

const BADGES: StickerBadge[] = [
  {
    id: "badge-galileo",
    name: "Galileo's Heir",
    category: "Mechanics",
    description: "Completed Simple Pendulum trial logging and slope analysis.",
    unlocked: true,
    unlockedAt: "Today",
    icon: "⏱️",
  },
  {
    id: "badge-precision",
    name: "Precision Master",
    category: "Calibration",
    description: "Correctly accounted for instrument zero-error calibration 3 times.",
    unlocked: true,
    unlockedAt: "Today",
    icon: "📐",
  },
  {
    id: "badge-optics",
    name: "Optics Apprentice",
    category: "Optics",
    description: "Plotted 1/v vs 1/u lens formula graph and derived focal length f.",
    unlocked: false,
    icon: "🔍",
  },
  {
    id: "badge-ohms",
    name: "Ohm's Peer",
    category: "Electricity",
    description: "Verified V = I * R relationship across 5 circuit trials.",
    unlocked: false,
    icon: "⚡",
  },
];

export default function StickerAlbumPage() {
  const unlockedCount = BADGES.filter((b) => b.unlocked).length;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-10 space-y-8 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/student/lab/pendulum-101" className="text-xs text-brand-600 font-semibold hover:underline">
              ← Back to Active Lab
            </Link>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Student Physics Sticker Album & Rewards
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Earn collectible physics badges by mastering zero error calibration, trial logging, and slope graphing!
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-300 rounded-xl px-4 py-2 flex items-center gap-3">
          <span className="text-2xl">🏆</span>
          <div>
            <div className="text-xs font-bold text-amber-800 uppercase">Unlocked Badges</div>
            <div className="text-lg font-extrabold text-amber-900">
              {unlockedCount} / {BADGES.length}
            </div>
          </div>
        </div>
      </div>

      {/* Sticker Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {BADGES.map((badge) => (
          <div
            key={badge.id}
            className={`rounded-xl border p-5 transition-all flex flex-col justify-between space-y-4 ${
              badge.unlocked
                ? "bg-white border-amber-300 shadow-md ring-2 ring-amber-400/30"
                : "bg-slate-100 border-slate-200 opacity-60 grayscale"
            }`}
          >
            <div className="space-y-3 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-3xl shadow-inner">
                {badge.icon}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                  {badge.category}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-2">{badge.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-1">{badge.description}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-center">
              {badge.unlocked ? (
                <span className="text-xs font-bold text-emerald-600 flex items-center justify-center gap-1">
                  ✓ Unlocked ({badge.unlockedAt})
                </span>
              ) : (
                <span className="text-xs font-semibold text-slate-400">🔒 Complete Lab to Unlock</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
