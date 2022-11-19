import { IndexPrice, PriceFrequency } from '../../core/models/index.model';
import { getDecimal } from '../../core/utils/number.util';

function makeHoverTemplate(item: IndexPrice): string {
  let hoverString = '';

  try {
    if (item.stable_assigned_date) {
      hoverString += '<br> Stable Assigned Date: ' + item.stable_assigned_date;
    }
  } catch {}
  try {
    if (item.published_date) {
      hoverString += '<br> Published Date: ' + item.published_date;
    }
  } catch {}
  try {
    if (item.report_start_date) {
      hoverString += '<br> Report Start Date: ' + item.report_start_date;
    }
  } catch {}
  try {
    if (item.report_end_date) {
      hoverString += '<br> Report End Date: ' + item.report_end_date;
    }
  } catch {}
  hoverString += `<br> Price: ${getDecimal(item.price, 4)}`;
  return hoverString;
}

export function parseIndexPrices(results: IndexPrice[]) {
  const x: string[] = [];
  const y: number[] = [];
  const hoverTemplate: string[] = [];

  const extensionX: string[] = [];
  const extensionY: number[] = [];

  results.map((item: IndexPrice) => {
    if (item.is_extension_price) {
      extensionX.push(item.stable_assigned_date);
      extensionY.push(item.price);
    } else {
      x.push(item.stable_assigned_date);
      y.push(item.price);
      hoverTemplate.push(makeHoverTemplate(item));
    }
  });

  // Removing leading and ending nulls
  while (y[0] === null) {
    y.shift();
    x.shift();
    hoverTemplate.shift();
  }
  while (y[y.length - 1] === null) {
    y.pop();
    x.pop();
    hoverTemplate.pop();
  }

  return { x, y, hoverTemplate, extensionX, extensionY };
}

export function windowPeriodFromFrequency(frequency: PriceFrequency, months: number): number {
  switch (frequency) {
    case PriceFrequency.Daily:
      return Math.ceil((252 * months) / 12);
    case PriceFrequency.Weekly:
      return Math.ceil((52 * months) / 12);
    // Two per week is plotted on daily basis
    case PriceFrequency.TwoPerWeek:
      return Math.ceil((365 * months) / 12);
    case PriceFrequency.EveryTwoWeeks:
      return Math.ceil((26 * months) / 12);
    case PriceFrequency.Monthly:
      return months;
    case PriceFrequency.Quarterly:
      return Math.ceil(months / 3);
    default:
      return Math.ceil((365 * months) / 12);
  }
}
