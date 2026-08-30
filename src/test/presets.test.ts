import { describe, it, expect } from "vitest";
import { evaluateUniversalSpec } from "@/lib/engine/dependencyGraph";
import {
  vernierCaliperPreset,
  simplePendulumPreset,
  ohmsLawPreset,
  PRESET_WIDGETS,
} from "@/lib/engine/presets";

describe("Seed Universal Widget Presets (CL 2.3)", () => {
  it("exports a registry containing core preset widget specifications", () => {
    expect(Object.keys(PRESET_WIDGETS)).toHaveLength(3);
  });

  describe("Vernier Caliper Preset", () => {
    it("evaluates MSR, VSD, and zero-error corrected reading correctly", () => {
      const res = evaluateUniversalSpec(vernierCaliperPreset, {
        specimen_dimension: 2.34,
      });

      expect(res.outputs.msr).toBe(2.3);
      expect(res.outputs.vsd).toBe(6);
      expect(res.outputs.observed).toBe(2.38);
    });
  });

  describe("Simple Pendulum Preset", () => {
    it("evaluates time period T and T² correctly for given length L", () => {
      const res = evaluateUniversalSpec(simplePendulumPreset, {
        string_length_L: 1.0,
        gravity_g: 9.81,
      });

      const expectedT = 2 * Math.PI * Math.sqrt(1 / 9.81);
      expect(res.outputs.period).toBeCloseTo(expectedT, 2);
      expect(res.outputs.period_sq).toBeCloseTo(expectedT ** 2, 2);
    });
  });

  describe("Ohm's Law Preset", () => {
    it("evaluates circuit current I, voltage V, and power P correctly", () => {
      const res = evaluateUniversalSpec(ohmsLawPreset, {
        supply_voltage: 12.0,
        resistor_value_R: 100,
        internal_resistance_r: 0,
      });

      expect(res.outputs.current).toBe(0.12);
      expect(res.outputs.voltage).toBe(12.0);
      expect(res.outputs.power).toBe(1.44);
    });
  });
});
