/**
 * Universal Physics Runtime (UPR) Domain Types
 * Defines the declarative schema for dynamic physics instruments & simulations.
 */

export type InputControlType = "slider" | "toggle" | "dial" | "select";

export interface UPRInput {
  id: string;
  label: string;
  type: InputControlType;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit: string;
  options?: { label: string; value: number }[]; // For "select" control type
}

export interface UPREquation {
  id: string;
  label?: string;
  expression: string; // e.g. "(lens_focal_length * u) / (u - lens_focal_length)"
}

export interface UPROutput {
  id: string;
  label: string;
  unit: string;
  expression: string; // AST expression targeting inputs or intermediate equations
  precision: number;  // Decimal places for visual readout display
  skipQuantization?: boolean; // Skip instrument least-count rounding (for ratios/reciprocals)
}

export interface UPRErrorModel {
  zeroError?: number;       // Constant offset error (e.g. +0.03 cm)
  leastCount?: number;      // Quantization resolution (e.g. 0.01 cm)
  noisePercentage?: number; // Optional random variance for realistic experimental simulation
}

export interface VisualPrimitive {
  type: "ruler" | "scale" | "lens" | "bob" | "circuit_wire" | "pointer" | "digital_display" | "vernier_caliper" | "custom_svg";
  id: string;
  xExpression: string;
  yExpression: string;
  rotationExpression?: string;
  sizeExpression?: string;
  properties?: Record<string, string | number | boolean>;
}

export interface UniversalPhysicsSpec {
  id: string;
  name: string;
  description: string;
  inputs: Record<string, UPRInput>;
  equations: Record<string, UPREquation>;
  outputs: Record<string, UPROutput>;
  errorModel?: UPRErrorModel;
  visuals?: VisualPrimitive[];
  hasAnimation?: boolean; // Whether widget has continuous motion (e.g. pendulum, waves)
  hasZeroError?: boolean;  // Whether widget uses zero-error calibration (e.g. Vernier, micrometer)
}
