import React from "react";
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { PrimitiveRenderer } from "@/components/widgets/renderer/PrimitiveRenderer";
import { VisualPrimitive } from "@/types/upr";

describe("PrimitiveRenderer Component (CL 2.1)", () => {
  it("renders scale primitive SVG element correctly", () => {
    const primitive: VisualPrimitive = {
      type: "scale",
      id: "test-scale",
      xExpression: "10",
      yExpression: "20",
      properties: { length: 200 },
    };

    const { container } = render(
      <svg>
        <PrimitiveRenderer primitive={primitive} evalContext={{}} />
      </svg>
    );

    const rect = container.querySelector("rect");
    expect(rect).not.toBeNull();
    expect(rect?.getAttribute("width")).toBe("200");
  });

  it("renders lens primitive with convex lens shape", () => {
    const primitive: VisualPrimitive = {
      type: "lens",
      id: "convex-lens",
      xExpression: "100",
      yExpression: "50",
    };

    const { container } = render(
      <svg>
        <PrimitiveRenderer primitive={primitive} evalContext={{}} />
      </svg>
    );

    const path = container.querySelector("path");
    expect(path).not.toBeNull();
    expect(container.textContent).toContain("Convex Lens");
  });

  it("renders digital display readout with custom label and value", () => {
    const primitive: VisualPrimitive = {
      type: "digital_display",
      id: "display-1",
      xExpression: "0",
      yExpression: "0",
      properties: { label: "Voltmeter", value: "5.25 V" },
    };

    const { container } = render(
      <svg>
        <PrimitiveRenderer primitive={primitive} evalContext={{}} />
      </svg>
    );

    expect(container.textContent).toContain("Voltmeter");
    expect(container.textContent).toContain("5.25 V");
  });
});
