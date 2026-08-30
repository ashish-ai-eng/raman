"use client";

import React, { useState } from "react";
import { UniversalPhysicsSpec, UPREquation } from "@/types/upr";
import { CORE_EXPERIMENTAL_PRESETS } from "@/presets";
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

  const presetList = Object.values(CORE_EXPERIMENTAL_PRESETS);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Teacher Generative AI Studio — Custom Physics Lab & Widget Authoring
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Select an available experiment preset or converse with the AI Assistant.
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

      {/* Available Presets Grid Cards */}
      <div className="space-y-2">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
          Available Experiment Presets
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {presetList.map((preset) => {
            const isSelected = activeSpec.id.startsWith(preset.id) || activeSpec.name === preset.name;
            return (
              <div
                key={preset.id}
                onClick={() => setActiveSpec(preset)}
                className={`cursor-pointer rounded-xl p-4 border transition-all shadow-sm hover:shadow-md flex flex-col justify-between ${
                  isSelected
                    ? "bg-brand-50/80 border-brand-500 ring-2 ring-brand-500/20"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-bold text-slate-900 text-xs">{preset.name}</h3>
                    {isSelected && (
                      <span className="text-[10px] font-bold bg-brand-600 text-white px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-snug">
                    {preset.description}
                  </p>
                </div>
                <div className="mt-3 text-[10px] text-slate-500 font-mono flex items-center gap-2">
                  <span>ID: {preset.id}</span>
                </div>
              </div>
            );
          })}
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
