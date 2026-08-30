import { UniversalPhysicsSpec } from "@/types/upr";

export const ohmsLawPreset: UniversalPhysicsSpec = {
  id: "preset-ohms-law",
  name: "Ohm's Law & DC Circuits",
  description: "Variable DC power supply V, load resistor R, internal resistance r. Shows dynamic electron/current flow animation and live V-I characteristic graph.",
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

    // Animation & Graph equations for current flow & live V-I plotting
    // Animated charge offset moving along rectangular circuit wire loop (perimeter = 560px)
    charge_pos: { id: "charge_pos", expression: "(t * circuit_current_I * 120) % 560" },

    // Electron 1
    electron1_x: { id: "electron1_x", expression: "50 + min(200, charge_pos) - max(0, min(200, charge_pos - 280))" },
    electron1_y: { id: "electron1_y", expression: "30 + max(0, min(80, charge_pos - 200)) - max(0, min(80, charge_pos - 480))" },

    // Electron 2 (140px offset)
    charge_pos_2: { id: "charge_pos_2", expression: "(charge_pos + 140) % 560" },
    electron2_x: { id: "electron2_x", expression: "50 + min(200, charge_pos_2) - max(0, min(200, charge_pos_2 - 280))" },
    electron2_y: { id: "electron2_y", expression: "30 + max(0, min(80, charge_pos_2 - 200)) - max(0, min(80, charge_pos_2 - 480))" },

    // Electron 3 (280px offset)
    charge_pos_3: { id: "charge_pos_3", expression: "(charge_pos + 280) % 560" },
    electron3_x: { id: "electron3_x", expression: "50 + min(200, charge_pos_3) - max(0, min(200, charge_pos_3 - 280))" },
    electron3_y: { id: "electron3_y", expression: "30 + max(0, min(80, charge_pos_3 - 200)) - max(0, min(80, charge_pos_3 - 480))" },

    // Electron 4 (420px offset)
    charge_pos_4: { id: "charge_pos_4", expression: "(charge_pos + 420) % 560" },
    electron4_x: { id: "electron4_x", expression: "50 + min(200, charge_pos_4) - max(0, min(200, charge_pos_4 - 280))" },
    electron4_y: { id: "electron4_y", expression: "30 + max(0, min(80, charge_pos_4 - 200)) - max(0, min(80, charge_pos_4 - 480))" },

    // V-I Graph Plotting point coordinates (Graph origin at x=310, y=140; width=120, height=110)
    // Current I mapped to x-axis (0..0.3A -> 0..100px)
    graph_point_x: { id: "graph_point_x", expression: "310 + min(110, circuit_current_I * 360)" },
    // Terminal Voltage V mapped to y-axis (0..24V -> 0..100px, inverted for SVG SVG top-y)
    graph_point_y: { id: "graph_point_y", expression: "140 - min(100, terminal_voltage_V * 4)" },
  },
  outputs: {
    voltage: { id: "voltage", label: "Voltmeter Terminal V", unit: "V", expression: "terminal_voltage_V", precision: 2 },
    current: { id: "current", label: "Ammeter Current (I)", unit: "A", expression: "circuit_current_I", precision: 3 },
    power: { id: "power", label: "Power Dissipation (P)", unit: "W", expression: "power_P", precision: 3 },
  },
  errorModel: { leastCount: 0.01 },
  svgNodes: [
    // --- DC CIRCUIT SCHEMATIC (Left Side, x: 30 to 270) ---
    // Outer Circuit Wire Rect
    { id: "circuit_loop", tag: "rect", attrs: { x: "50", y: "30", width: "200", height: "80", fill: "none", stroke: "#475569", strokeWidth: "3", rx: "6" } },
    
    // Resistor Component (Top Branch)
    { id: "resistor_bg", tag: "rect", attrs: { x: "120", y: "20", width: "60", height: "20", fill: "#f8fafc", stroke: "#0284c7", strokeWidth: "2", rx: "4" } },
    { id: "resistor_zigzag", tag: "path", attrs: { d: "M 125 30 L 130 24 L 140 36 L 150 24 L 160 36 L 170 24 L 175 30", fill: "none", stroke: "#0284c7", strokeWidth: "1.5" } },
    { id: "resistor_text", tag: "text", attrs: { x: "150", y: "15", fontSize: "10", fill: "#0284c7", fontWeight: "bold", textAnchor: "middle", content: "Resistor (R)" } },

    // DC Power Supply Battery (Bottom Branch)
    { id: "battery_pos", tag: "line", attrs: { x1: "140", y1: "100", x2: "140", y2: "120", stroke: "#ef4444", strokeWidth: "3" } },
    { id: "battery_neg", tag: "line", attrs: { x1: "155", y1: "105", x2: "155", y2: "115", stroke: "#3b82f6", strokeWidth: "3" } },
    { id: "battery_text", tag: "text", attrs: { x: "148", y: "132", fontSize: "9", fill: "#64748b", fontWeight: "bold", textAnchor: "middle", content: "DC Voltage V" } },

    // Ammeter (Right Branch)
    { id: "ammeter_bg", tag: "circle", attrs: { cx: "250", cy: "70", r: "12", fill: "#f1f5f9", stroke: "#059669", strokeWidth: "2" } },
    { id: "ammeter_text", tag: "text", attrs: { x: "250", y: "74", fontSize: "10", fill: "#059669", fontWeight: "bold", textAnchor: "middle", content: "A" } },

    // Animated Flowing Charge/Electrons (Moving dots along circuit wires)
    { id: "electron1", tag: "circle", attrs: { cx: "electron1_x", cy: "electron1_y", r: "4", fill: "#f59e0b", stroke: "#b45309", strokeWidth: "1" } },
    { id: "electron2", tag: "circle", attrs: { cx: "electron2_x", cy: "electron2_y", r: "4", fill: "#f59e0b", stroke: "#b45309", strokeWidth: "1" } },
    { id: "electron3", tag: "circle", attrs: { cx: "electron3_x", cy: "electron3_y", r: "4", fill: "#f59e0b", stroke: "#b45309", strokeWidth: "1" } },
    { id: "electron4", tag: "circle", attrs: { cx: "electron4_x", cy: "electron4_y", r: "4", fill: "#f59e0b", stroke: "#b45309", strokeWidth: "1" } },

    // --- LIVE V-I GRAPH PLOT (Right Side, x: 290 to 440) ---
    // Graph Axis Lines
    { id: "graph_border", tag: "rect", attrs: { x: "295", y: "20", width: "145", height: "135", fill: "#0f172a", stroke: "#334155", strokeWidth: "1.5", rx: "6" } },
    { id: "axis_x", tag: "line", attrs: { x1: "310", y1: "140", x2: "425", y2: "140", stroke: "#94a3b8", strokeWidth: "1.5" } },
    { id: "axis_y", tag: "line", attrs: { x1: "310", y1: "140", x2: "310", y2: "35", stroke: "#94a3b8", strokeWidth: "1.5" } },
    
    // Axis Labels
    { id: "label_title", tag: "text", attrs: { x: "367", y: "32", fontSize: "9", fill: "#38bdf8", fontWeight: "bold", textAnchor: "middle", content: "V-I Characteristic" } },
    { id: "label_x", tag: "text", attrs: { x: "425", y: "152", fontSize: "8", fill: "#cbd5e1", textAnchor: "end", content: "I (A) →" } },
    { id: "label_y", tag: "text", attrs: { x: "305", y: "38", fontSize: "8", fill: "#cbd5e1", textAnchor: "end", content: "V ↑" } },

    // Characteristic Ohm's Law Slope Line (Linear V-I relationship passing through origin to current operating point)
    { id: "vi_slope_line", tag: "line", attrs: { x1: "310", y1: "140", x2: "graph_point_x", y2: "graph_point_y", stroke: "#38bdf8", strokeWidth: "2", strokeDasharray: "3 3" } },

    // Live Operating Point Marker (Pulsing glowing dot)
    { id: "vi_data_point", tag: "circle", attrs: { cx: "graph_point_x", cy: "graph_point_y", r: "5", fill: "#ef4444", stroke: "#ffffff", strokeWidth: "1.5" } },
  ],
};

