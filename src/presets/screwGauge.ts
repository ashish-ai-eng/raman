import { UniversalPhysicsSpec, DynamicSVGNode } from "@/types/upr";

const screwGaugeNodes: DynamicSVGNode[] = [
  // U-frame
  { id: "u_frame", tag: "path", attrs: { d: "M 40 40 L 40 140 L 220 140 L 220 100", fill: "none", stroke: "#334155", strokeWidth: "14" } },
  // Anvil
  { id: "anvil", tag: "rect", attrs: { x: "40", y: "75", width: "20", height: "30", fill: "#94a3b8", stroke: "#0f172a", strokeWidth: "1.5" } },
  // Sleeve Barrel
  { id: "sleeve", tag: "rect", attrs: { x: "120", y: "75", width: "120", height: "30", fill: "#cbd5e1", stroke: "#334155", strokeWidth: "1.5" } },
  // Datum Main Scale Line
  { id: "datum_line", tag: "line", attrs: { x1: "120", y1: "90", x2: "220", y2: "90", stroke: "#0f172a", strokeWidth: "1.5" } },
  // Rotating Thimble (moves along sleeve with specimen thickness)
  { id: "thimble", tag: "rect", attrs: { x: "150 + specimen_thickness_mm * 15", y: "65", width: "70", height: "50", fill: "#0284c7", stroke: "#0369a1", strokeWidth: "2", rx: "3" } },
  // Ratchet Knob
  { id: "ratchet", tag: "rect", attrs: { x: "220 + specimen_thickness_mm * 15", y: "75", width: "30", height: "30", fill: "#475569", stroke: "#1e293b", strokeWidth: "1.5", rx: "2" } },
  // Spindle Shaft
  { id: "spindle", tag: "rect", attrs: { x: "60 + specimen_thickness_mm * 15", y: "80", width: "90", height: "20", fill: "#e2e8f0", stroke: "#334155", strokeWidth: "1.5" } },
  // Clamped Specimen
  { id: "specimen", tag: "rect", attrs: { x: "60", y: "80", width: "specimen_thickness_mm * 15", height: "20", fill: "#f59e0b", stroke: "#d97706", strokeWidth: "1.5", rx: "2" } },
  { id: "label", tag: "text", attrs: { x: "130", y: "165", fontSize: "11", fill: "#0369a1", fontWeight: "bold", content: "Clamped Specimen Thickness" } },
];

export const screwGaugePreset: UniversalPhysicsSpec = {
  id: "preset-screw-gauge",
  name: "Micrometer Screw Gauge Instrument",
  description: "Main sleeve (1 mm pitch), 100-division circular head scale (LC = 0.01 mm). Specimen thickness measurement (copper wire, glass slide, lead shot pellet), ratchet rotation, positive/negative zero error calibration.",
  hasAnimation: false,
  hasZeroError: true,
  inputs: {
    specimen_thickness_mm: {
      id: "specimen_thickness_mm",
      label: "Specimen Thickness d (mm)",
      type: "slider",
      min: 0.05,
      max: 5.0,
      step: 0.01,
      defaultValue: 1.25,
      unit: "mm",
    },
    zero_error_mm: {
      id: "zero_error_mm",
      label: "Zero Error Offset (mm)",
      type: "slider",
      min: -0.05,
      max: 0.05,
      step: 0.01,
      defaultValue: 0.02,
      unit: "mm",
    },
  },
  equations: {
    pitch_mm: { id: "pitch_mm", expression: "1.0" },
    head_divisions: { id: "head_divisions", expression: "100" },
    least_count_mm: { id: "least_count_mm", expression: "0.01" },
    raw_reading: { id: "raw_reading", expression: "specimen_thickness_mm + zero_error_mm" },
    main_sleeve_reading: { id: "main_sleeve_reading", expression: "floor(raw_reading)" },
    circular_coincidence: { id: "circular_coincidence", expression: "round((raw_reading - main_sleeve_reading) / 0.01)" },
    observed_reading: { id: "observed_reading", expression: "main_sleeve_reading + (circular_coincidence * 0.01)" },
    corrected_reading: { id: "corrected_reading", expression: "observed_reading - zero_error_mm" },
  },
  outputs: {
    msr: { id: "msr", label: "Main Sleeve Reading (MSR)", unit: "mm", expression: "main_sleeve_reading", precision: 2 },
    csr: { id: "csr", label: "Circular Head Division (CSR)", unit: "div", expression: "circular_coincidence", precision: 0 },
    observed: { id: "observed", label: "Observed Thickness (MSR + CSR × LC)", unit: "mm", expression: "observed_reading", precision: 2 },
    corrected: { id: "corrected", label: "Corrected Specimen Thickness", unit: "mm", expression: "corrected_reading", precision: 2 },
  },
  errorModel: {
    leastCount: 0.01,
    zeroError: 0.02,
  },
  svgNodes: screwGaugeNodes,
};
