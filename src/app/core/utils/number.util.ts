export function getDecimal(value: any, length = 3): any {
  if (value === null || value === undefined) {
    return '-';
  }
  if (typeof value === 'number') {
    return Math.round(value * 10 ** length) / 10 ** length;
  } else {
    return value;
  }
}

export function getPercentage(value: number | string, decimalPlaces = 2, positiveSign = true): string {
  if (value === null || value === undefined) {
    return '-';
  }
  if (typeof value === 'string') {
    return `${value}%`;
  } else {
    if (value > 0) {
      if (positiveSign) {
        return `+${getDecimal(value * 100, decimalPlaces)}%`;
      } else {
        return `${getDecimal(value * 100, decimalPlaces)}%`;
      }
    } else {
      return `${getDecimal(value * 100, decimalPlaces)}%`;
    }
  }
}
