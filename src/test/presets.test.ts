import { describe, it, expect } from "vitest";
import { evaluateUniversalSpec } from "@/lib/engine/dependencyGraph";
import {
  vernierCaliperPreset,
  simplePendulumPreset,
  opticsBenchPreset,
  ohmsLawPreset,
  PRESET_WIDGETS,
} from "@/lib/engine/presets";

describe("Seed Universal Widget Presets (CL 2.3)", () => {
  it("exports a registry containing 4 preset widget specifications", () => {
    expect(Object.keys(PRESET_WIDGETS)).toHaveLength(4);
  });

  describe("Vernier Caliper Preset", () => {
    it("evaluates MSR, VSD, and zero-error corrected reading correctly", () => {
      const res = evaluateUniversalSpec(vernierCaliperPreset, {
        object_size: 2.34,
      });

      expect(res.outputs.msr).toBe(2.3);
      expect(res.outputs.vsd).toBe(4);
      expect(res.outputs.total_reading).toBe(2.37);
    });
  });

  describe("Simple Pendulum Preset", () => {
    it("evaluates time period T and T² correctly for given length L", () => {
      const res = evaluateUniversalSpec(simplePendulumPreset, {
        string_length_L: 1.0,
        gravity_g: 9.81,
        oscillation_count_N: 10,
      });

      const expectedT = 2 * Math.PI * Math.sqrt(1 / 9.81);
      expect(res.outputs.time_period).toBeCloseTo(expectedT, 2);
      expect(res.outputs.period_squared).toBeCloseTo(expectedT ** 2, 2);
    });
  });

  describe("Optics Bench Convex Lens Preset", () => {
    it("evaluates lens formula v = (f * u) / (u - f) and reciprocals correctly", () => {
      const res = evaluateUniversalSpec(opticsBenchPreset, {
        object_distance_u: 30,
        focal_length_f: 15,
      });

      expect(res.outputs.image_distance_v).toBe(30);
      expect(res.outputs.inv_u).toBeCloseTo(1 / 30, 4);
      expect(res.outputs.inv_v).toBeCloseTo(1 / 30, 4);
      expect(res.outputs.magnification).toBe(-1);
    });
  });

  describe("Ohm's Law Preset", () => {
    it("evaluates circuit current I, voltage V, and power P correctly", () => {
      const res = evaluateUniversalSpec(ohmsLawPreset, {
        supply_voltage: 10.0,
        resistor_value_R: 95,
        meter_internal_r: 5,
      });

      expect(res.outputs.ammeter_reading).toBe(0.1);
      expect(res.outputs.voltmeter_reading).toBe(9.5);
      expect(res.outputs.power_reading).toBe(0.95);
    });
  });
});
