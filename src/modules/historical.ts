import yahooFinanceFetch = require('../lib/yahooFinanceFetch');
import csv2json from '../lib/csv2json';

const QUERY_URL = 'https://query1.finance.yahoo.com/v7/finance/download';

export interface HistoricalRow {
  date: Date;
  open: number;
  low: number;
  close: number;
  adjClose?: number;
  volume: number;
}

interface HistoricalOptions {
  period1: Date | string | number;
  period2?: Date | string | number;
  interval?: '1d' | '1wk' | '1mo';  // '1d',  TODO all | types
  events?: string;                  // 'history',
  includeAdjustedClose?: boolean;   // true,
}

const queryOptionsDefaults: Omit<HistoricalOptions,'period1'> = {
  interval: '1d',
  events: 'history',
  includeAdjustedClose: true,
};

export default async function historical(
  symbol: string,
  queryOptionsOverrides: HistoricalOptions,
  fetchOptions?: object
): Promise<Array<HistoricalRow>> {
  const queryOptions: HistoricalOptions = {
    ...queryOptionsDefaults,
    ...queryOptionsOverrides
  };

  if (!queryOptions.period2)
    queryOptions.period2 = new Date();

  const dates = [ 'period1', 'period2' ] as const;
  for (let fieldName of dates) {
    const value = queryOptions[fieldName];
    if (value instanceof Date)
      queryOptions[fieldName] = Math.floor(value.getTime() / 1000);
    else (typeof value === 'string')
      queryOptions[fieldName] = Math.floor(new Date(value as string).getTime() / 1000);
  }

  const url = QUERY_URL + '/' + symbol;
  const csv = await yahooFinanceFetch(url, queryOptions, fetchOptions, 'text');
  const result = csv2json(csv);
  return result;
}
