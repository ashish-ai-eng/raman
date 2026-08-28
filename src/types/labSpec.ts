import { UniversalPhysicsSpec } from "./upr";

/**
 * Universal Lab Specification Domain Types
 * Structure for complete teacher-authored or AI-generated physics labs.
 */

export interface CalculatedObservable {
  key: string;
  label: string;
  unit: string;
  formula: string; // e.g. "time_10_obs / 10"
}

export interface GraphConfig {
  xAxisKey: string;
  yAxisKey: string;
  xAxisLabel: string;
  yAxisLabel: string;
  expectedSlopeFormula?: string; // e.g. "4 * PI^2 / g"
  extractedConstantLabel?: string; // e.g. "Acceleration due to gravity (g)"
  extractedConstantFormula?: string; // e.g. "(4 * PI * PI) / slope"
}

export interface ObservationSchema {
  parametersToRecord: string[]; // Keys matching UPR inputs or outputs
  calculatedValues: CalculatedObservable[];
  graphConfig: GraphConfig;
}

export type IdealAnswerType = "numeric" | "multiple_choice" | "text_explanation";

export interface StepInstruction {
  stepNumber: number;
  instruction: string;
  idealAnswerType: IdealAnswerType;
  idealAnswerFormulaOrValue: string | number;
  tolerancePercent?: number; // e.g. 5% tolerance for experimental measurements
  options?: string[];        // For multiple_choice questions
  hint: string;
}

export interface GamificationBadge {
  id: string;
  name: string;
  description: string;
  icon: string; // Asset filename in /public/stickers/
}

export interface Challenge {
  id: string;
  description: string;
  stickerReward: GamificationBadge;
  requirementType: "trials_logged" | "zero_error_corrected" | "graph_plotted" | "step_completed";
  targetCount?: number;
}

export interface LabSpec {
  id: string;
  title: string;
  topic: string; // e.g. "Mechanics", "Optics", "Electricity"
  conceptSummary: string;
  funFacts: string[];
  widget: UniversalPhysicsSpec;
  observationSchema: ObservationSchema;
  steps: StepInstruction[];
  challenges: Challenge[];
  status: "draft" | "verified" | "published";
  createdAt: string;
  updatedAt: string;
}

export interface ObservationDataPoint {
  id: string;
  trialNumber: number;
  timestamp: number;
  values: Record<string, number>; // Maps parameter keys to recorded numeric values
}

export interface StudentSubmission {
  id: string;
  labId: string;
  studentName: string;
  observations: ObservationDataPoint[];
  stepAnswers: Record<number, { answer: string | number; isCorrect: boolean }>;
  unlockedBadges: string[]; // Badge IDs
  completedAt?: string;
}
