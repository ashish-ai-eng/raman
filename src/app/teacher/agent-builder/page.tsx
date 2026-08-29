"use client";

import React, { useState } from "react";
import { UniversalPhysicsSpec, UPREquation } from "@/types/upr";
import { simplePendulumPreset } from "@/lib/engine/presets";
import { LabChatInterface } from "@/components/agent/LabChatInterface";
import { FormulaInspector } from "@/components/agent/FormulaInspector";
import { DynamicWidgetRunner } from "@/components/widgets/DynamicWidgetRunner";

export default function AgentBuilderPage() {
  const [activeSpec, setActiveSpec] = useState<UniversalPhysicsSpec>(simplePendulumPreset);
  const [activeTab, setActiveTab] = useState<"chat" | "formulas">("chat");

  const handleFormulaUpdate = (updatedEquations: Record<string, UPREquation>) => {
    setActiveSpec((prev) => ({
      ...prev,
      equations: updatedEquations,
    }));
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Teacher Generative AI Studio — Custom Physics Lab & Widget Authoring
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Converse with the AI Assistant to design custom physics experiments and supervise AI-generated math formulas.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("chat")}
            className={`text-xs font-bold px-3.5 py-1.5 rounded-lg border transition-colors ${
              activeTab === "chat"
                ? "bg-brand-600 text-white border-brand-700 shadow-sm"
                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
            }`}
          >
            💬 AI Assistant Chat
          </button>
          <button
            onClick={() => setActiveTab("formulas")}
            className={`text-xs font-bold px-3.5 py-1.5 rounded-lg border transition-colors ${
              activeTab === "formulas"
                ? "bg-brand-600 text-white border-brand-700 shadow-sm"
                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
            }`}
          >
            📐 Edit Physics Formulas
          </button>
        </div>
      </div>

      {/* Main Grid: AI Assistant / Formula Inspector (Left) + Hot-Reload Sandbox (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Drawer: Chat vs Formula Inspector */}
        <div className="lg:col-span-5 space-y-4">
          {activeTab === "chat" ? (
            <LabChatInterface
              currentSpec={activeSpec}
              onSpecUpdated={(newSpec) => setActiveSpec(newSpec)}
            />
          ) : (
            <FormulaInspector
              spec={activeSpec}
              onFormulaUpdate={handleFormulaUpdate}
            />
          )}
        </div>

        {/* Live Widget Preview Pane */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 text-white px-4 py-2.5 rounded-t-xl flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Live Animated Simulation Stage
            </span>
            <span className="text-[11px] text-brand-400 font-mono">
              Spec ID: {activeSpec.id}
            </span>
          </div>

          <div className="flex justify-center">
            <DynamicWidgetRunner key={activeSpec.id} spec={activeSpec} />
          </div>
        </div>
      </div>
    </main>
  );
}
