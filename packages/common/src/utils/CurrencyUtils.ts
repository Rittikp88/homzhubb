class CurrencyUtils {
  public getCurrency = (currency: string, value: number): string => {
    switch (currency) {
      case 'INR':
        if (value < 100000) {
          return value.toLocaleString();
        }
        if (value > 100000 && value < 10000000) {
          return `${(value / 100000).toFixed(2)}Lakhs`;
        }
        if (value > 10000000 && value < 1000000000) {
          return `${Math.round(value / 10000000)}Crore`;
        }
        if (value > 10000000000) {
          return `${Math.round(value / 1000000000)}Crore`;
        }
        return '1B+';
      case 'AUD':
      case 'SGD':
      case 'USD':
        if (value < 9999) {
          return value.toLocaleString();
        }
        if (value < 1000000) {
          return `${Math.round(value / 1000)}K`;
        }
        if (value < 10000000) {
          return `${(value / 1000000).toFixed(2)}Mn`;
        }
        if (value < 1000000000) {
          return `${Math.round(value / 1000000)}Mn`;
        }
        if (value < 1000000000000) {
          return `${Math.round(value / 1000000000)}B`;
        }
        return '1T+';
      default:
        return `${currency} ${value.toLocaleString()}`;
    }
  };
}

const currencyUtils = new CurrencyUtils();
export { currencyUtils as CurrencyUtils };
