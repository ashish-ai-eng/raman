import { UniversalPhysicsSpec, UPRErrorModel } from "@/types/upr";
import { evaluateMath, MathContext } from "./evaluator";

export interface EvaluatedEngineState {
  inputs: Record<string, number>;
  equations: Record<string, number>;
  outputs: Record<string, number>;
  rawOutputs: Record<string, number>; // Before applying zero-error / least-count quantization
}

/**
 * Applies zero-error calibration offset, least-count quantization, and optional synthetic noise.
 */
export function applyInstrumentError(
  value: number,
  errorModel?: UPRErrorModel
): number {
  if (isNaN(value) || !isFinite(value)) return value;
  if (!errorModel) return value;

  let result = value;

  // 1. Add zero error calibration offset
  if (typeof errorModel.zeroError === "number") {
    result += errorModel.zeroError;
  }

  // 2. Quantize to least count (instrument resolution)
  if (typeof errorModel.leastCount === "number" && errorModel.leastCount > 0) {
    const factor = 1 / errorModel.leastCount;
    result = Math.round(result * factor) / factor;
  }

  // 3. Optional synthetic noise (if configured)
  if (typeof errorModel.noisePercentage === "number" && errorModel.noisePercentage > 0) {
    const noise = (Math.random() - 0.5) * 2 * (errorModel.noisePercentage / 100) * result;
    result += noise;
  }

  return result;
}

/**
 * Evaluates a Universal Physics Spec given input overrides.
 * Sorts dependency graph dynamically and evaluates inputs -> equations -> outputs.
 */
export function evaluateUniversalSpec(
  spec: UniversalPhysicsSpec,
  inputOverrides: Record<string, number> = {}
): EvaluatedEngineState {
  const context: MathContext = {};

  // 1. Populate inputs with default or overridden values
  const inputsState: Record<string, number> = {};
  for (const [key, inputSpec] of Object.entries(spec.inputs)) {
    const val = key in inputOverrides ? inputOverrides[key] : inputSpec.defaultValue;
    inputsState[key] = val;
    context[key] = val;
  }

  // 2. Evaluate intermediate equations (Iterative graph resolution)
  const equationsState: Record<string, number> = {};
  const pendingEquations = Object.entries(spec.equations);
  let resolvedCount = 0;
  const maxPasses = pendingEquations.length + 1;
  let pass = 0;

  const resolvedEqKeys = new Set<string>();

  while (resolvedEqKeys.size < pendingEquations.length && pass < maxPasses) {
    pass++;
    let progressThisPass = false;

    for (const [eqKey, eqSpec] of pendingEquations) {
      if (resolvedEqKeys.has(eqKey)) continue;

      try {
        const result = evaluateMath(eqSpec.expression, context);
        if (!isNaN(result)) {
          equationsState[eqKey] = result;
          context[eqKey] = result;
          resolvedEqKeys.add(eqKey);
          progressThisPass = true;
        }
      } catch {
        // Dependent variable not yet available in context; retry on next topological pass
      }
    }

    if (!progressThisPass) break; // Cyclic dependency or missing variable
  }

  // 3. Evaluate observable outputs
  const outputsState: Record<string, number> = {};
  const rawOutputsState: Record<string, number> = {};

  for (const [outKey, outSpec] of Object.entries(spec.outputs)) {
    let rawVal = 0;
    try {
      rawVal = evaluateMath(outSpec.expression, context);
    } catch {
      rawVal = NaN;
    }

    rawOutputsState[outKey] = rawVal;

    // Apply error model quantization & zero error
    let formattedVal = applyInstrumentError(rawVal, spec.errorModel);

    if (typeof outSpec.precision === "number" && !isNaN(formattedVal)) {
      formattedVal = parseFloat(formattedVal.toFixed(outSpec.precision));
    }

    outputsState[outKey] = formattedVal;
    context[outKey] = formattedVal;
  }

  return {
    inputs: inputsState,
    equations: equationsState,
    outputs: outputsState,
    rawOutputs: rawOutputsState,
  };
}
