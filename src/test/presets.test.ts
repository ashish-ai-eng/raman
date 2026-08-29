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
  it("exports a registry containing all 6 core preset widget specifications", () => {
    expect(Object.keys(PRESET_WIDGETS)).toHaveLength(6);
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

    it("oscillates angle_theta between -15° and +15° over continuous time t", () => {
      const L = 1.0;
      const g = 9.81;
      const T = 2 * Math.PI * Math.sqrt(L / g); // ~2.006s

      // At t = 0: angle = 0°
      const state0 = evaluateUniversalSpec(simplePendulumPreset, { string_length_L: L, gravity_g: g, t: 0 });
      expect(state0.equations.angle_theta).toBeCloseTo(0, 4);

      // At t = T / 4: angle = +15°
      const stateQuarter = evaluateUniversalSpec(simplePendulumPreset, { string_length_L: L, gravity_g: g, t: T / 4 });
      expect(stateQuarter.equations.angle_theta).toBeCloseTo(15, 2);

      // At t = 3 * T / 4: angle = -15°
      const stateThreeQuarter = evaluateUniversalSpec(simplePendulumPreset, { string_length_L: L, gravity_g: g, t: (3 * T) / 4 });
      expect(stateThreeQuarter.equations.angle_theta).toBeCloseTo(-15, 2);

      // At t = T: angle = 0° (full cycle complete)
      const stateFull = evaluateUniversalSpec(simplePendulumPreset, { string_length_L: L, gravity_g: g, t: T });
      expect(stateFull.equations.angle_theta).toBeCloseTo(0, 2);
    });
  });

  describe("Optics Bench Convex Lens Preset", () => {
    it("evaluates lens formula v = (f * u) / (u - f) and reciprocals correctly", () => {
      const res = evaluateUniversalSpec(opticsBenchPreset, {
        object_distance_u: 30,
        focal_length_f: 15,
      });

      expect(res.outputs.image_v).toBe(30);
      expect(res.outputs.inv_u).toBeCloseTo(1 / 30, 4);
      expect(res.outputs.inv_v).toBeCloseTo(1 / 30, 4);
      expect(res.outputs.magnification).toBe(-1);
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
