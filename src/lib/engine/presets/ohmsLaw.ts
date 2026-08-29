import { UniversalPhysicsSpec } from "@/types/upr";

export const ohmsLawPreset: UniversalPhysicsSpec = {
  id: "preset-ohms-law",
  name: "Ohm's Law Electrical Circuit",
  description: "Verify linear V-I relationship across a resistor to determine resistance R.",
  inputs: {
    supply_voltage: {
      id: "supply_voltage",
      label: "DC Voltage Supply V (Volts)",
      type: "slider",
      min: 0,
      max: 12,
      step: 0.5,
      defaultValue: 6.0,
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
    meter_internal_r: {
      id: "meter_internal_r",
      label: "Ammeter Internal Resistance (Ohms)",
      type: "slider",
      min: 0,
      max: 5,
      step: 0.1,
      defaultValue: 0.5,
      unit: "Ω",
    },
  },
  equations: {
    total_resistance: {
      id: "total_resistance",
      expression: "resistor_value_R + meter_internal_r",
    },
    circuit_current_I: {
      id: "circuit_current_I",
      expression: "supply_voltage / total_resistance",
    },
    voltage_drop_V: {
      id: "voltage_drop_V",
      expression: "circuit_current_I * resistor_value_R",
    },
    power_dissipated: {
      id: "power_dissipated",
      expression: "voltage_drop_V * circuit_current_I",
    },
  },
  outputs: {
    voltmeter_reading: {
      id: "voltmeter_reading",
      label: "Voltmeter Reading (V)",
      unit: "V",
      expression: "voltage_drop_V",
      precision: 2,
    },
    ammeter_reading: {
      id: "ammeter_reading",
      label: "Ammeter Reading (I)",
      unit: "A",
      expression: "circuit_current_I",
      precision: 3,
    },
    power_reading: {
      id: "power_reading",
      label: "Power Dissipated (P)",
      unit: "W",
      expression: "power_dissipated",
      precision: 3,
    },
  },
  errorModel: {
    leastCount: 0.01,
  },
  visuals: [
    {
      type: "circuit_wire",
      id: "circuit_loop",
      xExpression: "0",
      yExpression: "0",
    },
  ],
};
