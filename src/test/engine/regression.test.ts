import { describe, it, expect } from "vitest";
import { calculateLinearRegression } from "@/lib/engine/regression";

describe("CL 1.5: Universal Linear Regression & Constant Extraction Engine", () => {
  it("returns zero default values for empty or single-point datasets", () => {
    expect(calculateLinearRegression([])).toEqual({
      slope: 0,
      intercept: 0,
      rSquared: 0,
      pointCount: 0,
    });

    expect(calculateLinearRegression([{ x: 1, y: 2 }])).toEqual({
      slope: 0,
      intercept: 0,
      rSquared: 0,
      pointCount: 1,
    });
  });

  it("calculates exact slope, intercept, and R^2 = 1.0 for perfect linear synthetic data (Y = 3X + 5)", () => {
    const points = [
      { x: 1, y: 8 },
      { x: 2, y: 11 },
      { x: 3, y: 14 },
      { x: 4, y: 17 },
      { x: 5, y: 20 },
    ];

    const res = calculateLinearRegression(points);
    expect(res.slope).toBe(3);
    expect(res.intercept).toBe(5);
    expect(res.rSquared).toBe(1);
    expect(res.pointCount).toBe(5);
  });

  it("handles vertical lines with identical X coordinates gracefully without division by zero", () => {
    const points = [
      { x: 5, y: 10 },
      { x: 5, y: 20 },
      { x: 5, y: 30 },
    ];

    const res = calculateLinearRegression(points);
    expect(res.slope).toBe(0);
    expect(res.intercept).toBe(20);
    expect(res.rSquared).toBe(0);
  });

  it("extracts acceleration due to gravity (g) from synthetic pendulum T² vs L dataset", () => {
    // T^2 = (4 * PI^2 / g) * L
    // For g = 9.81, slope m = (4 * PI^2) / 9.81 = 4.024285
    const lengths = [0.2, 0.4, 0.6, 0.8, 1.0, 1.2];
    const syntheticPoints = lengths.map((L) => ({
      x: L,
      y: parseFloat(((4 * Math.PI ** 2 * L) / 9.81).toFixed(4)),
    }));

    const res = calculateLinearRegression(
      syntheticPoints,
      "(4 * PI * PI) / slope",
      "Acceleration due to gravity (g)"
    );

    expect(res.slope).toBeCloseTo(4.024, 2);
    expect(res.rSquared).toBeGreaterThan(0.999);
    expect(res.extractedConstant?.label).toBe("Acceleration due to gravity (g)");
    expect(res.extractedConstant?.value).toBeCloseTo(9.81, 1);
  });

  it("extracts focal length f from synthetic optics 1/v vs 1/u dataset", () => {
    // 1/v = -1/u + 1/f => y-intercept c = 1/f => f = 1/c
    // For f = 15 cm, 1/f = 0.066667 cm⁻¹
    const uValues = [25, 30, 35, 40, 50, 60];
    const syntheticPoints = uValues.map((u) => {
      const v = (15 * u) / (u - 15);
      return {
        x: 1 / u,
        y: 1 / v,
      };
    });

    const res = calculateLinearRegression(
      syntheticPoints,
      "1 / intercept",
      "Lens Focal Length (f)"
    );

    expect(res.slope).toBeCloseTo(-1.0, 2);
    expect(res.intercept).toBeCloseTo(0.0667, 3);
    expect(res.extractedConstant?.label).toBe("Lens Focal Length (f)");
    expect(res.extractedConstant?.value).toBeCloseTo(15.0, 1);
  });

  it("extracts resistance R from synthetic Ohm's Law V vs I dataset", () => {
    // V = R * I => slope m = R
    const currentValues = [0.05, 0.1, 0.15, 0.2, 0.25];
    const R_true = 120; // 120 Ohms
    const syntheticPoints = currentValues.map((I) => ({
      x: I,
      y: I * R_true,
    }));

    const res = calculateLinearRegression(
      syntheticPoints,
      "slope",
      "Circuit Resistance (R)"
    );

    expect(res.slope).toBe(120);
    expect(res.rSquared).toBe(1);
    expect(res.extractedConstant?.value).toBe(120);
  });

  it("correctly measures R² drop on noisy experimental data", () => {
    const noisyPoints = [
      { x: 1, y: 2.1 },
      { x: 2, y: 3.9 },
      { x: 3, y: 6.2 },
      { x: 4, y: 7.8 },
      { x: 5, y: 10.5 },
    ];

    const res = calculateLinearRegression(noisyPoints);
    expect(res.slope).toBeCloseTo(2.08, 1);
    expect(res.rSquared).toBeGreaterThan(0.98);
    expect(res.rSquared).toBeLessThan(1.0);
  });
});
