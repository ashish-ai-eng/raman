import React from "react";
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { UniversalGrapher } from "@/components/student/UniversalGrapher";

describe("UniversalGrapher Component (CL 5.2)", () => {
  it("renders prompt when less than 2 observation points are logged", () => {
    const { container } = render(
      <UniversalGrapher
        points={[{ x: 1, y: 2 }]}
        xAxisLabel="Length L (m)"
        yAxisLabel="Period T² (s²)"
      />
    );

    expect(container.textContent).toContain("Log at least 2 observation trials");
  });

  it("renders scatter plot header, regression formula, and extracted physical constant when points >= 2", () => {
    const points = [
      { x: 0.2, y: 0.8048 },
      { x: 0.4, y: 1.6096 },
      { x: 0.6, y: 2.4144 },
    ];

    const { container } = render(
      <UniversalGrapher
        points={points}
        xAxisLabel="Length L (m)"
        yAxisLabel="Period T² (s²)"
        constantFormula="(4 * PI * PI) / slope"
        constantLabel="Gravity g"
      />
    );

    expect(container.textContent).toContain("Experimental Observation Plot");
    expect(container.textContent).toContain("Gravity g");
    expect(container.textContent).toContain("9.81");
  });
});
