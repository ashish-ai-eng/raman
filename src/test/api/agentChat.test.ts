import { describe, it, expect } from "vitest";
import { UniversalPhysicsSpecSchema, LabSpecSchema } from "@/lib/agent/schemas";
import { simplePendulumPreset } from "@/lib/engine/presets";

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
