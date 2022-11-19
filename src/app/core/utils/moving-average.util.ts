export function movingAverage(y: number[], window: number) {
  const yma = [];
  for (let i = 0; i < y.length; i++) {
    if (i < window - 1) {
      yma.push(null);
    } else {
      const ysum = y.slice(i - window + 1, i + 1).reduce((a, b) => a + b, 0);
      const ymean = ysum / y.slice(i - window + 1, i + 1).reduce((a, b) => (b !== null ? a + 1 : a), 0);
      yma.push(ymean);
    }
  }
  return yma;
}
