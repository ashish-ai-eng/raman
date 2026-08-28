import { describe, it, expect } from "vitest";
import { UniversalPhysicsSpecSchema, LabSpecSchema } from "@/lib/agent/schemas";
import { evaluateUniversalSpec } from "@/lib/engine/dependencyGraph";
import { calculateLinearRegression } from "@/lib/engine/regression";
import { verifyStepAnswer } from "@/lib/gamification/stepVerifier";
import { LabSpec } from "@/types/labSpec";

describe("CL 6.2: End-to-End Platform Integration Suite", () => {
  it("executes the full platform lifecycle from AI authoring to student sticker unlock", () => {
    // ------------------------------------------------------------------------
    // Step 1: Teacher AI Studio generates custom Hooke's Law Mass-Spring widget
    // ------------------------------------------------------------------------
    const customHookesLawSpec = {
      id: "generated-hookes-law-e2e",
      name: "Hooke's Law Mass-Spring System",
      description: "Measure spring extension x versus hanging mass m.",
      inputs: {
        hanging_mass_m: {
          id: "hanging_mass_m",
          label: "Hanging Mass m (kg)",
          type: "slider" as const,
          min: 0.1,
          max: 2.0,
          step: 0.1,
          defaultValue: 0.5,
          unit: "kg",
        },
        spring_constant_k: {
          id: "spring_constant_k",
          label: "Spring Constant k (N/m)",
          type: "slider" as const,
          min: 10,
          max: 100,
          step: 5,
          defaultValue: 49.05, // chosen so extension x = (m*9.81)/49.05 = m * 0.2
          unit: "N/m",
        },
      },
      equations: {
        weight_force_F: { id: "weight_force_F", expression: "hanging_mass_m * G" },
        extension_x: { id: "extension_x", expression: "weight_force_F / spring_constant_k" },
      },
      outputs: {
        force_F: { id: "force_F", label: "Weight Force F", unit: "N", expression: "weight_force_F", precision: 2 },
        stretch_x: { id: "extension_x", label: "Extension x", unit: "m", expression: "extension_x", precision: 3 },
      },
      errorModel: { leastCount: 0.001 },
      visuals: [
        { type: "scale" as const, id: "ruler", xExpression: "0", yExpression: "0" },
      ],
    };

    // Assert schema validity
    const widgetValidation = UniversalPhysicsSpecSchema.safeParse(customHookesLawSpec);
    expect(widgetValidation.success).toBe(true);

    // ------------------------------------------------------------------------
    // Step 2: Teacher Verification Sandbox & Lab Release
    // ------------------------------------------------------------------------
    const draftLab: LabSpec = {
      id: "hooke-101",
      title: "Hooke's Law Lab",
      topic: "Mechanics",
      conceptSummary: "Determine spring constant k.",
      funFacts: ["Robert Hooke formulated Ut tensio, sic vis in 1676!"],
      widget: customHookesLawSpec,
      observationSchema: {
        parametersToRecord: ["hanging_mass_m", "extension_x"],
        calculatedValues: [],
        graphConfig: {
          xAxisKey: "hanging_mass_m",
          yAxisKey: "extension_x",
          xAxisLabel: "Mass m (kg)",
          yAxisLabel: "Extension x (m)",
          extractedConstantLabel: "Spring Constant k",
          extractedConstantFormula: "9.81 / slope",
        },
      },
      steps: [
        {
          stepNumber: 1,
          instruction: "Measure extension x for mass m = 1.0 kg.",
          idealAnswerType: "numeric",
          idealAnswerFormulaOrValue: 0.2, // 1.0 * 9.81 / 49.05 = 0.2 m
          tolerancePercent: 5,
          hint: "Check extension output readout.",
        },
      ],
      challenges: [
        {
          id: "hooke-master",
          description: "Log 5 trials",
          requirementType: "trials_logged",
          stickerReward: {
            id: "badge-hooke",
            name: "Master of Elasticity",
            description: "Master of Hooke's Law",
            icon: "hooke.svg",
          },
        },
      ],
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    expect(LabSpecSchema.safeParse(draftLab).success).toBe(true);

    // Approve release
    const publishedLab: LabSpec = {
      ...draftLab,
      status: "published",
      updatedAt: new Date().toISOString(),
    };
    expect(publishedLab.status).toBe("published");

    // ------------------------------------------------------------------------
    // Step 3: Student Lab Execution & Observation Trial Logging
    // ------------------------------------------------------------------------
    const masses = [0.2, 0.4, 0.6, 0.8, 1.0];
    const loggedPoints = masses.map((m) => {
      const state = evaluateUniversalSpec(customHookesLawSpec, { hanging_mass_m: m });
      return {
        x: m,
        y: state.outputs.stretch_x,
      };
    });

    expect(loggedPoints).toHaveLength(5);

    // ------------------------------------------------------------------------
    // Step 4: Universal Linear Regression & Constant Extraction
    // ------------------------------------------------------------------------
    const regression = calculateLinearRegression(
      loggedPoints,
      "9.81 / slope",
      "Spring Constant k"
    );

    expect(regression.slope).toBeCloseTo(0.2, 3); // slope = g / k = 9.81 / 49.05 = 0.2
    expect(regression.rSquared).toBeGreaterThan(0.99);
    expect(regression.extractedConstant?.label).toBe("Spring Constant k");
    expect(regression.extractedConstant?.value).toBeCloseTo(49.05, 1);

    // ------------------------------------------------------------------------
    // Step 5: Step Answer Verification & Sticker Unlock
    // ------------------------------------------------------------------------
    const stepVerification = verifyStepAnswer(0.2, 0.2, 5.0);
    expect(stepVerification.isCorrect).toBe(true);
  });
});
