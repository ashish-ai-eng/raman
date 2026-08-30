import { NextResponse } from "next/server";
import { LabSpec } from "@/types/labSpec";
import { simplePendulumPreset, vernierCaliperPreset } from "@/lib/engine/presets";

// In-memory lab store simulation for API routes
const MOCK_LAB_DB: Record<string, LabSpec> = {
  "pendulum-101": {
    id: "pendulum-101",
    title: "Simple Pendulum — Acceleration Due to Gravity (g)",
    topic: "Mechanics & Oscillations",
    conceptSummary: "Investigate period T versus string length L to derive g.",
    funFacts: ["Galileo discovered pendulum period constancy!"],
    widget: simplePendulumPreset,
    observationSchema: {
      parametersToRecord: ["string_length_L", "time_period"],
      calculatedValues: [],
      graphConfig: {
        xAxisKey: "string_length_L",
        yAxisKey: "period_squared",
        xAxisLabel: "Length L (m)",
        yAxisLabel: "Period T² (s²)",
      },
    },
    steps: [
      {
        stepNumber: 1,
        instruction: "Measure period T for string length L = 1.0 m.",
        idealAnswerType: "numeric",
        idealAnswerFormulaOrValue: 2.01,
        tolerancePercent: 5,
        hint: "Divide total time by 10.",
      },
    ],
    challenges: [],
    status: "draft",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "vernier-201": {
    id: "vernier-201",
    title: "Vernier Caliper — Precision Length & Thickness Measurement",
    topic: "Vernier Measurement",
    conceptSummary: "Determine dimension of a specimen using main scale reading (MSR) and vernier scale division (VSD).",
    funFacts: ["Vernier calipers resolve measurements down to 0.1 mm or 0.01 cm!"],
    widget: vernierCaliperPreset,
    observationSchema: {
      parametersToRecord: ["msr", "vsd"],
      calculatedValues: [],
      graphConfig: {
        xAxisKey: "specimen_dimension",
        yAxisKey: "corrected",
        xAxisLabel: "Dimension (cm)",
        yAxisLabel: "Measured Reading (cm)",
      },
    },
    steps: [
      {
        stepNumber: 1,
        instruction: "Adjust specimen dimension and record Main Scale Reading (MSR) and Vernier Scale Division (VSD).",
        idealAnswerType: "numeric",
        idealAnswerFormulaOrValue: 2.34,
        tolerancePercent: 5,
        hint: "Align vernier mark accurately with main scale mark.",
      },
    ],
    challenges: [],
    status: "published",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { labId } = body;

    if (!labId) {
      return NextResponse.json({ error: "Missing required labId parameter." }, { status: 400 });
    }

    const lab = MOCK_LAB_DB[labId];

    if (!lab) {
      return NextResponse.json({ error: `Lab with ID '${labId}' not found.` }, { status: 404 });
    }

    // Promote status draft -> published
    lab.status = "published";
    lab.updatedAt = new Date().toISOString();

    const accessCode = `PHYS-${Math.floor(1000 + Math.random() * 9000)}`;

    return NextResponse.json({
      message: "Lab successfully verified and published to students.",
      lab,
      accessCode,
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to publish lab.", details: err?.message }, { status: 500 });
  }
}
