export enum MonthTypes {
  Jan = 'Jan',
  Feb = 'Feb',
  Mar = 'Mar',
  Apr = 'Apr',
  May = 'May',
  Jun = 'Jun',
  Jul = 'Jul',
  Aug = 'Aug',
  Sep = 'Sep',
  Oct = 'Oct',
  Nov = 'Nov',
  Dec = 'Dec',
}

type MonthKeys = keyof typeof MonthTypes;

type MonthFields = { [key in MonthKeys]: number };

export interface Months extends MonthFields {}

export const monthsOrder = Object.values(MonthTypes);
