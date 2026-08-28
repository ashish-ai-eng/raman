import React from "react";

export interface AnalyticsOverviewProps {
  totalStudents?: number;
  avgCompletionRate?: number;
  avgAccuracyPercent?: number;
}

export const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({
  totalStudents = 34,
  avgCompletionRate = 88,
  avgAccuracyPercent = 92,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Class Engagement & Student Analytics Overview
          </h3>
          <p className="text-xs text-slate-500">
            Real-time engagement, step accuracy, and common error alerts across active lab cohorts.
          </p>
        </div>
        <span className="text-xs font-semibold uppercase text-emerald-700 bg-emerald-50 border border-emerald-300 px-2.5 py-0.5 rounded-full">
          ● Live Cohort
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Active Students
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalStudents}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-0.5">↑ 100% submission rate</div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Avg Completion Rate
          </div>
          <div className="text-2xl font-black text-brand-600 mt-1">{avgCompletionRate}%</div>
          <div className="text-[11px] text-slate-500 font-medium mt-0.5">All steps completed</div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Step Accuracy
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{avgAccuracyPercent}%</div>
          <div className="text-[11px] text-slate-500 font-medium mt-0.5">Within ±5% tolerance</div>
        </div>
      </div>

      {/* Common Student Error Insights */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
          <span>⚠️ Common Student Misconception Flag</span>
        </div>
        <p className="text-xs text-amber-800 leading-relaxed">
          <strong>24% of students</strong> forgot to subtract the zero-error offset (+0.03 cm) on their first Vernier Caliper measurement attempt. The Socratic hint guided them to correct it on trial 2.
        </p>
      </div>
    </div>
  );
};
