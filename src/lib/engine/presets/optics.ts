import { UniversalPhysicsSpec } from "@/types/upr";

export const opticsBenchPreset: UniversalPhysicsSpec = {
  id: "preset-optics-bench",
  name: "Optics Bench Convex Lens",
  description: "Determine focal length f using object distance u and image distance v relationship.",
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
  },
  equations: {
    calculated_v: {
      id: "calculated_v",
      expression: "(focal_length_f * object_distance_u) / (object_distance_u - focal_length_f)",
    },
    reciprocal_u: {
      id: "reciprocal_u",
      expression: "1 / object_distance_u",
    },
    reciprocal_v: {
      id: "reciprocal_v",
      expression: "1 / calculated_v",
    },
    magnification_m: {
      id: "magnification_m",
      expression: "-calculated_v / object_distance_u",
    },
  },
  outputs: {
    image_distance_v: {
      id: "image_distance_v",
      label: "Screen Image Distance v",
      unit: "cm",
      expression: "calculated_v",
      precision: 1,
    },
    inv_u: {
      id: "inv_u",
      label: "Reciprocal 1/u",
      unit: "cm⁻¹",
      expression: "reciprocal_u",
      precision: 4,
      skipQuantization: true,
    },
    inv_v: {
      id: "inv_v",
      label: "Reciprocal 1/v",
      unit: "cm⁻¹",
      expression: "reciprocal_v",
      precision: 4,
      skipQuantization: true,
    },
    magnification: {
      id: "magnification",
      label: "Magnification (m)",
      unit: "",
      expression: "magnification_m",
      precision: 2,
      skipQuantization: true,
    },
  },
  errorModel: {
    leastCount: 0.1,
  },
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
