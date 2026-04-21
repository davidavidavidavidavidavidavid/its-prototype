export function classifyError(dividend, divisor, correct, studentAnswer) {
  const num = Number(studentAnswer);
  if (isNaN(num)) return 'no_start';
  const diff = Math.abs(num - correct);
  if (num === dividend * divisor) return 'operation_confusion';
  if (num === dividend + divisor) return 'operation_confusion';
  if (diff <= 2) return 'wrong_fact';
  if (num < 10 && correct > 10) return 'no_start';
  const correctStr = correct.toString();
  const studentStr = num.toString();
  if (
    correctStr.length > 1 &&
    studentStr.length > 1 &&
    correctStr[correctStr.length - 1] === studentStr[studentStr.length - 1]
  ) {
    return 'over_generalisation';
  }
  return 'chunking_breakdown';
}

export const ERROR_LABELS = {
  chunking_breakdown: 'chunking breakdown',
  no_start: 'no start',
  wrong_fact: 'wrong fact',
  operation_confusion: 'operation confusion',
  over_generalisation: 'over-generalisation',
  iterative_not_attempted: 'iterative not attempted',
};
