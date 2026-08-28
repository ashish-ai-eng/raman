import { UniversalPhysicsSpec } from "@/types/upr";

export const vernierCaliperPreset: UniversalPhysicsSpec = {
  id: "preset-vernier-caliper",
  name: "Vernier Caliper Instrument",
  description: "Precision Vernier Caliper for measuring linear dimensions with zero error calibration.",
  inputs: {
    object_size: {
      id: "object_size",
      label: "Object Diameter (cm)",
      type: "slider",
      min: 0.1,
      max: 10.0,
      step: 0.01,
      defaultValue: 2.34,
      unit: "cm",
    },
  },
  equations: {
    least_count: {
      id: "least_count",
      expression: "0.01",
    },
    raw_reading: {
      id: "raw_reading",
      expression: "object_size",
    },
    main_scale_reading: {
      id: "main_scale_reading",
      expression: "floor(raw_reading * 10) / 10",
    },
    vernier_coincidence: {
      id: "vernier_coincidence",
      expression: "round((raw_reading - main_scale_reading) / 0.01)",
    },
  },
  outputs: {
    msr: {
      id: "msr",
      label: "Main Scale Reading (MSR)",
      unit: "cm",
      expression: "main_scale_reading",
      precision: 1,
    },
    vsd: {
      id: "vsd",
      label: "Vernier Coincidence (VSD)",
      unit: "div",
      expression: "vernier_coincidence",
      precision: 0,
    },
    total_reading: {
      id: "total_reading",
      label: "Observed Reading (MSR + VSD × LC)",
      unit: "cm",
      expression: "main_scale_reading + (vernier_coincidence * least_count)",
      precision: 2,
    },
    corrected_reading: {
      id: "corrected_reading",
      label: "Corrected Reading",
      unit: "cm",
      expression: "main_scale_reading + (vernier_coincidence * least_count)",
      precision: 2,
    },
  },
  errorModel: {
    leastCount: 0.01,
    zeroError: 0.03,
  },
  visuals: [
    {
      type: "scale",
      id: "main_scale_body",
      xExpression: "0",
      yExpression: "0",
      properties: { label: "Main Scale (cm)" },
    },
    {
      type: "pointer",
      id: "vernier_jaw",
      xExpression: "object_size * 20",
      yExpression: "0",
      properties: { label: "Vernier Jaw" },
    },
  ],
};
