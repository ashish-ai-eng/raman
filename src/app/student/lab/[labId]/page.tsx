"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { LabSpec } from "@/types/labSpec";
import { simplePendulumPreset, vernierCaliperPreset } from "@/lib/engine/presets";
import { DynamicWidgetRunner } from "@/components/widgets/DynamicWidgetRunner";
import { UniversalGrapher } from "@/components/student/UniversalGrapher";
import { verifyStepAnswer } from "@/lib/gamification/stepVerifier";
import { Point } from "@/lib/engine/regression";

const AVAILABLE_LABS: Record<string, LabSpec> = {
  "pendulum-101": {
    id: "pendulum-101",
    title: "Simple Pendulum — Acceleration Due to Gravity (g)",
    topic: "Mechanics & Oscillations",
    conceptSummary: "Log period T vs length L observations, plot T² vs L, and derive acceleration due to gravity g.",
    funFacts: ["A pendulum clock relies on the constant period T = 2π√(L/g)!"],
    widget: simplePendulumPreset,
    observationSchema: {
      parametersToRecord: ["string_length_L", "time_period", "period_squared"],
      calculatedValues: [],
      graphConfig: {
        xAxisKey: "string_length_L",
        yAxisKey: "period_squared",
        xAxisLabel: "Length L (m)",
        yAxisLabel: "Period T² (s²)",
        extractedConstantLabel: "Acceleration due to gravity (g)",
        extractedConstantFormula: "(4 * PI * PI) / slope",
      },
    },
    steps: [
      {
        stepNumber: 1,
        instruction: "Set string length L = 1.0 m. Log trial reading and enter calculated period T.",
        idealAnswerType: "numeric",
        idealAnswerFormulaOrValue: 2.01,
        tolerancePercent: 5,
        hint: "Observe stopwatch total time t for N = 10 oscillations.",
      },
    ],
    challenges: [],
    status: "published",
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

export default function StudentLabRunnerPage() {
  const params = useParams();
  const routeLabId = (params?.labId as string) || "pendulum-101";
  const [activeLabId, setActiveLabId] = useState<string>(
    AVAILABLE_LABS[routeLabId] ? routeLabId : "pendulum-101"
  );

  const activeLab = AVAILABLE_LABS[activeLabId] || AVAILABLE_LABS["pendulum-101"];

  const [activeState, setActiveState] = useState<any>(null);
  const [loggedPoints, setLoggedPoints] = useState<Point[]>([]);
  const [studentAnswer, setStudentAnswer] = useState("");
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [showRewardModal, setShowRewardModal] = useState(false);

  const currentL = activeState?.inputs?.string_length_L ?? activeState?.inputs?.hanging_mass_m ?? activeState?.inputs?.specimen_dimension ?? 0.8;
  const currentT2 = activeState?.outputs?.period_sq ?? activeState?.outputs?.period_squared ?? activeState?.outputs?.observed ?? activeState?.outputs?.stretch_x ?? 3.22;

  const handleLogTrial = () => {
    const newPoint: Point = {
      x: currentL,
      y: currentT2,
    };
    setLoggedPoints((prev) => [...prev, newPoint]);
  };

  const handleVerifyStep = () => {
    const step = activeLab.steps[0];
    if (!step) return;
    const result = verifyStepAnswer(
      studentAnswer,
      Number(step.idealAnswerFormulaOrValue),
      step.tolerancePercent
    );
    setVerificationResult(result);
    if (result.isCorrect) {
      setShowRewardModal(true);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Student Interactive Physics Lab Runner</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Select an assigned lab below to run experiments, record data, plot graphs, and submit answers.
          </p>
        </div>

        <Link
          href="/student/rewards"
          className="bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <span>🏆 View Sticker Album & Badges</span>
        </Link>
      </div>

      {/* Available Student Lab Selector Cards */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Assigned Physics Labs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.values(AVAILABLE_LABS).map((lab) => {
            const isSelected = lab.id === activeLabId;
            return (
              <div
                key={lab.id}
                onClick={() => {
                  setActiveLabId(lab.id);
                  setLoggedPoints([]);
                  setStudentAnswer("");
                  setVerificationResult(null);
                }}
                className={`cursor-pointer rounded-xl p-4 border transition-all shadow-sm flex flex-col justify-between ${
                  isSelected
                    ? "bg-brand-50 border-brand-500 ring-2 ring-brand-500/20"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-600 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded">
                      {lab.topic}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">{lab.title}</h3>
                  </div>
                  {isSelected && (
                    <span className="text-[10px] font-bold bg-brand-600 text-white px-2 py-0.5 rounded-full shrink-0">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  {lab.conceptSummary}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Lab Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex justify-between items-center shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded">
              Active Student Lab
            </span>
            <span className="text-xs font-mono text-slate-400">ID: {activeLab.id}</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">{activeLab.title}</h2>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Widget & Logger */}
        <div className="lg:col-span-7 space-y-6">
          <DynamicWidgetRunner
            spec={activeLab.widget}
            onStateChange={(state) => setActiveState(state)}
          />

          {/* Observation Logger Controls */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Observation Data Logger Table</h3>
                <p className="text-xs text-slate-500">Capture trial snapshots to plot linear regression.</p>
              </div>
              <button
                onClick={handleLogTrial}
                className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-sm transition-colors"
              >
                + Log Current Trial (X={currentL}, Y={currentT2})
              </button>
            </div>

            {/* Logged Readings Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-slate-200 rounded-lg">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase border-b">
                  <tr>
                    <th className="p-2.5">Trial #</th>
                    <th className="p-2.5">{activeLab.observationSchema.graphConfig.xAxisLabel}</th>
                    <th className="p-2.5">{activeLab.observationSchema.graphConfig.yAxisLabel}</th>
                  </tr>
                </thead>
                <tbody>
                  {loggedPoints.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="p-4 text-center text-slate-400 italic">
                        No trials logged yet. Adjust controls and click &quot;Log Current Trial&quot;.
                      </td>
                    </tr>
                  ) : (
                    loggedPoints.map((p, idx) => (
                      <tr key={idx} className="border-b hover:bg-slate-50">
                        <td className="p-2.5 font-bold text-slate-700">Trial {idx + 1}</td>
                        <td className="p-2.5 font-mono text-brand-600">{p.x}</td>
                        <td className="p-2.5 font-mono text-emerald-600">{p.y}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Universal Grapher & Step Verifier */}
        <div className="lg:col-span-5 space-y-6">
          {/* Scatter Plot & Linear Regression Overlay */}
          <UniversalGrapher
            points={loggedPoints}
            xAxisLabel={activeLab.observationSchema.graphConfig.xAxisLabel}
            yAxisLabel={activeLab.observationSchema.graphConfig.yAxisLabel}
            constantFormula={activeLab.observationSchema.graphConfig.extractedConstantFormula}
            constantLabel={activeLab.observationSchema.graphConfig.extractedConstantLabel}
          />

          {/* Guided Step Checkpoint */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Guided Step Checkpoint
            </h3>
            <p className="text-xs font-semibold text-slate-800">
              {activeLab.steps[0]?.instruction}
            </p>

            <div className="flex gap-2">
              <input
                type="number"
                step="0.01"
                value={studentAnswer}
                onChange={(e) => setStudentAnswer(e.target.value)}
                placeholder="Enter period T in seconds..."
                className="flex-1 text-xs border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                onClick={handleVerifyStep}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors"
              >
                Verify Answer
              </button>
            </div>

            {verificationResult && (
              <div
                className={`text-xs p-3 rounded-lg border font-medium ${
                  verificationResult.isCorrect
                    ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                    : "bg-rose-50 text-rose-800 border-rose-300"
                }`}
              >
                {verificationResult.message}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reward Unlock Modal */}
      {showRewardModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-amber-300 rounded-2xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="w-20 h-20 mx-auto rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-4xl shadow-inner">
              🏆
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                Sticker Badge Unlocked!
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-2">Galileo&apos;s Heir</h3>
              <p className="text-xs text-slate-500 mt-1">
                You correctly measured the pendulum period and verified gravity g within tolerance limits!
              </p>
            </div>

            <button
              onClick={() => setShowRewardModal(false)}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs py-2.5 rounded-xl shadow-md transition-colors"
            >
              Collect Sticker & Continue
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
