import { describe, it, expect } from "vitest";
import { evaluateUniversalSpec } from "@/lib/engine/dependencyGraph";
import {
  vernierCaliperPreset,
  screwGaugePreset,
  newtonsLawsPreset,
  pendulumPreset,
  rayOpticsPreset,
  ohmsLawPreset,
  CORE_EXPERIMENTAL_PRESETS,
} from "@/presets";

describe("6 Core Experimental Presets (src/presets/)", () => {
  it("exports a registry containing all 6 core experimental specs", () => {
    expect(Object.keys(CORE_EXPERIMENTAL_PRESETS)).toHaveLength(6);
  });

  it("1. Vernier Caliper: evaluates MSR, VSD, and zero-error corrected reading", () => {
    const res = evaluateUniversalSpec(vernierCaliperPreset, { specimen_dimension: 2.34, zero_error_cm: 0.02 });
    expect(res.outputs.msr).toBe(2.3);
    expect(res.outputs.vsd).toBe(6); // raw = 2.36 => MSR=2.3, VSD=(2.36-2.3)/0.01 = 6
    expect(res.outputs.observed).toBe(2.38); // 2.36 + zeroError(0.02) = 2.38
    expect(res.outputs.corrected).toBe(2.36); // 2.38 - 0.02 = 2.36
  });

  it("2. Micrometer Screw Gauge: evaluates pitch sleeve MSR and circular CSR", () => {
    const res = evaluateUniversalSpec(screwGaugePreset, { specimen_thickness_mm: 1.25, zero_error_mm: 0.02 });
    expect(res.outputs.msr).toBe(1.02);
    expect(res.outputs.csr).toBe(27); // raw = 1.27 => MSR=1.0, CSR=27
    expect(res.outputs.observed).toBe(1.29); // 1.27 + zeroError(0.02) = 1.29
    expect(res.outputs.corrected).toBe(1.27); // 1.29 - 0.02 = 1.27
  });

  it("3. Newton's Laws & Incline: evaluates normal force, friction, and net downslope acceleration", () => {
    const res = evaluateUniversalSpec(newtonsLawsPreset, { incline_angle_deg: 30, block_mass_kg: 2.0 });
    expect(res.outputs.weight).toBeCloseTo(19.62, 1);
    expect(res.outputs.normal).toBeCloseTo(16.99, 1);
    expect(res.outputs.accel).toBeGreaterThan(0);
  });

  it("4. Damped Pendulum: evaluates nonlinear period T, T², and string tension T_force", () => {
    const res = evaluateUniversalSpec(pendulumPreset, { string_length_L: 1.0, gravity_g: 9.81, t: 0 });
    const expectedT = 2 * Math.PI * Math.sqrt(1 / 9.81);
    expect(res.outputs.period).toBeCloseTo(expectedT, 2);
    expect(res.outputs.period_sq).toBeCloseTo(expectedT ** 2, 2);
  });

  it("5. Geometrical Ray Optics: verifies thin lens formula 1/f = 1/v - 1/u and magnification m = v/u", () => {
    const res = evaluateUniversalSpec(rayOpticsPreset, { object_distance_u: 30, focal_length_f: 15 });
    expect(res.outputs.image_v).toBe(30);
    expect(res.outputs.inv_u).toBeCloseTo(1 / 30, 4);
    expect(res.outputs.inv_v).toBeCloseTo(1 / 30, 4);
    expect(res.outputs.magnification).toBe(-1);
  });

  it("6. Ohm's Law & DC Circuits: evaluates terminal voltage V, current I, and power P", () => {
    const res = evaluateUniversalSpec(ohmsLawPreset, { supply_voltage: 12.0, resistor_value_R: 100, internal_resistance_r: 0 });
    expect(res.outputs.current).toBe(0.12);
    expect(res.outputs.voltage).toBe(12.0);
    expect(res.outputs.power).toBe(1.44);
  });
});
