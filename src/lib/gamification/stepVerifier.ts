/**
 * Deterministic Step Answer Verifier
 * Evaluates student numeric answers against ground-truth values with configurable tolerance %.
 */

export interface VerificationResult {
  isCorrect: boolean;
  studentValue: number;
  idealValue: number;
  tolerancePercent: number;
  lowerBound: number;
  upperBound: number;
  message: string;
}

export function verifyStepAnswer(
  studentInput: number | string,
  idealValue: number,
  tolerancePercent = 5.0
): VerificationResult {
  const studentNum = typeof studentInput === "number" ? studentInput : parseFloat(studentInput);

  if (isNaN(studentNum)) {
    return {
      isCorrect: false,
      studentValue: NaN,
      idealValue,
      tolerancePercent,
      lowerBound: idealValue,
      upperBound: idealValue,
      message: "Please enter a valid numeric value.",
    };
  }

  const allowedMargin = Math.abs(idealValue * (tolerancePercent / 100));
  const lowerBound = parseFloat((idealValue - allowedMargin).toFixed(4));
  const upperBound = parseFloat((idealValue + allowedMargin).toFixed(4));

  const isCorrect = studentNum >= lowerBound && studentNum <= upperBound;

  return {
    isCorrect,
    studentValue: studentNum,
    idealValue,
    tolerancePercent,
    lowerBound,
    upperBound,
    message: isCorrect
      ? `Correct! Your reading ${studentNum} is within ±${tolerancePercent}% tolerance.`
      : `Incorrect. Your reading ${studentNum} lies outside allowed range [${lowerBound}, ${upperBound}].`,
  };
}
