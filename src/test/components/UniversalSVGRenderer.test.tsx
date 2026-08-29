import React from "react";
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { UniversalSVGRenderer } from "@/components/widgets/renderer/UniversalSVGRenderer";
import { DynamicSVGNode } from "@/types/upr";

describe("UniversalSVGRenderer Component", () => {
  it("renders generative SVG graphic tree nodes with evaluated math expression attributes", () => {
    const nodes: DynamicSVGNode[] = [
      {
        id: "barrel",
        tag: "rect",
        attrs: { x: "100", y: "50", width: "wire_d * 50", height: "30", fill: "#e2e8f0" },
      },
      {
        id: "wire_circle",
        tag: "circle",
        attrs: { cx: "50 + wire_d * 10", cy: "65", r: "wire_d * 5", fill: "#f59e0b" },
      },
      {
        id: "label",
        tag: "text",
        attrs: { x: "100", y: "120", fontSize: "12", content: "Micrometer Barrel" },
      },
    ];

    const evalContext = { wire_d: 2.0 };

    const { container } = render(
      <svg>
        <UniversalSVGRenderer nodes={nodes} evalContext={evalContext} />
      </svg>
    );

    // rect width = 2.0 * 50 = 100
    const rect = container.querySelector("#barrel");
    expect(rect).not.toBeNull();
    expect(rect?.getAttribute("width")).toBe("100");

    // circle cx = 50 + 2.0 * 10 = 70, r = 2.0 * 5 = 10
    const circle = container.querySelector("#wire_circle");
    expect(circle).not.toBeNull();
    expect(circle?.getAttribute("cx")).toBe("70");
    expect(circle?.getAttribute("r")).toBe("10");

    expect(container.textContent).toContain("Micrometer Barrel");
  });
});
