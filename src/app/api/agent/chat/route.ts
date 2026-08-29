import { NextRequest, NextResponse } from "next/server";
import { UniversalPhysicsSpecSchema } from "@/lib/agent/schemas";
import { simplePendulumPreset, opticsBenchPreset, ohmsLawPreset } from "@/lib/engine/presets";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages: ChatMessage[] = body.messages || [];
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")?.content || "";

    // Generate smart mock/preset AI response based on teacher query
    let responseSpec = body.currentSpec || simplePendulumPreset;
    let messageText = "I've created your physics simulation widget!";
    let suggestions = [
      "Add zero error calibration offset",
      "Change controllable slider range",
      "Add a digital readout display",
    ];

    const lowerQuery = lastUserMessage.toLowerCase();

    if (lowerQuery.includes("optics") || lowerQuery.includes("lens") || lowerQuery.includes("focal")) {
      responseSpec = opticsBenchPreset;
      messageText = "I've generated a Convex Lens Optics Bench widget! Students can adjust object distance u and lens focal length f to measure image distance v and magnification.";
      suggestions = ["Add index error calibration", "Change focal length limits", "Add 1/u vs 1/v graph parameters"];
    } else if (lowerQuery.includes("ohm") || lowerQuery.includes("circuit") || lowerQuery.includes("voltage") || lowerQuery.includes("resistor")) {
      responseSpec = ohmsLawPreset;
      messageText = "I've created an Ohm's Law Electrical Circuit widget! Students can adjust voltage V and resistor value R to observe current I on the ammeter.";
      suggestions = ["Add ammeter internal resistance slider", "Add power dissipation readout", "Add V vs I graph setup"];
    } else if (lowerQuery.includes("hooke") || lowerQuery.includes("spring") || lowerQuery.includes("mass")) {
      responseSpec = {
        id: "generated-hookes-law",
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
      messageText = "I've generated a Hooke's Law Mass-Spring experiment widget! Students can adjust hanging mass m and spring constant k to measure spring stretch extension x.";
      suggestions = ["Add zero error on ruler scale", "Add F vs x linear regression setup", "Convert mass unit to grams"];
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
