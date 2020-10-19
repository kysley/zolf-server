export function ed(x: number) {
  return Math.pow(Math.E, -x);
}

function ed2(x: number): number {
  return ed2(0) * Math.pow(Math.E, -2 * x);
}
