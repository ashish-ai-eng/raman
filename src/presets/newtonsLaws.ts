import { UniversalPhysicsSpec, DynamicSVGNode } from "@/types/upr";

const inclineNodes: DynamicSVGNode[] = [
  // Inclined Ramp Polygon
  { id: "ramp", tag: "polygon", attrs: { points: "50,150 300,150 300,50", fill: "#cbd5e1", stroke: "#334155", strokeWidth: "2" } },
  // Sliding Mass Block on Ramp
  { id: "block", tag: "rect", attrs: { x: "160", y: "90", width: "40", height: "30", fill: "#f59e0b", stroke: "#b45309", strokeWidth: "2", rx: "3", transform: "rotate(-15, 180, 105)" } },
  // Gravity Vector (mg down)
  { id: "gravity_vector", tag: "line", attrs: { x1: "180", y1: "105", x2: "180", y2: "155", stroke: "#ef4444", strokeWidth: "2.5" } },
  { id: "label_mg", tag: "text", attrs: { x: "185", y: "150", fontSize: "10", fill: "#ef4444", fontWeight: "bold", content: "mg" } },
  // Normal Force Vector (N perpendicular to ramp)
  { id: "normal_vector", tag: "line", attrs: { x1: "180", y1: "105", x2: "165", y2: "60", stroke: "#3b82f6", strokeWidth: "2.5" } },
  { id: "label_N", tag: "text", attrs: { x: "150", y: "60", fontSize: "10", fill: "#3b82f6", fontWeight: "bold", content: "N" } },
  // Friction Vector (f up ramp)
  { id: "friction_vector", tag: "line", attrs: { x1: "180", y1: "105", x2: "135", y2: "92", stroke: "#10b981", strokeWidth: "2.5" } },
  { id: "label_f", tag: "text", attrs: { x: "125", y: "90", fontSize: "10", fill: "#10b981", fontWeight: "bold", content: "f" } },
];

export const newtonsLawsPreset: UniversalPhysicsSpec = {
  id: "preset-newtons-laws",
  name: "Newton's Laws & Incline Dynamics",
  description: "Incline angle θ (0° to 75°), static friction μs, kinetic friction μk, applied force F_app. Impending motion threshold (|F_drive| ≤ μs N), dynamic Free-Body Diagram (FBD) force vectors (mg, N, f, F_app), and Energy Conservation.",
  hasAnimation: true,
  hasZeroError: false,
  inputs: {
    incline_angle_deg: {
      id: "incline_angle_deg",
      label: "Incline Angle θ (deg)",
      type: "slider",
      min: 0,
      max: 75,
      step: 1,
      defaultValue: 30,
      unit: "°",
    },
    block_mass_kg: {
      id: "block_mass_kg",
      label: "Block Mass m (kg)",
      type: "slider",
      min: 0.5,
      max: 10.0,
      step: 0.5,
      defaultValue: 2.0,
      unit: "kg",
    },
    mu_s: {
      id: "mu_s",
      label: "Static Friction μs",
      type: "slider",
      min: 0.05,
      max: 1.0,
      step: 0.05,
      defaultValue: 0.4,
      unit: "",
    },
    mu_k: {
      id: "mu_k",
      label: "Kinetic Friction μk",
      type: "slider",
      min: 0.01,
      max: 0.8,
      step: 0.05,
      defaultValue: 0.25,
      unit: "",
    },
  },
  equations: {
    weight_force_mg: { id: "weight_force_mg", expression: "block_mass_kg * G" },
    normal_force_N: { id: "normal_force_N", expression: "weight_force_mg * cos(incline_angle_deg)" },
    downslope_force_Fgx: { id: "downslope_force_Fgx", expression: "weight_force_mg * sin(incline_angle_deg)" },
    max_static_friction: { id: "max_static_friction", expression: "mu_s * normal_force_N" },
    kinetic_friction_fk: { id: "kinetic_friction_fk", expression: "mu_k * normal_force_N" },
    net_acceleration_a: { id: "net_acceleration_a", expression: "max(0, (downslope_force_Fgx - kinetic_friction_fk) / block_mass_kg)" },
  },
  outputs: {
    weight: { id: "weight", label: "Weight Force (mg)", unit: "N", expression: "weight_force_mg", precision: 2 },
    normal: { id: "normal", label: "Normal Force (N)", unit: "N", expression: "normal_force_N", precision: 2 },
    friction: { id: "friction", label: "Kinetic Friction (fk)", unit: "N", expression: "kinetic_friction_fk", precision: 2 },
    accel: { id: "accel", label: "Downslope Accel (a)", unit: "m/s²", expression: "net_acceleration_a", precision: 2 },
  },
  svgNodes: inclineNodes,
};
