"use client";

import React, { useState } from "react";
import { PRESET_WIDGETS } from "@/lib/engine/presets";
import { DynamicWidgetRunner } from "@/components/widgets/DynamicWidgetRunner";

export default function Home() {
  const [selectedWidgetId, setSelectedWidgetId] = useState<string>(
    "preset-vernier-caliper"
  );

  const activeWidget = PRESET_WIDGETS[selectedWidgetId];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-12 space-y-8 max-w-5xl mx-auto">
      {/* App Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-600 tracking-tight">
            PhysLab Studio
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Universal Interactive Physics Engine & Generative AI Studio
          </p>
        </div>

        {/* Preset Widget Selector */}
        <div className="flex items-center gap-2 bg-white p-2 border border-slate-200 rounded-lg shadow-sm">
          <label htmlFor="widget-select" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Active Widget:
          </label>
          <select
            id="widget-select"
            value={selectedWidgetId}
            onChange={(e) => setSelectedWidgetId(e.target.value)}
            className="bg-slate-50 text-slate-800 text-sm font-medium border border-slate-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {Object.values(PRESET_WIDGETS).map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Interactive Dynamic Widget Runner Stage */}
      <div className="flex justify-center">
        {activeWidget && <DynamicWidgetRunner key={activeWidget.id} spec={activeWidget} />}
      </div>
    </main>
  );
}
