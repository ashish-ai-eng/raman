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

  it("renders Vernier Caliper instrument with main scale, sliding jaw, and clamped object", () => {
    const primitive: VisualPrimitive = {
      type: "vernier_caliper",
      id: "vernier-1",
      xExpression: "0",
      yExpression: "0",
      properties: {
        gapExpression: "gap_val",
        objectType: "sphere",
        objectLabel: "Sphere",
      },
    };

    const { getByTestId, container } = render(
      <svg>
        <PrimitiveRenderer primitive={primitive} evalContext={{ gap_val: 2.34 }} />
      </svg>
    );

    expect(getByTestId("vernier-caliper-instrument")).not.toBeNull();
    expect(getByTestId("vernier-sliding-jaw")).not.toBeNull();
    expect(getByTestId("clamped-object")).not.toBeNull();
    expect(container.textContent).toContain("Vernier Scale");
    expect(container.textContent).toContain("Sphere");
  });

  it("renders Pendulum widget setup with fixed support stand, solid string, and bob", () => {
    const primitive: VisualPrimitive = {
      type: "bob",
      id: "bob-1",
      xExpression: "180",
      yExpression: "100",
      properties: { radius: 16, anchorX: 150, anchorY: 15 },
    };

    const { getByTestId } = render(
      <svg>
        <PrimitiveRenderer primitive={primitive} evalContext={{}} />
      </svg>
    );

    expect(getByTestId("pendulum-setup")).not.toBeNull();
    expect(getByTestId("fixed-support-stand")).not.toBeNull();
    expect(getByTestId("pendulum-string")).not.toBeNull();
    expect(getByTestId("pendulum-bob")).not.toBeNull();

    const stringLine = getByTestId("pendulum-string");
    expect(stringLine.getAttribute("x1")).toBe("150");
    expect(stringLine.getAttribute("y1")).toBe("15");
    expect(stringLine.getAttribute("x2")).toBe("180");
    expect(stringLine.getAttribute("y2")).toBe("100");
  });
});
