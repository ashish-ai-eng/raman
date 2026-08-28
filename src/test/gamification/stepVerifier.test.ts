import { describe, it, expect } from "vitest";
import { verifyStepAnswer } from "@/lib/gamification/stepVerifier";

describe("Deterministic Step Answer Verifier (CL 5.3)", () => {
  it("marks exact match as correct", () => {
    const res = verifyStepAnswer(2.01, 2.01, 5.0);
    expect(res.isCorrect).toBe(true);
    expect(res.message).toContain("Correct!");
  });

  it("marks answer within ±5% tolerance as correct", () => {
    // Ideal = 2.00, Margin 5% = 0.10 => [1.90, 2.10]
    expect(verifyStepAnswer(2.05, 2.0, 5.0).isCorrect).toBe(true);
    expect(verifyStepAnswer(1.92, 2.0, 5.0).isCorrect).toBe(true);
  });

  it("marks answer outside ±5% tolerance as incorrect", () => {
    expect(verifyStepAnswer(2.25, 2.0, 5.0).isCorrect).toBe(false);
    expect(verifyStepAnswer(1.75, 2.0, 5.0).isCorrect).toBe(false);
  });

  it("handles string input and NaN invalid inputs gracefully", () => {
    expect(verifyStepAnswer("2.01", 2.01, 5.0).isCorrect).toBe(true);
    const invalid = verifyStepAnswer("abc", 2.01, 5.0);
    expect(invalid.isCorrect).toBe(false);
    expect(invalid.message).toContain("Please enter a valid numeric value.");
  });
});
