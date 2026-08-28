"use client";

import React, { useState } from "react";
import { UniversalPhysicsSpec } from "@/types/upr";
import { simplePendulumPreset } from "@/lib/engine/presets";
import { LabChatInterface } from "@/components/agent/LabChatInterface";
import { DynamicWidgetRunner } from "@/components/widgets/DynamicWidgetRunner";

export default function AgentBuilderPage() {
  const [activeSpec, setActiveSpec] = useState<UniversalPhysicsSpec>(simplePendulumPreset);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Teacher AI Studio — Widget & Lab Creator
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Converse with the AI Assistant to design and customize any 2D interactive physics simulation.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-300">
            ● Live Sandbox Active
          </span>
        </div>
      </div>

      {/* Grid: Chat Interface (Left) + Live Hot-Reloading Sandbox (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Chat Drawer */}
        <div className="lg:col-span-5">
          <LabChatInterface
            currentSpec={activeSpec}
            onSpecUpdated={(newSpec) => setActiveSpec(newSpec)}
          />
        </div>

        {/* Live Widget Preview Pane */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 text-white px-4 py-2.5 rounded-t-xl flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Live Widget Hot-Reload Preview
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
