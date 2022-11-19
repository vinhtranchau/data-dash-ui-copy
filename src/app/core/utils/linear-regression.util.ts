export function linearRegression(x: number[], y: number[]) {
  let n = 0;
  let sum_x = 0;
  let sum_y = 0;
  let sum_xy = 0;
  let sum_xx = 0;
  let sum_yy = 0;

  for (let i = 0; i < y.length; i++) {
    if (y[i] !== null) {
      sum_x += x[i];
      sum_y += y[i];
      sum_xy += x[i] * y[i];
      sum_xx += x[i] * x[i];
      sum_yy += y[i] * y[i];
      n += 1;
    }
  }

  // Slope
  const sl = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x);
  // Offset
  const off = (sum_y - sl * sum_x) / n;
  // R^2
  const r2 = Math.pow(
    (n * sum_xy - sum_x * sum_y) / Math.sqrt((n * sum_xx - sum_x * sum_x) * (n * sum_yy - sum_y * sum_y)),
    2
  );

  return { sl, off, r2 };
}
