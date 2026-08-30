import { UniversalPhysicsSpec } from "@/types/upr";

export const vernierCaliperPreset: UniversalPhysicsSpec = {
  id: "preset-vernier-caliper",
  name: "Vernier Caliper Instrument",
  description: "Precision Vernier Caliper for measuring object dimensions (diameter, length, width) clamped between jaws with zero-error calibration.",
  hasAnimation: false,
  hasZeroError: true,
  inputs: {
    object_type_select: {
      id: "object_type_select",
      label: "Select Object to Measure",
      type: "select",
      min: 1,
      max: 3,
      step: 1,
      defaultValue: 1,
      unit: "",
      options: [
        { label: "Steel Sphere (Diameter)", value: 1 },
        { label: "Solid Cylinder (Height)", value: 2 },
        { label: "Rectangular Block (Width)", value: 3 },
      ],
    },
    object_size: {
      id: "object_size",
      label: "Slide Scale / Dimension (cm)",
      type: "slider",
      min: 0.5,
      max: 7.5,
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
      type: "vernier_caliper",
      id: "vernier_instrument",
      xExpression: "0",
      yExpression: "0",
      properties: {
        gapExpression: "total_reading",
        objectType: "sphere",
        objectLabel: "Object Clamped Between Jaws",
        scaleFactor: 28,
      },
    },
  ],
};
