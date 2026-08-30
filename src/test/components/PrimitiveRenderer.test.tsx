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
    expect(container.querySelector('[data-testid="ray-optics-bench"]')).not.toBeNull();
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
    expect(container.textContent).toContain("1 cm");
    expect(container.textContent).toContain("10 cm");
  });

  it("updates object shape/label dynamically when specimen selection changes", () => {
    const primitive: VisualPrimitive = {
      type: "vernier_caliper",
      id: "vernier-1",
      xExpression: "0",
      yExpression: "0",
      properties: {
        gapExpression: "gap_val",
      },
    };

    // specimen 1 -> Steel Sphere
    const { container: c1 } = render(
      <svg>
        <PrimitiveRenderer primitive={primitive} evalContext={{ gap_val: 2.34, specimen_selection: 1 }} />
      </svg>
    );
    expect(c1.textContent).toContain("Steel Sphere");

    // specimen 2 -> Brass Cylinder
    const { container: c2 } = render(
      <svg>
        <PrimitiveRenderer primitive={primitive} evalContext={{ gap_val: 4.50, specimen_selection: 2 }} />
      </svg>
    );
    expect(c2.textContent).toContain("Brass Cylinder");

    // specimen 3 -> Aluminum Block
    const { container: c3 } = render(
      <svg>
        <PrimitiveRenderer primitive={primitive} evalContext={{ gap_val: 1.80, specimen_selection: 3 }} />
      </svg>
    );
    expect(c3.textContent).toContain("Aluminum Block");
  });

  it("reflects zero error offset in sliding jaw position and calculated outputs", () => {
    const primitive: VisualPrimitive = {
      type: "vernier_caliper",
      id: "vernier-1",
      xExpression: "0",
      yExpression: "0",
      properties: {
        gapExpression: "observed_reading",
      },
    };

    const { getByTestId: getByTestId1, unmount: unmount1 } = render(
      <svg>
        <PrimitiveRenderer primitive={primitive} evalContext={{ observed_reading: 2.34 }} />
      </svg>
    );
    const transform1 = getByTestId1("vernier-sliding-jaw").getAttribute("transform");
    unmount1();

    const { getByTestId: getByTestId2 } = render(
      <svg>
        <PrimitiveRenderer primitive={primitive} evalContext={{ observed_reading: 2.38 }} />
      </svg>
    );
    const transform2 = getByTestId2("vernier-sliding-jaw").getAttribute("transform");

    expect(transform1).not.toEqual(transform2);

    // specimen 4 -> Bronze Coin
    const { container: c4 } = render(
      <svg>
        <PrimitiveRenderer primitive={primitive} evalContext={{ gap_val: 1.92, specimen_selection: 4 }} />
      </svg>
    );
    expect(c4.textContent).toContain("Bronze Coin");

    // specimen 5 -> Copper Pipe
    const { container: c5 } = render(
      <svg>
        <PrimitiveRenderer primitive={primitive} evalContext={{ gap_val: 3.10, specimen_selection: 5 }} />
      </svg>
    );
    expect(c5.textContent).toContain("Copper Pipe");
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
