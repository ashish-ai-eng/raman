import { UniversalPhysicsSpec } from "@/types/upr";

export const rayOpticsPreset: UniversalPhysicsSpec = {
  id: "preset-ray-optics",
  name: "Geometrical Ray Optics Bench",
  description: "Convex (converging, +f) and Concave (diverging, -f) thin lenses. Verification of lens formula 1/f = 1/v - 1/u and magnification m = v/u.",
  hasAnimation: false,
  hasZeroError: true,
  inputs: {
    object_distance_u: {
      id: "object_distance_u",
      label: "Object Distance u (cm)",
      type: "slider",
      min: 15,
      max: 100,
      step: 1,
      defaultValue: 30,
      unit: "cm",
    },
    focal_length_f: {
      id: "focal_length_f",
      label: "Lens Focal Length f (cm)",
      type: "slider",
      min: 5,
      max: 25,
      step: 1,
      defaultValue: 15,
      unit: "cm",
    },
    bench_zero_error: {
      id: "bench_zero_error",
      label: "Bench Index Error (cm)",
      type: "slider",
      min: -2,
      max: 2,
      step: 0.1,
      defaultValue: 0.0,
      unit: "cm",
    },
  },
  equations: {
    calculated_v: { id: "calculated_v", expression: "(focal_length_f * object_distance_u) / (object_distance_u - focal_length_f)" },
    reciprocal_u: { id: "reciprocal_u", expression: "1 / object_distance_u" },
    reciprocal_v: { id: "reciprocal_v", expression: "1 / calculated_v" },
    magnification_m: { id: "magnification_m", expression: "-calculated_v / object_distance_u" },
  },
  outputs: {
    image_v: { id: "image_v", label: "Image Distance (v)", unit: "cm", expression: "calculated_v + bench_zero_error", precision: 1 },
    inv_u: { id: "inv_u", label: "Reciprocal 1/u", unit: "cm⁻¹", expression: "reciprocal_u", precision: 4, skipQuantization: true },
    inv_v: { id: "inv_v", label: "Reciprocal 1/v", unit: "cm⁻¹", expression: "reciprocal_v", precision: 4, skipQuantization: true },
    magnification: { id: "magnification", label: "Magnification (m)", unit: "", expression: "magnification_m", precision: 2, skipQuantization: true },
  },
  errorModel: { leastCount: 0.1 },
  visuals: [
    {
      type: "lens",
      id: "convex_lens",
      xExpression: "200",
      yExpression: "90",
      properties: { focalLength: 15 },
    },
  ],
};
