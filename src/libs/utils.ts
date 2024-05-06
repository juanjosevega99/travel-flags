export const getFirstItem = (data: any): string =>
  data && data.length > 0 ? data[0] : 'N/A';

export const getCurrencyDisplay = (currencies: {
  [key: string]: any;
}): string => {
  const currency = currencies ? Object.values(currencies)[0] : undefined;
  return currency ? `${currency.name} (${currency.symbol})` : 'N/A';
};
