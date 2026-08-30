"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { LabSpec } from "@/types/labSpec";
import { simplePendulumPreset, vernierCaliperPreset } from "@/lib/engine/presets";
import { DynamicWidgetRunner } from "@/components/widgets/DynamicWidgetRunner";

const LAB_STORE: Record<string, LabSpec> = {
  "pendulum-101": {
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
    status: "draft",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "vernier-201": {
    id: "vernier-201",
    title: "Vernier Caliper — Precision Length & Thickness Measurement",
    topic: "Vernier Measurement",
    conceptSummary: "Determine dimension of a specimen using main scale reading (MSR) and vernier scale division (VSD).",
    funFacts: ["Vernier calipers resolve measurements down to 0.1 mm or 0.01 cm!"],
    widget: vernierCaliperPreset,
    observationSchema: {
      parametersToRecord: ["msr", "vsd"],
      calculatedValues: [],
      graphConfig: {
        xAxisKey: "specimen_dimension",
        yAxisKey: "corrected",
        xAxisLabel: "Dimension (cm)",
        yAxisLabel: "Measured Reading (cm)",
      },
    },
    steps: [
      {
        stepNumber: 1,
        instruction: "Adjust specimen dimension and record Main Scale Reading (MSR) and Vernier Scale Division (VSD).",
        idealAnswerType: "numeric",
        idealAnswerFormulaOrValue: 2.34,
        tolerancePercent: 5,
        hint: "Align vernier mark accurately with main scale mark.",
      },
    ],
    challenges: [],
    status: "published",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

export default function VerificationSandboxPage() {
  const params = useParams();
  const labId = (params?.labId as string) || "pendulum-101";
  const [lab, setLab] = useState<LabSpec>(LAB_STORE[labId] || LAB_STORE["pendulum-101"]);
  const [publishing, setPublishing] = useState(false);
  const [accessCode, setAccessCode] = useState<string | null>(null);

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const res = await fetch("/api/labs/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ labId: lab.id }),
      });
      const data = await res.json();
      if (data.lab) {
        setLab(data.lab);
        setAccessCode(data.accessCode);

        // Update local storage so teacher dashboard reflects published status
        try {
          const stored = localStorage.getItem("philab_published_ids");
          const ids = stored ? JSON.parse(stored) : [];
          if (!ids.includes(labId)) {
            ids.push(labId);
            localStorage.setItem("philab_published_ids", JSON.stringify(ids));
          }
        } catch {
          // ignore localStorage errors
        }
      }
    } catch {
      alert("Failed to publish lab.");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/teacher" className="text-xs text-brand-600 font-semibold hover:underline">
              ← Back to Dashboard
            </Link>
            <span className="text-xs text-slate-300">|</span>
            <span className="text-xs font-mono text-slate-400">ID: {lab.id}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">{lab.title}</h1>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
              lab.status === "published"
                ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                : "bg-amber-50 text-amber-700 border-amber-300"
            }`}
          >
            {lab.status === "published" ? "● Released to Students" : "○ Verification Sandbox"}
          </span>

          {lab.status !== "published" && (
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition-colors"
            >
              {publishing ? "Publishing..." : "Approve & Release to Students"}
            </button>
          )}
        </div>
      </div>

      {accessCode && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Lab Successfully Released!
            </span>
            <p className="text-xs text-emerald-700 mt-0.5">
              Share this access code with your students to launch the assignment.
            </p>
          </div>
          <div className="bg-white border border-emerald-300 text-emerald-900 font-mono font-bold text-lg px-4 py-1.5 rounded-lg">
            {accessCode}
          </div>
        </div>
      )}

      {/* Grid: Interactive Sandbox (Left) + Ground-Truth Rubric Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive Physics Sandbox */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 text-white px-4 py-2.5 rounded-t-xl flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Interactive Physics Sandbox Test
            </span>
            <span className="text-[11px] text-emerald-400 font-mono">
              Deterministic Math Verified
            </span>
          </div>

          <div className="flex justify-center">
            <DynamicWidgetRunner spec={lab.widget} />
          </div>
        </div>

        {/* Ground-Truth Rubric & Step Inspector */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Ground-Truth Rubric & Verification
            </h3>
            <p className="text-xs text-slate-600">
              Inspect ideal answer formulas, tolerances, and Socratic hints.
            </p>
          </div>

          {/* Steps Inspector */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-700 uppercase">
              Guided Step Instructions ({lab.steps.length})
            </h4>
            {lab.steps.map((step) => (
              <div key={step.stepNumber} className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2 text-xs">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>Step {step.stepNumber}</span>
                  <span className="text-brand-600 bg-brand-50 border border-brand-200 px-1.5 py-0.5 rounded text-[10px]">
                    Tolerance ±{step.tolerancePercent ?? 5}%
                  </span>
                </div>
                <p className="text-slate-700">{step.instruction}</p>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-slate-600">
                  <span>Ideal Answer: <strong className="text-slate-900">{step.idealAnswerFormulaOrValue}</strong></span>
                  <span className="italic text-slate-500">Hint: {step.hint}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Graph Config Inspector */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-semibold text-slate-700 uppercase">
              Graphing Configuration
            </h4>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1 text-xs text-slate-700">
              <div>X-Axis: <strong className="text-slate-900">{lab.observationSchema.graphConfig.xAxisLabel}</strong></div>
              <div>Y-Axis: <strong className="text-slate-900">{lab.observationSchema.graphConfig.yAxisLabel}</strong></div>
              {lab.observationSchema.graphConfig.extractedConstantLabel && (
                <div>Extracted Constant: <strong className="text-brand-600">{lab.observationSchema.graphConfig.extractedConstantLabel}</strong></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
