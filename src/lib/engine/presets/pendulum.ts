import { UniversalPhysicsSpec } from "@/types/upr";

export const simplePendulumPreset: UniversalPhysicsSpec = {
  id: "preset-simple-pendulum",
  name: "Simple Pendulum Experiment",
  description: "Investigate period of oscillation T versus string length L to derive gravity g.",
  inputs: {
    string_length_L: {
      id: "string_length_L",
      label: "String Length L (m)",
      type: "slider",
      min: 0.2,
      max: 1.5,
      step: 0.05,
      defaultValue: 0.8,
      unit: "m",
    },
    gravity_g: {
      id: "gravity_g",
      label: "Acceleration due to Gravity g (m/s²)",
      type: "slider",
      min: 1.0,
      max: 25.0,
      step: 0.1,
      defaultValue: 9.81,
      unit: "m/s²",
    },
    oscillation_count_N: {
      id: "oscillation_count_N",
      label: "Number of Oscillations (N)",
      type: "slider",
      min: 5,
      max: 20,
      step: 5,
      defaultValue: 10,
      unit: "obs",
    },
  },
  equations: {
    theoretical_period_T: {
      id: "theoretical_period_T",
      expression: "2 * PI * sqrt(string_length_L / gravity_g)",
    },
    total_time_t: {
      id: "total_time_t",
      expression: "oscillation_count_N * theoretical_period_T",
    },
    t_squared: {
      id: "t_squared",
      expression: "theoretical_period_T ^ 2",
    },
  },
  outputs: {
    stopwatch_time: {
      id: "stopwatch_time",
      label: "Stopwatch Total Time (t)",
      unit: "s",
      expression: "total_time_t",
      precision: 2,
    },
    time_period: {
      id: "time_period",
      label: "Calculated Time Period (T = t / N)",
      unit: "s",
      expression: "total_time_t / oscillation_count_N",
      precision: 3,
    },
    period_squared: {
      id: "period_squared",
      label: "Period Squared (T²)",
      unit: "s²",
      expression: "t_squared",
      precision: 3,
    },
  },
  errorModel: {
    leastCount: 0.01,
  },
  visuals: [
    {
      type: "bob",
      id: "pendulum_bob",
      xExpression: "150 + sin(15) * string_length_L * 80",
      yExpression: "20 + cos(15) * string_length_L * 80",
      properties: { radius: 16 },
    },
  ],
};
