import { describe, it, expect } from "vitest";
import { evaluateMath } from "@/lib/engine/evaluator";
import {
  evaluateUniversalSpec,
  applyInstrumentError,
} from "@/lib/engine/dependencyGraph";
import { calculateLinearRegression } from "@/lib/engine/regression";
import { UniversalPhysicsSpec } from "@/types/upr";

describe("Universal Physics Engine Core (CL 1.3)", () => {
  describe("Safe AST Math Evaluator", () => {
    it("evaluates simple arithmetic and operator precedence correctly", () => {
      expect(evaluateMath("2 + 3 * 4")).toBe(14);
      expect(evaluateMath("(2 + 3) * 4")).toBe(20);
      expect(evaluateMath("10 / 2 - 3")).toBe(2);
      expect(evaluateMath("2 ^ 3")).toBe(8);
      expect(evaluateMath("10 % 3")).toBe(1);
    });

    it("evaluates expressions with variables and constants", () => {
      expect(evaluateMath("PI * r ^ 2", { r: 5 })).toBeCloseTo(Math.PI * 25, 5);
      expect(evaluateMath("m * G * h", { m: 2, h: 10 })).toBeCloseTo(2 * 9.81 * 10, 5);
      expect(evaluateMath("(f * u) / (u - f)", { f: 15, u: 30 })).toBe(30);
    });

    it("evaluates built-in math functions", () => {
      expect(evaluateMath("sqrt(16)")).toBe(4);
      expect(evaluateMath("abs(-42)")).toBe(42);
      expect(evaluateMath("sin(90)")).toBeCloseTo(1, 5);
      expect(evaluateMath("cos(0)")).toBeCloseTo(1, 5);
      expect(evaluateMath("min(10, 20)")).toBe(10);
      expect(evaluateMath("max(10, 20)")).toBe(20);
    });

    it("handles division by zero safely", () => {
      expect(evaluateMath("10 / 0")).toBeNaN();
    });

    it("throws clear error on invalid tokens or missing variables", () => {
      expect(() => evaluateMath("2 + @")).toThrow();
      expect(() => evaluateMath("x + 5")).toThrow("Undefined variable 'x'");
    });
  });

  describe("Instrument Error & Quantization Model", () => {
    it("applies zero-error calibration offset", () => {
      const val = 10.0;
      const result = applyInstrumentError(val, { zeroError: 0.03 });
      expect(result).toBeCloseTo(10.03, 5);
    });

    it("quantizes values to instrument least count resolution", () => {
      expect(applyInstrumentError(10.034, { leastCount: 0.01 })).toBe(10.03);
      expect(applyInstrumentError(10.038, { leastCount: 0.01 })).toBe(10.04);
      expect(applyInstrumentError(12.3, { leastCount: 0.5 })).toBe(12.5);
    });
  });

  describe("Dependency Graph & Spec Evaluator", () => {
    it("topologically resolves inputs -> equations -> outputs for a pendulum spec", () => {
      const pendulumSpec: UniversalPhysicsSpec = {
        id: "simple-pendulum",
        name: "Simple Pendulum Widget",
        description: "Oscillating pendulum",
        inputs: {
          length_L: {
            id: "length_L",
            label: "String Length (m)",
            type: "slider",
            min: 0.1,
            max: 2.0,
            step: 0.1,
            defaultValue: 1.0,
            unit: "m",
          },
          gravity_g: {
            id: "gravity_g",
            label: "Gravity (m/s²)",
            type: "slider",
            min: 1.0,
            max: 25.0,
            step: 0.1,
            defaultValue: 9.81,
            unit: "m/s²",
          },
        },
        equations: {
          period_T: {
            id: "period_T",
            expression: "2 * PI * sqrt(length_L / gravity_g)",
          },
          period_squared: {
            id: "period_squared",
            expression: "period_T ^ 2",
          },
        },
        outputs: {
          time_period: {
            id: "time_period",
            label: "Period T",
            unit: "s",
            expression: "period_T",
            precision: 3,
          },
          t_squared: {
            id: "t_squared",
            label: "Period T²",
            unit: "s²",
            expression: "period_squared",
            precision: 3,
          },
        },
      };

      const result = evaluateUniversalSpec(pendulumSpec, { length_L: 1.0, gravity_g: 9.81 });

      const expectedT = 2 * Math.PI * Math.sqrt(1 / 9.81);
      expect(result.equations.period_T).toBeCloseTo(expectedT, 4);
      expect(result.outputs.time_period).toBe(parseFloat(expectedT.toFixed(3)));
      expect(result.outputs.t_squared).toBe(parseFloat((expectedT ** 2).toFixed(3)));
    });
  });

  describe("Universal Linear Regression Engine", () => {
    it("calculates exact slope, intercept, and R^2 for ideal linear data", () => {
      // Data matching Y = 2X + 1
      const points = [
        { x: 1, y: 3 },
        { x: 2, y: 5 },
        { x: 3, y: 7 },
        { x: 4, y: 9 },
      ];

      const res = calculateLinearRegression(points);
      expect(res.slope).toBe(2);
      expect(res.intercept).toBe(1);
      expect(res.rSquared).toBe(1);
      expect(res.pointCount).toBe(4);
    });

    it("evaluates physical constant formulas from regression slope", () => {
      // Pendulum T^2 vs L where slope m = 4*PI^2 / g => g = (4*PI^2) / slope
      // If g = 9.81, slope m = 4.024
      const points = [
        { x: 0.2, y: 0.8048 },
        { x: 0.4, y: 1.6096 },
        { x: 0.6, y: 2.4144 },
        { x: 0.8, y: 3.2192 },
      ];

      const res = calculateLinearRegression(
        points,
        "(4 * PI * PI) / slope",
        "Acceleration due to gravity (g)"
      );

      expect(res.slope).toBeCloseTo(4.024, 2);
      expect(res.extractedConstant?.label).toBe("Acceleration due to gravity (g)");
      expect(res.extractedConstant?.value).toBeCloseTo(9.81, 1);
    });
  });
});
