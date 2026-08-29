import React from "react";
import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { DynamicWidgetRunner } from "@/components/widgets/DynamicWidgetRunner";
import { UniversalPhysicsSpec } from "@/types/upr";
import { simplePendulumPreset, vernierCaliperPreset } from "@/lib/engine/presets";

describe("DynamicWidgetRunner Component (CL 2.2)", () => {
  const sampleSpec: UniversalPhysicsSpec = {
    id: "test-widget",
    name: "Test Pendulum Widget",
    description: "Simple test spec",
    hasAnimation: true,
    hasZeroError: false,
    inputs: {
      length_L: {
        id: "length_L",
        label: "String Length L",
        type: "slider",
        min: 0.1,
        max: 2.0,
        step: 0.1,
        defaultValue: 1.0,
        unit: "m",
      },
    },
    equations: {
      period: {
        id: "period",
        expression: "2 * PI * sqrt(length_L / 9.81)",
      },
    },
    outputs: {
      time_period: {
        id: "time_period",
        label: "Time Period T",
        unit: "s",
        expression: "period",
        precision: 2,
      },
    },
    visuals: [
      {
        type: "bob",
        id: "pendulum_bob",
        xExpression: "length_L * 100",
        yExpression: "100",
      },
    ],
  };

  it("renders widget title, input sliders, and observable readouts", () => {
    const { container } = render(<DynamicWidgetRunner spec={sampleSpec} />);

    expect(container.textContent).toContain("Test Pendulum Widget");
    expect(container.textContent).toContain("String Length L");
    expect(container.textContent).toContain("Time Period T");
    expect(container.textContent).toContain("2.01 s"); // T = 2*PI*sqrt(1/9.81) = 2.006s -> 2.01s
  });

  it("updates observable outputs reactively when slider input changes", () => {
    const { container } = render(<DynamicWidgetRunner spec={sampleSpec} />);

    const slider = container.querySelector("input[type='range']") as HTMLInputElement;
    expect(slider).not.toBeNull();

    // Change length_L to 0.25 m
    fireEvent.change(slider, { target: { value: "0.25" } });

    // New T = 2*PI*sqrt(0.25/9.81) = 1.003s -> 1 s
    expect(container.textContent).toContain("1 s");
  });

  it("omits zero error panel on pendulum spec (hasZeroError: false)", () => {
    const { queryByTestId } = render(<DynamicWidgetRunner spec={simplePendulumPreset} />);
    expect(queryByTestId("zero-error-panel")).toBeNull();
  });

  it("omits play motion animation controls on Vernier Caliper spec (hasAnimation: false)", () => {
    const { queryByTestId, getByTestId } = render(<DynamicWidgetRunner spec={vernierCaliperPreset} />);
    expect(queryByTestId("animation-controls")).toBeNull();
    expect(getByTestId("zero-error-panel")).not.toBeNull();
  });
});
