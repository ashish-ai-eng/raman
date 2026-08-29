import { z } from "zod";

export const UPRInputSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.enum(["slider", "toggle", "dial", "select"]),
  min: z.number(),
  max: z.number(),
  step: z.number(),
  defaultValue: z.number(),
  unit: z.string(),
  options: z
    .array(z.object({ label: z.string(), value: z.number() }))
    .optional(),
});

export const UPREquationSchema = z.object({
  id: z.string(),
  label: z.string().optional(),
  expression: z.string(),
});

export const UPROutputSchema = z.object({
  id: z.string(),
  label: z.string(),
  unit: z.string(),
  expression: z.string(),
  precision: z.number(),
  skipQuantization: z.boolean().optional(),
});

export const UPRErrorModelSchema = z.object({
  zeroError: z.number().optional(),
  leastCount: z.number().optional(),
  noisePercentage: z.number().optional(),
});

export const VisualPrimitiveSchema = z.object({
  type: z.enum([
    "ruler",
    "scale",
    "lens",
    "bob",
    "circuit_wire",
    "pointer",
    "digital_display",
    "vernier_caliper",
    "custom_svg",
  ]),
  id: z.string(),
  xExpression: z.string(),
  yExpression: z.string(),
  rotationExpression: z.string().optional(),
  sizeExpression: z.string().optional(),
  properties: z.record(z.union([z.string(), z.number(), z.boolean()])).optional(),
});

export const UniversalPhysicsSpecSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  inputs: z.record(UPRInputSchema),
  equations: z.record(UPREquationSchema),
  outputs: z.record(UPROutputSchema),
  errorModel: UPRErrorModelSchema.optional(),
  visuals: z.array(VisualPrimitiveSchema).optional(),
});

export const CalculatedObservableSchema = z.object({
  key: z.string(),
  label: z.string(),
  unit: z.string(),
  formula: z.string(),
});

export const GraphConfigSchema = z.object({
  xAxisKey: z.string(),
  yAxisKey: z.string(),
  xAxisLabel: z.string(),
  yAxisLabel: z.string(),
  expectedSlopeFormula: z.string().optional(),
  extractedConstantLabel: z.string().optional(),
  extractedConstantFormula: z.string().optional(),
});

export const StepInstructionSchema = z.object({
  stepNumber: z.number(),
  instruction: z.string(),
  idealAnswerType: z.enum(["numeric", "multiple_choice", "text_explanation"]),
  idealAnswerFormulaOrValue: z.union([z.string(), z.number()]),
  tolerancePercent: z.number().optional(),
  options: z.array(z.string()).optional(),
  hint: z.string(),
});

export const GamificationBadgeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  icon: z.string(),
});

export const ChallengeSchema = z.object({
  id: z.string(),
  description: z.string(),
  stickerReward: GamificationBadgeSchema,
  requirementType: z.enum([
    "trials_logged",
    "zero_error_corrected",
    "graph_plotted",
    "step_completed",
  ]),
  targetCount: z.number().optional(),
});

export const LabSpecSchema = z.object({
  id: z.string(),
  title: z.string(),
  topic: z.string(),
  conceptSummary: z.string(),
  funFacts: z.array(z.string()),
  widget: UniversalPhysicsSpecSchema,
  observationSchema: z.object({
    parametersToRecord: z.array(z.string()),
    calculatedValues: z.array(CalculatedObservableSchema),
    graphConfig: GraphConfigSchema,
  }),
  steps: z.array(StepInstructionSchema),
  challenges: z.array(ChallengeSchema),
  status: z.enum(["draft", "verified", "published"]),
  createdAt: z.string(),
  updatedAt: z.string(),
});
