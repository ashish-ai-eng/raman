import { evaluateMath } from "./evaluator";

export interface Point {
  x: number;
  y: number;
}

export interface LinearRegressionResult {
  slope: number;        // m
  intercept: number;    // c
  rSquared: number;     // R^2 fit (0.0 to 1.0)
  pointCount: number;
  extractedConstant?: {
    label: string;
    value: number;
  };
}

/**
 * Performs least-squares linear regression on an array of (x, y) points.
 * Fits line Y = m * X + c and evaluates optional physical constant formula.
 */
export function calculateLinearRegression(
  points: Point[],
  constantFormula?: string,
  constantLabel?: string
): LinearRegressionResult {
  const n = points.length;

  if (n < 2) {
    return {
      slope: 0,
      intercept: 0,
      rSquared: 0,
      pointCount: n,
    };
  }

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;
  let sumYY = 0;

  for (const p of points) {
    sumX += p.x;
    sumY += p.y;
    sumXY += p.x * p.y;
    sumXX += p.x * p.x;
    sumYY += p.y * p.y;
  }

  const denominator = n * sumXX - sumX * sumX;

  if (denominator === 0) {
    return {
      slope: 0,
      intercept: sumY / n,
      rSquared: 0,
      pointCount: n,
    };
  }

  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;

  // Calculate Coefficient of Determination (R^2)
  const yMean = sumY / n;
  let totalSumSquares = 0;
  let residualSumSquares = 0;

  for (const p of points) {
    const yPred = slope * p.x + intercept;
    totalSumSquares += (p.y - yMean) * (p.y - yMean);
    residualSumSquares += (p.y - yPred) * (p.y - yPred);
  }

  const rSquared =
    totalSumSquares === 0 ? 1 : Math.max(0, 1 - residualSumSquares / totalSumSquares);

  let extractedConstant: { label: string; value: number } | undefined;

  if (constantFormula && constantLabel) {
    try {
      const constantValue = evaluateMath(constantFormula, {
        slope,
        m: slope,
        intercept,
        c: intercept,
      });

      if (!isNaN(constantValue) && isFinite(constantValue)) {
        extractedConstant = {
          label: constantLabel,
          value: parseFloat(constantValue.toFixed(4)),
        };
      }
    } catch {
      // Ignored if constant formula evaluation fails
    }
  }

  return {
    slope: parseFloat(slope.toFixed(6)),
    intercept: parseFloat(intercept.toFixed(6)),
    rSquared: parseFloat(rSquared.toFixed(4)),
    pointCount: n,
    extractedConstant,
  };
}
