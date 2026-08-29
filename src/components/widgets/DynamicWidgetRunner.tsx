import React, { useState, useEffect, useRef, useMemo } from "react";
import { UniversalPhysicsSpec } from "@/types/upr";
import { evaluateUniversalSpec } from "@/lib/engine/dependencyGraph";
import { PrimitiveRenderer } from "./renderer/PrimitiveRenderer";

export interface DynamicWidgetRunnerProps {
  spec: UniversalPhysicsSpec;
  onStateChange?: (evalState: ReturnType<typeof evaluateUniversalSpec>) => void;
}

export const DynamicWidgetRunner: React.FC<DynamicWidgetRunnerProps> = ({
  spec,
  onStateChange,
}) => {
  // Capability flags: determine whether animation transport or zero error panels apply
  const isAnimationApplicable = spec.hasAnimation ?? Object.values(spec.equations).some((eq) => /\b(t|time)\b/.test(eq.expression));
  const isZeroErrorApplicable = spec.hasZeroError ?? (spec.errorModel?.zeroError !== undefined);
  // Local state for user input values
  const [inputValues, setInputValues] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    for (const [key, input] of Object.entries(spec.inputs)) {
      initial[key] = input.defaultValue;
    }
    return initial;
  });

  // Zero-error calibration state
  const [zeroErrorOffset, setZeroErrorOffset] = useState<number>(
    spec.errorModel?.zeroError ?? 0
  );

  // Animation continuous time t (seconds)
  const [simTime, setSimTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Animation Loop
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      lastTimeRef.current = null;
      return;
    }

    const loop = (timestamp: number) => {
      if (lastTimeRef.current !== null) {
        const delta = (timestamp - lastTimeRef.current) / 1000;
        setSimTime((prev) => prev + delta);
      }
      lastTimeRef.current = timestamp;
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying]);

  // Evaluate engine state reactively with continuous time t injected
  const evalState = useMemo(() => {
    const activeSpec: UniversalPhysicsSpec = {
      ...spec,
      errorModel: {
        ...spec.errorModel,
        zeroError: zeroErrorOffset,
      },
    };

    // Inject continuous animation time t into input overrides for harmonic motion expressions
    const overrides = {
      ...inputValues,
      t: simTime,
      time: simTime,
    };

    const state = evaluateUniversalSpec(activeSpec, overrides);
    if (onStateChange) onStateChange(state);
    return state;
  }, [spec, inputValues, zeroErrorOffset, simTime, onStateChange]);

  const handleInputChange = (key: string, val: number) => {
    setInputValues((prev) => ({ ...prev, [key]: val }));
  };

  const evalContext: Record<string, number> = {
    ...evalState.inputs,
    ...evalState.equations,
    ...evalState.outputs,
    t: simTime,
    time: simTime,
  };

  return (
    <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-6">
      {/* Header & Animation Transport Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800">{spec.name}</h2>
          <p className="text-sm text-slate-500 mt-0.5">{spec.description}</p>
        </div>

        {/* Animation Play/Pause/Reset Controls (Only if animation applies) */}
        {isAnimationApplicable && (
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-lg border border-slate-200" data-testid="animation-controls">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`text-xs font-bold px-3 py-1.5 rounded-md transition-colors ${
                isPlaying
                  ? "bg-amber-500 hover:bg-amber-600 text-white"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }`}
            >
              {isPlaying ? "❚❚ Pause" : "▶ Play Motion"}
            </button>
            <button
              onClick={() => {
                setIsPlaying(false);
                setSimTime(0);
              }}
              className="text-xs font-semibold bg-white hover:bg-slate-200 text-slate-700 border border-slate-300 px-2.5 py-1.5 rounded-md transition-colors"
            >
              ↺ Reset
            </button>
            <span className="text-xs font-mono font-bold text-slate-600 px-2">
              t = {simTime.toFixed(2)}s
            </span>
          </div>
        )}
      </div>

      {/* SVG Canvas Visual Stage */}
      <div className="w-full bg-slate-900 rounded-lg p-4 flex items-center justify-center min-h-[220px] overflow-hidden relative shadow-inner">
        <svg viewBox="0 0 460 180" className="w-full h-auto max-h-[220px]">
          <defs>
            <radialGradient id="bobGradient" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0369a1" />
            </radialGradient>
          </defs>
          {spec.visuals?.map((primitive) => (
            <PrimitiveRenderer
              key={primitive.id}
              primitive={primitive}
              evalContext={evalContext}
            />
          ))}
        </svg>
      </div>

      {/* Observable Output Readouts */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
          Observable Readouts
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(spec.outputs).map(([key, outSpec]) => {
            const val = evalState.outputs[key];
            return (
              <div
                key={key}
                className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center"
              >
                <div className="text-xs text-slate-500 truncate">{outSpec.label}</div>
                <div className="text-lg font-bold text-brand-600 mt-1">
                  {isNaN(val) ? "—" : val}{" "}
                  <span className="text-xs font-normal text-slate-500">
                    {outSpec.unit}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Controls & Calibration */}
      <div className={`grid grid-cols-1 ${isZeroErrorApplicable ? "md:grid-cols-2" : ""} gap-6 pt-2 border-t border-slate-100`}>
        {/* Sliders & Toggles */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Controllable Parameters
          </h3>
          {Object.entries(spec.inputs).map(([key, input]) => {
            const currentVal = inputValues[key] ?? input.defaultValue;
            return (
              <div key={key} className="space-y-1">
                <div className="flex justify-between text-xs font-medium text-slate-700">
                  <label htmlFor={key}>{input.label}</label>
                  <span>
                    {currentVal} {input.unit}
                  </span>
                </div>
                {input.type === "select" && input.options ? (
                  <select
                    id={key}
                    value={currentVal}
                    onChange={(e) => handleInputChange(key, parseFloat(e.target.value))}
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {input.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={key}
                    type="range"
                    min={input.min}
                    max={input.max}
                    step={input.step}
                    value={currentVal}
                    onChange={(e) => handleInputChange(key, parseFloat(e.target.value))}
                    className="w-full accent-brand-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Zero Error Calibration Offset (Only if applicable) */}
        {isZeroErrorApplicable && (
          <div className="space-y-4" data-testid="zero-error-panel">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Instrument Calibration
            </h3>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 space-y-2">
              <div className="flex justify-between text-xs font-semibold text-amber-800">
                <span>Zero Error Calibration Offset</span>
                <span>{zeroErrorOffset > 0 ? `+${zeroErrorOffset}` : zeroErrorOffset}</span>
              </div>
              <input
                type="range"
                min="-0.2"
                max="0.2"
                step="0.01"
                value={zeroErrorOffset}
                onChange={(e) => setZeroErrorOffset(parseFloat(e.target.value))}
                className="w-full accent-amber-600 h-1.5 bg-amber-200 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-[11px] text-amber-700 leading-tight">
                Simulates zero calibration misalignment. Correct readings equal Observed
                Reading minus Zero Error.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
