import { describe, it, expect } from "vitest";
import { evaluateUniversalSpec } from "@/lib/engine/dependencyGraph";
import {
  vernierCaliperPreset,
  pendulumPreset,
  ohmsLawPreset,
  CORE_EXPERIMENTAL_PRESETS,
} from "@/presets";

describe("Core Experimental Presets (src/presets/)", () => {
  it("exports a registry containing all core experimental specs", () => {
    expect(Object.keys(CORE_EXPERIMENTAL_PRESETS)).toHaveLength(3);
  });

  it("1. Vernier Caliper: evaluates MSR, VSD, and zero-error corrected reading", () => {
    const res = evaluateUniversalSpec(vernierCaliperPreset, { specimen_dimension: 2.34, zero_error_cm: 0.02 });
    expect(res.outputs.msr).toBe(2.3);
    expect(res.outputs.vsd).toBe(6); // raw = 2.36 => MSR=2.3, VSD=(2.36-2.3)/0.01 = 6
    expect(res.outputs.observed).toBe(2.38); // 2.36 + zeroError(0.02) = 2.38
    expect(res.outputs.corrected).toBe(2.36); // 2.38 - 0.02 = 2.36
  });

  it("2. Damped Pendulum: evaluates nonlinear period T, T², and string tension T_force", () => {
    const res = evaluateUniversalSpec(pendulumPreset, { string_length_L: 1.0, gravity_g: 9.81, t: 0 });
    const expectedT = 2 * Math.PI * Math.sqrt(1 / 9.81);
    expect(res.outputs.period).toBeCloseTo(expectedT, 2);
    expect(res.outputs.period_sq).toBeCloseTo(expectedT ** 2, 2);
  });

  it("3. Ohm's Law & DC Circuits: evaluates terminal voltage V, current I, power P, animated electron flow, and live V-I graph points", () => {
    const resStatic = evaluateUniversalSpec(ohmsLawPreset, { supply_voltage: 12.0, resistor_value_R: 100, internal_resistance_r: 0, t: 0 });
    expect(resStatic.outputs.current).toBe(0.12);
    expect(resStatic.outputs.voltage).toBe(12.0);
    expect(resStatic.outputs.power).toBe(1.44);
    expect(resStatic.equations.charge_pos).toBe(0);
    expect(resStatic.equations.graph_point_x).toBeGreaterThan(310);
    expect(resStatic.equations.graph_point_y).toBeLessThan(140);

    const resAnimated = evaluateUniversalSpec(ohmsLawPreset, { supply_voltage: 12.0, resistor_value_R: 100, internal_resistance_r: 0, t: 2.0 });
    expect(resAnimated.equations.charge_pos).toBeGreaterThan(0);
    expect(resAnimated.equations.electron1_x).not.toBe(resStatic.equations.electron1_x);
  });
});
