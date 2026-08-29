import { NextResponse } from "next/server";
import { UniversalPhysicsSpecSchema } from "@/lib/agent/schemas";
import { simplePendulumPreset, opticsBenchPreset, ohmsLawPreset, vernierCaliperPreset } from "@/lib/engine/presets";

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

    if (lowerQuery.includes("pendulum")) {
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
          hanging_mass_m: {
            id: "hanging_mass_m",
            label: "Hanging Mass m (kg)",
            type: "slider",
            min: 0.1,
            max: 2.0,
            step: 0.1,
            defaultValue: 0.5,
            unit: "kg",
          },
          spring_constant_k: {
            id: "spring_constant_k",
            label: "Spring Constant k (N/m)",
            type: "slider",
            min: 10,
            max: 100,
            step: 5,
            defaultValue: 50,
            unit: "N/m",
          },
        },
        equations: {
          weight_force_F: {
            id: "weight_force_F",
            expression: "hanging_mass_m * G",
          },
          spring_extension_x: {
            id: "spring_extension_x",
            expression: "weight_force_F / spring_constant_k",
          },
        },
        outputs: {
          force_F: {
            id: "force_F",
            label: "Hanging Weight Force (F)",
            unit: "N",
            expression: "weight_force_F",
            precision: 2,
          },
          extension_x: {
            id: "extension_x",
            label: "Spring Stretch Extension (x)",
            unit: "m",
            expression: "spring_extension_x",
            precision: 3,
          },
        },
        errorModel: {
          leastCount: 0.001,
        },
        visuals: [
          {
            type: "scale",
            id: "ruler_scale",
            xExpression: "50",
            yExpression: "20",
            properties: { length: 250 },
          },
          {
            type: "bob",
            id: "hanging_weight",
            xExpression: "150",
            yExpression: "40 + spring_extension_x * 200",
            properties: { radius: 18 },
          },
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
