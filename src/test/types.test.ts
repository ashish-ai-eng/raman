import { describe, it, expect } from "vitest";
import { UniversalPhysicsSpec } from "@/types/upr";
import { LabSpec } from "@/types/labSpec";

describe("Domain Type Definitions (CL 1.2)", () => {
  it("instantiates a valid UniversalPhysicsSpec object", () => {
    const spec: UniversalPhysicsSpec = {
      id: "lens-lab-widget",
      name: "Optics Bench Widget",
      description: "Interactive convex lens bench",
      inputs: {
        object_distance_u: {
          id: "object_distance_u",
          label: "Object Distance (u)",
          type: "slider",
          min: 10,
          max: 100,
          step: 1,
          defaultValue: 30,
          unit: "cm",
        },
      },
      equations: {
        v_calc: {
          id: "v_calc",
          expression: "(15 * object_distance_u) / (object_distance_u - 15)",
        },
      },
      outputs: {
        image_distance_v: {
          id: "image_distance_v",
          label: "Image Distance (v)",
          unit: "cm",
          expression: "v_calc",
          precision: 2,
        },
      },
      errorModel: {
        zeroError: 0.05,
        leastCount: 0.1,
      },
    };

    expect(spec.id).toBe("lens-lab-widget");
    expect(spec.inputs.object_distance_u.defaultValue).toBe(30);
    expect(spec.outputs.image_distance_v.precision).toBe(2);
  });

  it("instantiates a valid LabSpec object", () => {
    const lab: LabSpec = {
      id: "optics-101",
      title: "Convex Lens Focal Length Determination",
      topic: "Optics",
      conceptSummary: "Determine the focal length f of a convex lens using u-v method.",
      funFacts: ["Lenses are used in human eyes, telescopes, and cameras!"],
      widget: {
        id: "lens-widget",
        name: "Lens Widget",
        description: "Lens Bench",
        inputs: {},
        equations: {},
        outputs: {},
      },
      observationSchema: {
        parametersToRecord: ["u", "v"],
        calculatedValues: [],
        graphConfig: {
          xAxisKey: "1/u",
          yAxisKey: "1/v",
          xAxisLabel: "1/u (cm⁻¹)",
          yAxisLabel: "1/v (cm⁻¹)",
        },
      },
      steps: [
        {
          stepNumber: 1,
          instruction: "Set object distance u to 30 cm and record image position v.",
          idealAnswerType: "numeric",
          idealAnswerFormulaOrValue: 30,
          tolerancePercent: 5,
          hint: "Adjust the screen until image is sharp.",
        },
      ],
      challenges: [
        {
          id: "optics-master",
          description: "Complete 5 focal length measurements.",
          requirementType: "trials_logged",
          targetCount: 5,
          stickerReward: {
            id: "lens-badge",
            name: "Optics Apprentice",
            description: "Master of convex lenses",
            icon: "lens-badge.svg",
          },
        },
      ],
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    expect(lab.title).toContain("Convex Lens");
    expect(lab.steps).toHaveLength(1);
    expect(lab.status).toBe("draft");
  });
});
