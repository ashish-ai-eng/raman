import { NextResponse } from "next/server";
import { UniversalPhysicsSpecSchema } from "@/lib/agent/schemas";
import { CORE_EXPERIMENTAL_PRESETS } from "@/presets";
import { simplePendulumPreset } from "@/lib/engine/presets";
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

    if (
      lowerQuery.includes("vernier") ||
      lowerQuery.includes("caliper") ||
      lowerQuery.includes("pendulum") ||
      lowerQuery.includes("ohm") ||
      lowerQuery.includes("circuit") ||
      lowerQuery.includes("voltage") ||
      lowerQuery.includes("resistor") ||
      lowerQuery.includes("optics") ||
      lowerQuery.includes("lens") ||
      lowerQuery.includes("ray")
    ) {
      if (lowerQuery.includes("vernier") || lowerQuery.includes("caliper")) {
        baseSpec = {
          ...CORE_EXPERIMENTAL_PRESETS["preset-vernier-caliper"],
          id: `preset-vernier-caliper-gen-${timestamp}`,
        };
      } else if (lowerQuery.includes("pendulum")) {
        baseSpec = {
          ...CORE_EXPERIMENTAL_PRESETS["preset-pendulum"],
          id: `preset-pendulum-gen-${timestamp}`,
        };
      } else if (lowerQuery.includes("ohm") || lowerQuery.includes("circuit") || lowerQuery.includes("voltage") || lowerQuery.includes("resistor")) {
        baseSpec = {
          ...CORE_EXPERIMENTAL_PRESETS["preset-ohms-law"],
          id: `preset-ohms-law-gen-${timestamp}`,
        };
      } else if (lowerQuery.includes("optics") || lowerQuery.includes("lens") || lowerQuery.includes("ray")) {
        baseSpec = {
          ...CORE_EXPERIMENTAL_PRESETS["preset-ray-optics"],
          id: `preset-ray-optics-gen-${timestamp}`,
        };
      }
      messageText = `Selected ${baseSpec.name} preset!`;
    } else {
      return NextResponse.json({
        message: "We are working on a feature to enable any experiment creation.",
        suggestedPrompts: [
          "Select Vernier Caliper preset",
          "Select Simple Pendulum preset",
          "Select Ohm's Law preset",
          "Select Geometric Ray Optics preset",
        ],
      });
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
