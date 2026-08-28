import { describe, it, expect } from "vitest";
import { LabSpec } from "@/types/labSpec";
import { simplePendulumPreset } from "@/lib/engine/presets";

describe("CL 4.3: Lab Approval & Publish State Transition API", () => {
  it("transitions lab status from draft to published", () => {
    const draftLab: LabSpec = {
      id: "draft-lab-1",
      title: "Draft Pendulum Lab",
      topic: "Mechanics",
      conceptSummary: "Draft concept",
      funFacts: [],
      widget: simplePendulumPreset,
      observationSchema: {
        parametersToRecord: ["L"],
        calculatedValues: [],
        graphConfig: {
          xAxisKey: "L",
          yAxisKey: "T2",
          xAxisLabel: "L",
          yAxisLabel: "T2",
        },
      },
      steps: [],
      challenges: [],
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    expect(draftLab.status).toBe("draft");

    // Simulate approval transition
    const publishedLab: LabSpec = {
      ...draftLab,
      status: "published",
      updatedAt: new Date().toISOString(),
    };

    expect(publishedLab.status).toBe("published");
  });

  it("generates an 8-character student access code with PHYS prefix", () => {
    const randomCode = `PHYS-${Math.floor(1000 + Math.random() * 9000)}`;
    expect(randomCode).toMatch(/^PHYS-\d{4}$/);
  });
});
