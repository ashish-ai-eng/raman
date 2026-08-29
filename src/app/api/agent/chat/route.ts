import { NextResponse } from "next/server";
import { UniversalPhysicsSpecSchema } from "@/lib/agent/schemas";
import { simplePendulumPreset, opticsBenchPreset, ohmsLawPreset, vernierCaliperPreset } from "@/lib/engine/presets";
import { DynamicSVGNode } from "@/types/upr";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages: ChatMessage[] = body.messages || [];
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")?.content || "";

    const lowerQuery = lastUserMessage.toLowerCase();
    const timestamp = Date.now();

    let baseSpec = body.currentSpec || simplePendulumPreset;
    let messageText = "I have updated your physics simulation widget according to your instruction!";
    let suggestions = [
      "Add zero error calibration offset",
      "Change controllable slider range",
      "Add a digital readout display",
    ];

    if (lowerQuery.includes("screw") || lowerQuery.includes("micrometer") || lowerQuery.includes("gauge")) {
      const screwGaugeNodes: DynamicSVGNode[] = [
        // Main Frame & Anvil
        { id: "frame", tag: "path", attrs: { d: "M 40 40 L 40 140 L 220 140 L 220 100", fill: "none", stroke: "#334155", strokeWidth: "12" } },
        { id: "anvil", tag: "rect", attrs: { x: "40", y: "75", width: "20", height: "30", fill: "#94a3b8", stroke: "#1e293b", strokeWidth: "1.5" } },
        // Main Barrel / Pitch Scale
        { id: "barrel", tag: "rect", attrs: { x: "120", y: "75", width: "120", height: "30", fill: "#e2e8f0", stroke: "#475569", strokeWidth: "1.5" } },
        { id: "pitch_line", tag: "line", attrs: { x1: "120", y1: "90", x2: "220", y2: "90", stroke: "#0f172a", strokeWidth: "1.5" } },
        // Rotating Thimble (moves with wire thickness x)
        { id: "thimble", tag: "rect", attrs: { x: "160 + wire_d * 20", y: "65", width: "70", height: "50", fill: "#0284c7", stroke: "#0369a1", strokeWidth: "2", rx: "3" } },
        // Spindle extending from thimble to anvil
        { id: "spindle", tag: "rect", attrs: { x: "60 + wire_d * 20", y: "80", width: "100", height: "20", fill: "#cbd5e1", stroke: "#334155", strokeWidth: "1.5" } },
        // Clamped Specimen Wire
        { id: "wire", tag: "circle", attrs: { cx: "60 + (wire_d * 10)", cy: "90", r: "wire_d * 10", fill: "#f59e0b", stroke: "#d97706", strokeWidth: "2" } },
        { id: "wire_label", tag: "text", attrs: { x: "100", y: "155", fontSize: "11", fill: "#0369a1", fontWeight: "bold", content: "Clamped Specimen Wire" } },
      ];

      baseSpec = {
        id: `screw-gauge-${timestamp}`,
        name: "Micrometer Screw Gauge Instrument",
        description: "Precision Micrometer Screw Gauge for measuring wire thickness and sheet gauge with zero-error calibration.",
        hasAnimation: false,
        hasZeroError: true,
        inputs: {
          wire_d: {
            id: "wire_d",
            label: "Wire Diameter d (mm)",
            type: "slider",
            min: 0.05,
            max: 5.0,
            step: 0.01,
            defaultValue: 1.25,
            unit: "mm",
          },
        },
        equations: {
          pitch: { id: "pitch", expression: "0.5" },
          main_scale_reading: { id: "main_scale_reading", expression: "floor(wire_d * 2) / 2" },
          circular_coincidence: { id: "circular_coincidence", expression: "round((wire_d - main_scale_reading) / 0.01)" },
        },
        outputs: {
          msr: { id: "msr", label: "Main Pitch Scale (MSR)", unit: "mm", expression: "main_scale_reading", precision: 2 },
          csr: { id: "csr", label: "Circular Scale (CSR)", unit: "div", expression: "circular_coincidence", precision: 0 },
          observed_d: { id: "observed_d", label: "Observed Wire Diameter", unit: "mm", expression: "main_scale_reading + (circular_coincidence * 0.01)", precision: 2 },
        },
        errorModel: { leastCount: 0.01, zeroError: 0.02 },
        svgNodes: screwGaugeNodes,
      };
      messageText = "I have generated a Micrometer Screw Gauge instrument widget using a dynamic SVG graphic tree! Students can adjust wire diameter d and measure pitch scale MSR and circular scale CSR.";
      suggestions = ["Add positive zero error (+0.02 mm)", "Set least count to 0.005 mm", "Add wire thickness graph setup"];
    } else if (lowerQuery.includes("buoyancy") || lowerQuery.includes("archimedes")) {
      const buoyancyNodes: DynamicSVGNode[] = [
        // Water Container Beaker
        { id: "beaker", tag: "rect", attrs: { x: "120", y: "30", width: "160", height: "130", fill: "none", stroke: "#475569", strokeWidth: "3", rx: "4" } },
        // Water Level (rises with submerged volume)
        { id: "water", tag: "rect", attrs: { x: "122", y: "80 - fluid_disp * 5", width: "156", height: "78 + fluid_disp * 5", fill: "#38bdf8", stroke: "none" } },
        // Floating/Submerged Block
        { id: "block", tag: "rect", attrs: { x: "170", y: "60 + block_depth * 15", width: "60", height: "50", fill: "#f59e0b", stroke: "#b45309", strokeWidth: "2", rx: "3" } },
        // Force Vectors (Weight W down, Buoyant Force Fb up)
        { id: "weight_vector", tag: "line", attrs: { x1: "200", y1: "85 + block_depth * 15", x2: "200", y2: "135 + block_depth * 15", stroke: "#ef4444", strokeWidth: "3" } },
        { id: "buoyancy_vector", tag: "line", attrs: { x1: "200", y1: "85 + block_depth * 15", x2: "200", y2: "35 + block_depth * 15", stroke: "#10b981", strokeWidth: "3" } },
        { id: "label", tag: "text", attrs: { x: "200", y: "172", fontSize: "11", fill: "#0f172a", fontWeight: "bold", textAnchor: "middle", content: "Archimedes Fluid Vessel" } },
      ];

      baseSpec = {
        id: `buoyancy-${timestamp}`,
        name: "Archimedes Buoyancy & Fluid Displacement",
        description: "Investigate buoyant upthrust force Fb versus submerged volume V_disp.",
        hasAnimation: false,
        hasZeroError: false,
        inputs: {
          block_mass: { id: "block_mass", label: "Block Mass (kg)", type: "slider", min: 0.5, max: 5.0, step: 0.1, defaultValue: 2.0, unit: "kg" },
          fluid_density: { id: "fluid_density", label: "Fluid Density ρ (kg/m³)", type: "slider", min: 800, max: 1200, step: 50, defaultValue: 1000, unit: "kg/m³" },
        },
        equations: {
          weight_W: { id: "weight_W", expression: "block_mass * G" },
          buoyant_force_Fb: { id: "buoyant_force_Fb", expression: "min(weight_W, (fluid_density / 1000) * 15)" },
          fluid_disp: { id: "fluid_disp", expression: "buoyant_force_Fb / 2" },
          block_depth: { id: "block_depth", expression: "fluid_disp" },
        },
        outputs: {
          weight: { id: "weight", label: "Weight Force (W)", unit: "N", expression: "weight_W", precision: 2 },
          upthrust: { id: "upthrust", label: "Buoyant Upthrust (Fb)", unit: "N", expression: "buoyant_force_Fb", precision: 2 },
          displacement: { id: "displacement", label: "Displaced Fluid (mL)", unit: "mL", expression: "fluid_disp * 20", precision: 1 },
        },
        svgNodes: buoyancyNodes,
      };
      messageText = "I have generated an Archimedes Buoyancy & Upthrust simulation widget using a dynamic SVG graphic tree! Students can adjust block mass and fluid density to observe fluid displacement and buoyant force.";
      suggestions = ["Set fluid to Saltwater (1025 kg/m³)", "Add Fb vs V_disp graph parameters", "Add spring balance tension readout"];
    } else if (lowerQuery.includes("pendulum")) {
      baseSpec = simplePendulumPreset;
      messageText = "I have created your Simple Pendulum simulation widget! The pendulum hangs vertically straight down from the fixed support. Students can adjust string length L, bob mass m, and gravity g to observe harmonic oscillation.";
      suggestions = ["Set gravity g to Moon (1.62 m/s²)", "Add zero error offset", "Add T² vs L graph setup"];
    } else if (lowerQuery.includes("vernier") || lowerQuery.includes("caliper")) {
      baseSpec = vernierCaliperPreset;
      messageText = "I have created a Vernier Caliper instrument widget! Students can measure object dimensions clamped securely between the jaws.";
      suggestions = ["Add positive zero error (+0.03 cm)", "Change object type to Cylinder", "Set least count to 0.005 cm"];
    } else if (lowerQuery.includes("optics") || lowerQuery.includes("lens") || lowerQuery.includes("focal")) {
      baseSpec = opticsBenchPreset;
      messageText = "I have generated a Convex Lens Optics Bench widget! Students can adjust object distance u and lens focal length f to measure image distance v and magnification.";
      suggestions = ["Add index error calibration", "Change focal length limits", "Add 1/u vs 1/v graph parameters"];
    } else if (lowerQuery.includes("ohm") || lowerQuery.includes("circuit") || lowerQuery.includes("voltage") || lowerQuery.includes("resistor")) {
      baseSpec = ohmsLawPreset;
      messageText = "I have created an Ohm's Law Electrical Circuit widget! Students can adjust voltage V and resistor value R to observe current I on the ammeter.";
      suggestions = ["Add ammeter internal resistance slider", "Add power dissipation readout", "Add V vs I graph setup"];
    } else if (lowerQuery.includes("hooke") || lowerQuery.includes("spring") || lowerQuery.includes("mass")) {
      baseSpec = {
        id: `hooke-spring-${timestamp}`,
        name: "Hooke's Law Mass-Spring System",
        description: "Investigate spring extension x versus hanging mass m to determine spring constant k.",
        inputs: {
          hanging_mass_m: { id: "hanging_mass_m", label: "Hanging Mass m (kg)", type: "slider", min: 0.1, max: 2.0, step: 0.1, defaultValue: 0.5, unit: "kg" },
          spring_constant_k: { id: "spring_constant_k", label: "Spring Constant k (N/m)", type: "slider", min: 10, max: 100, step: 5, defaultValue: 50, unit: "N/m" },
        },
        equations: {
          weight_force_F: { id: "weight_force_F", expression: "hanging_mass_m * G" },
          spring_extension_x: { id: "spring_extension_x", expression: "weight_force_F / spring_constant_k" },
        },
        outputs: {
          force_F: { id: "force_F", label: "Hanging Weight Force (F)", unit: "N", expression: "weight_force_F", precision: 2 },
          extension_x: { id: "extension_x", label: "Spring Stretch Extension (x)", unit: "m", expression: "spring_extension_x", precision: 3 },
        },
        errorModel: { leastCount: 0.001 },
        visuals: [
          { type: "scale", id: "ruler_scale", xExpression: "50", yExpression: "20", properties: { length: 250 } },
          { type: "bob", id: "hanging_weight", xExpression: "150", yExpression: "40 + spring_extension_x * 200", properties: { radius: 18 } },
        ],
      };
      messageText = "I have generated a Hooke's Law Mass-Spring experiment widget! Students can adjust hanging mass m and spring constant k to measure spring stretch extension x.";
      suggestions = ["Add zero error on ruler scale", "Add F vs x linear regression setup", "Convert mass unit to grams"];
    }

    // Always assign a fresh, unique timestamped ID to trigger hot-reload in DynamicWidgetRunner
    const responseSpec = {
      ...baseSpec,
      id: `${baseSpec.id.split("-gen-")[0]}-gen-${timestamp}`,
    };

    // Handle modification directives
    if (lowerQuery.includes("zero error") || lowerQuery.includes("calibration")) {
      responseSpec.errorModel = {
        ...responseSpec.errorModel,
        zeroError: 0.03,
      };
      messageText = "I have updated the widget to include a +0.03 zero-error calibration offset.";
    }

    // Validate generated spec against Zod schema
    const validationResult = UniversalPhysicsSpecSchema.safeParse(responseSpec);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Generated widget specification failed validation schema.", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: messageText,
      spec: validationResult.data,
      suggestedPrompts: suggestions,
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to process AI chat request.", details: err?.message }, { status: 500 });
  }
}
