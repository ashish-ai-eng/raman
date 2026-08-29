import { describe, it, expect } from "vitest";
import { UniversalPhysicsSpecSchema, LabSpecSchema } from "@/lib/agent/schemas";
import { simplePendulumPreset } from "@/lib/engine/presets";
import { evaluateUniversalSpec } from "@/lib/engine/dependencyGraph";

describe("CL 3.1 & 3.2: AI Studio Schemas & Chat API", () => {
  it("validates preset physics specs against UniversalPhysicsSpecSchema Zod schema", () => {
    const result = UniversalPhysicsSpecSchema.safeParse(simplePendulumPreset);
    expect(result.success).toBe(true);
  });

  it("fails Zod schema validation if required fields are missing", () => {
    const invalidSpec = {
      id: "invalid-spec",
      name: "Missing Inputs",
      // missing inputs, equations, outputs
    };

    const result = UniversalPhysicsSpecSchema.safeParse(invalidSpec);
    expect(result.success).toBe(false);
  });

  it("verifies pendulum initial state (t = 0) hangs straight down vertically at theta = 0", () => {
    const evalState = evaluateUniversalSpec(simplePendulumPreset, {
      string_length_L: 1.0,
      t: 0,
    });

    // At t = 0, sin(0) = 0 => angle_theta = 0
    expect(evalState.equations.angle_theta).toBe(0);
    // bob_x = 150 + sin(0) * L * 80 = 150 (perfectly aligned with fixed support anchorX = 150)
    expect(evalState.equations.bob_x).toBe(150);
    // bob_y = 15 + cos(0) * 1.0 * 80 = 95
    expect(evalState.equations.bob_y).toBe(95);
  });

  it("validates complete lab spec objects against LabSpecSchema Zod schema", () => {
    const sampleLab = {
      id: "lab-101",
      title: "Simple Pendulum Lab",
      topic: "Mechanics",
      conceptSummary: "Determine g using pendulum T² vs L graph.",
      funFacts: ["Pendulums were used by Galileo!"],
      widget: simplePendulumPreset,
      observationSchema: {
        parametersToRecord: ["string_length_L", "time_period"],
        calculatedValues: [],
        graphConfig: {
          xAxisKey: "string_length_L",
          yAxisKey: "period_squared",
          xAxisLabel: "Length L (m)",
          yAxisLabel: "Period T² (s²)",
          expectedSlopeFormula: "(4 * PI * PI) / 9.81",
        },
      },
      steps: [
        {
          stepNumber: 1,
          instruction: "Set length to 1.0 m and measure period.",
          idealAnswerType: "numeric" as const,
          idealAnswerFormulaOrValue: 2.01,
          tolerancePercent: 5,
          hint: "Watch 10 oscillations.",
        },
      ],
      challenges: [
        {
          id: "challenge-1",
          description: "Log 5 trials",
          requirementType: "trials_logged" as const,
          stickerReward: {
            id: "badge-1",
            name: "Pendulum Master",
            description: "Master of oscillations",
            icon: "pendulum.svg",
          },
        },
      ],
      status: "draft" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = LabSpecSchema.safeParse(sampleLab);
    expect(result.success).toBe(true);
  });
});
