// Removes timezone from datetime when only caring about time without timezone
// (new Date() gives 01/01/2022 08:00:00 GMT+8, function converts this to 01/01/2022 00:00:00 GMT+8)
export function removeTimezone(e: any) {
  const date = new Date(e);
  const userTimezoneOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() + userTimezoneOffset);
}

// Add timezone to datetime (date given as 01/01/2022 00:00:00 GMT+8, function converts time to 08:00:00 GMT+8 which is = 00:00:00 UTC)
export function addTimezone(e: Date) {
  const date = new Date(e);
  const userTimezoneOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - userTimezoneOffset);
}

export function getDateFromMonthNumber(month: number) {
  return new Date(new Date().getFullYear() + 1 + Math.floor(month / 12), month % 12, 1);
}

export function addMonths(date: Date, months: number): Date {
  const newDate = new Date(date);
  var d = newDate.getDate();
  newDate.setMonth(newDate.getMonth() + +months);
  if (newDate.getDate() != d) {
    newDate.setDate(0);
  }
  return newDate;
}

// Get coverage start/end date (xx months from now)
export function getCoverageStart(months: number, deductDay: boolean = true) {
  let date = removeTimezone(new Date());
  if (deductDay) {
    date.setDate(date.getDate() - 1);
  }
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

export function getCoverageEnd(months: number, deductDay: boolean = true) {
  let date = removeTimezone(new Date());
  if (deductDay) {
    date.setDate(date.getDate() - 1);
  }
  return new Date(date.getFullYear(), date.getMonth() + months + 1, 0);
}

export function monthsDelta(d1: string | Date, d2: string | Date) {
  d1 = new Date(d1);
  d2 = new Date(d2);
  let months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();
  return months;
}
