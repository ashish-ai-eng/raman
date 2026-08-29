import React, { useState, useEffect } from "react";
import { UniversalPhysicsSpec, UPREquation } from "@/types/upr";

interface FormulaInspectorProps {
  spec: UniversalPhysicsSpec;
  onFormulaUpdate: (updatedEquations: Record<string, UPREquation>) => void;
}

export const FormulaInspector: React.FC<FormulaInspectorProps> = ({
  spec,
  onFormulaUpdate,
}) => {
  const [equations, setEquations] = useState<Record<string, UPREquation>>(spec.equations);
  const [newEqId, setNewEqId] = useState("");
  const [newEqExpr, setNewEqExpr] = useState("");

  useEffect(() => {
    setEquations(spec.equations);
  }, [spec]);

  const handleExprChange = (id: string, newExpr: string) => {
    const updated = {
      ...equations,
      [id]: {
        ...equations[id],
        id,
        expression: newExpr,
      },
    };
    setEquations(updated);
    onFormulaUpdate(updated);
  };

  const handleAddEquation = () => {
    if (!newEqId.trim() || !newEqExpr.trim()) return;
    const cleanId = newEqId.trim().replace(/\s+/g, "_");
    const updated = {
      ...equations,
      [cleanId]: {
        id: cleanId,
        label: newEqId,
        expression: newEqExpr,
      },
    };
    setEquations(updated);
    onFormulaUpdate(updated);
    setNewEqId("");
    setNewEqExpr("");
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Teacher Physics Formula Inspector & Editor
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Supervise AI math outputs. Review and modify mathematical expressions for physical laws.
          </p>
        </div>
        <span className="text-[10px] font-bold text-brand-700 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded">
          Teacher Override Control
        </span>
      </div>

      {/* Equations List */}
      <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
        {Object.entries(equations).length === 0 ? (
          <div className="text-xs text-slate-400 italic">No custom equations defined yet.</div>
        ) : (
          Object.entries(equations).map(([id, eq]) => (
            <div key={id} className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <label htmlFor={`eq-${id}`}>{eq.label || id}</label>
                <span className="text-[10px] font-mono text-slate-400">ID: {id}</span>
              </div>
              <input
                id={`eq-${id}`}
                type="text"
                value={eq.expression}
                onChange={(e) => handleExprChange(id, e.target.value)}
                className="w-full text-xs font-mono bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500 font-semibold text-slate-900"
              />
            </div>
          ))
        )}
      </div>

      {/* Add Custom Formula Expression */}
      <div className="pt-3 border-t border-slate-100 space-y-2">
        <span className="text-[11px] font-bold text-slate-700 uppercase">
          + Add New Physics Formula
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
          <input
            type="text"
            placeholder="Formula ID (e.g. freq_f)"
            value={newEqId}
            onChange={(e) => setNewEqId(e.target.value)}
            className="sm:col-span-4 text-xs border border-slate-300 rounded px-2.5 py-1.5"
          />
          <input
            type="text"
            placeholder="Math expression (e.g. 1 / period_T)"
            value={newEqExpr}
            onChange={(e) => setNewEqExpr(e.target.value)}
            className="sm:col-span-6 text-xs border border-slate-300 rounded px-2.5 py-1.5"
          />
          <button
            onClick={handleAddEquation}
            disabled={!newEqId.trim() || !newEqExpr.trim()}
            className="sm:col-span-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded py-1.5 transition-colors"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};
