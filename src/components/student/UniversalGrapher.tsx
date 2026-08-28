import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Scatter,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { calculateLinearRegression, Point } from "@/lib/engine/regression";

export interface UniversalGrapherProps {
  points: Point[];
  xAxisLabel: string;
  yAxisLabel: string;
  constantFormula?: string;
  constantLabel?: string;
}

export const UniversalGrapher: React.FC<UniversalGrapherProps> = ({
  points,
  xAxisLabel,
  yAxisLabel,
  constantFormula,
  constantLabel,
}) => {
  const regression = useMemo(() => {
    return calculateLinearRegression(points, constantFormula, constantLabel);
  }, [points, constantFormula, constantLabel]);

  // Generate trendline end points for Recharts overlay line
  const chartData = useMemo(() => {
    if (points.length === 0) return [];

    const sortedX = [...points.map((p) => p.x)].sort((a, b) => a - b);
    const minX = sortedX[0] || 0;
    const maxX = sortedX[sortedX.length - 1] || 1;

    return points.map((p) => ({
      x: p.x,
      y: p.y,
      trendY: parseFloat((regression.slope * p.x + regression.intercept).toFixed(4)),
    }));
  }, [points, regression]);

  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex justify-between items-start border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-800">
            Experimental Observation Plot ({xAxisLabel} vs {yAxisLabel})
          </h3>
          <p className="text-xs text-slate-500">
            Least-squares linear regression fit line: Y = {regression.slope}X + {regression.intercept}
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold uppercase text-brand-600 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded">
            Fit R² = {regression.rSquared}
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-[260px]">
        {points.length < 2 ? (
          <div className="w-full h-full bg-slate-50 rounded-lg flex items-center justify-center text-xs text-slate-400 italic border border-dashed border-slate-200">
            Log at least 2 observation trials to generate scatter plot and regression line.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 20, bottom: 25, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="x"
                type="number"
                name={xAxisLabel}
                label={{ value: xAxisLabel, position: "insideBottom", offset: -15, fill: "#475569", fontSize: 11 }}
              />
              <YAxis
                dataKey="y"
                type="number"
                name={yAxisLabel}
                label={{ value: yAxisLabel, angle: -90, position: "insideLeft", fill: "#475569", fontSize: 11 }}
              />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              {/* Logged Observation Points */}
              <Scatter name="Observations" dataKey="y" fill="#0284c7" />
              {/* Linear Regression Line */}
              <Line
                type="monotone"
                dataKey="trendY"
                stroke="#ef4444"
                strokeWidth={2}
                dot={false}
                activeDot={false}
                name="Regression Line"
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Extracted Constant Result Banner */}
      {regression.extractedConstant && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-3 flex justify-between items-center">
          <span className="text-xs font-semibold text-emerald-800">
            Derived Physical Constant ({regression.extractedConstant.label}):
          </span>
          <span className="text-sm font-bold text-emerald-900 font-mono">
            {regression.extractedConstant.value}
          </span>
        </div>
      )}
    </div>
  );
};
