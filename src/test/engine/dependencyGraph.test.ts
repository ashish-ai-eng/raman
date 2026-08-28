import { describe, it, expect } from "vitest";
import {
  evaluateUniversalSpec,
  applyInstrumentError,
} from "@/lib/engine/dependencyGraph";
import { UniversalPhysicsSpec } from "@/types/upr";

describe("CL 1.4: Directed Dependency Graph & Error Simulator", () => {
  describe("Instrument Error & Calibration Offset Simulator", () => {
    it("applies zero-error calibration offset correctly", () => {
      const val = 10.0;
      const result = applyInstrumentError(val, { zeroError: 0.03 });
      expect(result).toBeCloseTo(10.03, 5);
    });

    it("quantizes values to instrument least-count resolution", () => {
      expect(applyInstrumentError(10.034, { leastCount: 0.01 })).toBe(10.03);
      expect(applyInstrumentError(10.038, { leastCount: 0.01 })).toBe(10.04);
      expect(applyInstrumentError(12.3, { leastCount: 0.5 })).toBe(12.5);
    });

    it("bypasses least-count quantization when skipQuantization flag is true", () => {
      expect(applyInstrumentError(0.033333, { leastCount: 0.1 }, true)).toBeCloseTo(0.033333, 5);
    });

    it("simulates synthetic Gaussian noise within configured noise percentage bounds", () => {
      const baseValue = 100.0;
      const noisyResult = applyInstrumentError(baseValue, { noisePercentage: 5.0 });
      // With 5% noise, value should lie within [95.0, 105.0]
      expect(noisyResult).toBeGreaterThanOrEqual(95.0);
      expect(noisyResult).toBeLessThanOrEqual(105.0);
    });

    it("returns untouched values for NaN or infinite inputs", () => {
      expect(applyInstrumentError(NaN, { zeroError: 0.05 })).toBeNaN();
      expect(applyInstrumentError(Infinity, { leastCount: 0.01 })).toBe(Infinity);
    });
  });

  describe("Directed Dependency Graph Solver", () => {
    it("topologically sorts and resolves inputs -> intermediate equations -> outputs in correct order", () => {
      const complexSpec: UniversalPhysicsSpec = {
        id: "multi-stage-dependency",
        name: "Multi-stage Dependency Test",
        description: "Tests multi-pass topological evaluation",
        inputs: {
          x: { id: "x", label: "X", type: "slider", min: 1, max: 10, step: 1, defaultValue: 2, unit: "" },
        },
        equations: {
          // eq2 depends on eq1
          eq2: { id: "eq2", expression: "eq1 * 3" },
          // eq1 depends on input x
          eq1: { id: "eq1", expression: "x + 5" },
          // eq3 depends on eq2
          eq3: { id: "eq3", expression: "eq2 ^ 2" },
        },
        outputs: {
          final_out: { id: "final_out", label: "Final", unit: "", expression: "eq3", precision: 2 },
        },
      };

      // x = 2
      // eq1 = 2 + 5 = 7
      // eq2 = 7 * 3 = 21
      // eq3 = 21 ^ 2 = 441
      // final_out = 441
      const res = evaluateUniversalSpec(complexSpec, { x: 2 });
      expect(res.equations.eq1).toBe(7);
      expect(res.equations.eq2).toBe(21);
      expect(res.equations.eq3).toBe(441);
      expect(res.outputs.final_out).toBe(441);
    });

    it("gracefully evaluates specs with zero-error calibration applied to outputs", () => {
      const vernierSpec: UniversalPhysicsSpec = {
        id: "vernier-caliper-test",
        name: "Vernier Caliper Test",
        description: "Zero error offset calibration",
        inputs: {
          object_d: { id: "object_d", label: "Diameter", type: "slider", min: 0, max: 10, step: 0.01, defaultValue: 2.34, unit: "cm" },
        },
        equations: {
          raw: { id: "raw", expression: "object_d" },
        },
        outputs: {
          measured_d: { id: "measured_d", label: "Measured", unit: "cm", expression: "raw", precision: 2 },
        },
        errorModel: {
          zeroError: 0.03,
          leastCount: 0.01,
        },
      };

      const res = evaluateUniversalSpec(vernierSpec, { object_d: 2.34 });
      expect(res.outputs.measured_d).toBe(2.37);
      expect(res.rawOutputs.measured_d).toBe(2.34);
    });
  });
});
