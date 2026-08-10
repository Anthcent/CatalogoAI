export function cosineSimilarity(left: number[], right: number[]) {
  if (!left.length || left.length !== right.length) return 0;
  let dot = 0,
    leftNorm = 0,
    rightNorm = 0;
  for (let index = 0; index < left.length; index++) {
    dot += left[index] * right[index];
    leftNorm += left[index] ** 2;
    rightNorm += right[index] ** 2;
  }
  return leftNorm && rightNorm
    ? dot / (Math.sqrt(leftNorm) * Math.sqrt(rightNorm))
    : 0;
}
