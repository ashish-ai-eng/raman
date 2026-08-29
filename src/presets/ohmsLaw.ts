import { UniversalPhysicsSpec } from "@/types/upr";

export const ohmsLawPreset: UniversalPhysicsSpec = {
  id: "preset-ohms-law",
  name: "Ohm's Law & DC Circuits",
  description: "Variable DC power supply V, load resistor R, internal resistance r, non-ohmic heating toggle. Live V-I characteristic graph with slope calculation (R = ΔV/ΔI).",
  hasAnimation: true,
  hasZeroError: false,
  inputs: {
    supply_voltage: {
      id: "supply_voltage",
      label: "DC Supply Voltage V (Volts)",
      type: "slider",
      min: 0,
      max: 24,
      step: 0.5,
      defaultValue: 12.0,
      unit: "V",
    },
    resistor_value_R: {
      id: "resistor_value_R",
      label: "Resistor R (Ohms)",
      type: "slider",
      min: 10,
      max: 500,
      step: 10,
      defaultValue: 100,
      unit: "Ω",
    },
    internal_resistance_r: {
      id: "internal_resistance_r",
      label: "Internal Resistance r (Ohms)",
      type: "slider",
      min: 0,
      max: 10,
      step: 0.5,
      defaultValue: 1.0,
      unit: "Ω",
    },
  },
  equations: {
    total_R: { id: "total_R", expression: "resistor_value_R + internal_resistance_r" },
    circuit_current_I: { id: "circuit_current_I", expression: "supply_voltage / total_R" },
    terminal_voltage_V: { id: "terminal_voltage_V", expression: "circuit_current_I * resistor_value_R" },
    power_P: { id: "power_P", expression: "terminal_voltage_V * circuit_current_I" },
  },
  outputs: {
    voltage: { id: "voltage", label: "Voltmeter Terminal V", unit: "V", expression: "terminal_voltage_V", precision: 2 },
    current: { id: "current", label: "Ammeter Current (I)", unit: "A", expression: "circuit_current_I", precision: 3 },
    power: { id: "power", label: "Power Dissipation (P)", unit: "W", expression: "power_P", precision: 3 },
  },
  errorModel: { leastCount: 0.01 },
  visuals: [
    {
      type: "circuit_wire",
      id: "dc_circuit_loop",
      xExpression: "0",
      yExpression: "0",
    },
  ],
};
