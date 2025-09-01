export interface Currency {
  code: string;
  symbol: string;
  name: string;
  decimals: number;
  symbolPosition: 'before' | 'after';
}

export const CURRENCIES: Record<string, Currency> = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    decimals: 2,
    symbolPosition: 'before'
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    decimals: 2,
    symbolPosition: 'after'
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    decimals: 2,
    symbolPosition: 'before'
  },
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    decimals: 2,
    symbolPosition: 'before'
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
    decimals: 0,
    symbolPosition: 'before'
  },
  CAD: {
    code: 'CAD',
    symbol: 'C$',
    name: 'Canadian Dollar',
    decimals: 2,
    symbolPosition: 'before'
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    decimals: 2,
    symbolPosition: 'before'
  },
  CHF: {
    code: 'CHF',
    symbol: 'CHF',
    name: 'Swiss Franc',
    decimals: 2,
    symbolPosition: 'before'
  },
  CNY: {
    code: 'CNY',
    symbol: '¥',
    name: 'Chinese Yuan',
    decimals: 2,
    symbolPosition: 'before'
  },
  BRL: {
    code: 'BRL',
    symbol: 'R$',
    name: 'Brazilian Real',
    decimals: 2,
    symbolPosition: 'before'
  },
  MXN: {
    code: 'MXN',
    symbol: '$',
    name: 'Mexican Peso',
    decimals: 2,
    symbolPosition: 'before'
  },
  KRW: {
    code: 'KRW',
    symbol: '₩',
    name: 'South Korean Won',
    decimals: 0,
    symbolPosition: 'before'
  },
  SGD: {
    code: 'SGD',
    symbol: 'S$',
    name: 'Singapore Dollar',
    decimals: 2,
    symbolPosition: 'before'
  },
  NOK: {
    code: 'NOK',
    symbol: 'kr',
    name: 'Norwegian Krone',
    decimals: 2,
    symbolPosition: 'after'
  },
  SEK: {
    code: 'SEK',
    symbol: 'kr',
    name: 'Swedish Krona',
    decimals: 2,
    symbolPosition: 'after'
  },
  DKK: {
    code: 'DKK',
    symbol: 'kr',
    name: 'Danish Krone',
    decimals: 2,
    symbolPosition: 'after'
  },
  PLN: {
    code: 'PLN',
    symbol: 'zł',
    name: 'Polish Złoty',
    decimals: 2,
    symbolPosition: 'after'
  },
  RUB: {
    code: 'RUB',
    symbol: '₽',
    name: 'Russian Ruble',
    decimals: 2,
    symbolPosition: 'after'
  },
  TRY: {
    code: 'TRY',
    symbol: '₺',
    name: 'Turkish Lira',
    decimals: 2,
    symbolPosition: 'before'
  },
  ZAR: {
    code: 'ZAR',
    symbol: 'R',
    name: 'South African Rand',
    decimals: 2,
    symbolPosition: 'before'
  }
};

export const DEFAULT_CURRENCY = 'USD';

export function formatCurrency(amount: number, currencyCode: string = DEFAULT_CURRENCY): string {
  // Safety check for undefined/null/NaN amounts
  if (amount == null || isNaN(amount)) {
    amount = 0;
  }
  
  const currency = CURRENCIES[currencyCode];
  if (!currency) {
    // Fallback to USD if currency not found
    const formattedAmount = amount.toFixed(2);
    return `$${formattedAmount}`;
  }
  
  const formattedAmount = amount.toFixed(currency.decimals);
  
  if (currency.symbolPosition === 'before') {
    return `${currency.symbol}${formattedAmount}`;
  } else {
    return `${formattedAmount} ${currency.symbol}`;
  }
}

export function getCurrencyList(): Currency[] {
  return Object.values(CURRENCIES);
}
