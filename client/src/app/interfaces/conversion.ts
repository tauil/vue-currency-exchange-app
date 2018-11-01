export interface Conversion {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  inverseRate: number;
  initialAmount: number;
  finalAmount: number;
  date: string;
}
