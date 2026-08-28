"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LabSpec } from "@/types/labSpec";
import { simplePendulumPreset, opticsBenchPreset, ohmsLawPreset } from "@/lib/engine/presets";

// Initial sample seed labs for Teacher Dashboard
const INITIAL_LABS: LabSpec[] = [
  {
    id: "pendulum-101",
    title: "Simple Pendulum — Acceleration Due to Gravity (g)",
    topic: "Mechanics & Oscillations",
    conceptSummary: "Investigate period T versus string length L to derive g from slope m = 4π²/g.",
    funFacts: ["Galileo discovered pendulum period constancy watching a swinging cathedral lamp!"],
    widget: simplePendulumPreset,
    observationSchema: {
      parametersToRecord: ["string_length_L", "time_period"],
      calculatedValues: [],
      graphConfig: {
        xAxisKey: "string_length_L",
        yAxisKey: "period_squared",
        xAxisLabel: "Length L (m)",
        yAxisLabel: "Period T² (s²)",
        expectedSlopeFormula: "(4 * PI * PI) / 9.81",
        extractedConstantLabel: "Gravity g",
        extractedConstantFormula: "(4 * PI * PI) / slope",
      },
    },
    steps: [
      {
        stepNumber: 1,
        instruction: "Set string length L = 1.0 m, measure time for 10 oscillations, and record period T.",
        idealAnswerType: "numeric",
        idealAnswerFormulaOrValue: 2.01,
        tolerancePercent: 5,
        hint: "Observe stopwatch total time t and divide by N = 10.",
      },
    ],
    challenges: [
      {
        id: "pendulum-master",
        description: "Log 5 trials at different string lengths L.",
        requirementType: "trials_logged",
        targetCount: 5,
        stickerReward: {
          id: "badge-galileo",
          name: "Galileo's Heir",
          description: "Master of simple pendulum oscillations",
          icon: "galileo.svg",
        },
      },
    ],
    status: "published",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "optics-201",
    title: "Optics Bench — Convex Lens Focal Length (f)",
    topic: "Geometric Optics",
    conceptSummary: "Determine focal length f using object distance u and image distance v relationship.",
    funFacts: ["Convex lenses form real inverted images when u > f!"],
    widget: opticsBenchPreset,
    observationSchema: {
      parametersToRecord: ["object_distance_u", "image_distance_v"],
      calculatedValues: [],
      graphConfig: {
        xAxisKey: "inv_u",
        yAxisKey: "inv_v",
        xAxisLabel: "1/u (cm⁻¹)",
        yAxisLabel: "1/v (cm⁻¹)",
        extractedConstantLabel: "Focal Length f",
        extractedConstantFormula: "1 / intercept",
      },
    },
    steps: [
      {
        stepNumber: 1,
        instruction: "Set object distance u to 30 cm and record image distance v on screen.",
        idealAnswerType: "numeric",
        idealAnswerFormulaOrValue: 30,
        tolerancePercent: 5,
        hint: "Adjust screen position until image is sharp.",
      },
    ],
    challenges: [],
    status: "draft",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function TeacherDashboard() {
  const [labs] = useState<LabSpec[]>(INITIAL_LABS);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Teacher Physics Studio & Lab Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Author AI physics labs, verify ground-truth math, and release verified assignments to students.
          </p>
        </div>

        <Link
          href="/teacher/agent-builder"
          className="bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg shadow-sm transition-colors flex items-center gap-2"
        >
          <span>+ Create New Lab in AI Studio</span>
        </Link>
      </div>

      {/* Lab List Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <span>My Physics Lab Assignments</span>
          <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-semibold">
            {labs.length}
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {labs.map((lab) => (
            <div
              key={lab.id}
              className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold uppercase tracking-wider text-brand-600 bg-brand-50 border border-brand-200 px-2.5 py-0.5 rounded-md">
                    {lab.topic}
                  </span>
                  <span
                    className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                      lab.status === "published"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                        : "bg-amber-50 text-amber-700 border-amber-300"
                    }`}
                  >
                    {lab.status === "published" ? "● Released" : "○ Draft"}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900">{lab.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {lab.conceptSummary}
                </p>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">
                  ID: {lab.id}
                </span>

                <div className="flex gap-2">
                  <Link
                    href={`/teacher/sandbox/${lab.id}`}
                    className="text-xs font-semibold text-brand-600 hover:text-brand-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3.5 py-2 rounded-lg transition-colors"
                  >
                    Inspect Sandbox & Verify →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
