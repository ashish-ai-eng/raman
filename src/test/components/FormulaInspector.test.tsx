import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { FormulaInspector } from "@/components/agent/FormulaInspector";
import { simplePendulumPreset } from "@/lib/engine/presets";

describe("FormulaInspector Component", () => {
  it("renders equation list from spec and allows teacher to modify formulas", () => {
    const handleUpdate = vi.fn();
    const { container } = render(
      <FormulaInspector spec={simplePendulumPreset} onFormulaUpdate={handleUpdate} />
    );

    expect(container.textContent).toContain("Teacher Physics Formula Inspector");
    expect(container.textContent).toContain("theoretical_period_T");

    const input = container.querySelector("#eq-theoretical_period_T") as HTMLInputElement;
    expect(input).not.toBeNull();
    expect(input.value).toContain("2 * PI * sqrt(string_length_L / gravity_g)");

    // Modify formula expression
    fireEvent.change(input, { target: { value: "2 * PI * sqrt(string_length_L / 9.81)" } });
    expect(handleUpdate).toHaveBeenCalled();
  });
});
