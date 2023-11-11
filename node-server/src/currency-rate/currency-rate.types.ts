enum Currency {
  usd = 'USD',
  eur = 'EUR',
}

type CurrencyData = {
  name: string;
  value: number;
  preValue: number;
};

type CurrencyExchangeResponseData = {
  Name: string;
  Value: number;
  Previous: number;
};

type CurrenciesExchangeRateResponse = {
  Valute: Record<Currency, CurrencyExchangeResponseData>;
};

export {
  Currency,
  CurrenciesExchangeRateResponse,
  CurrencyExchangeResponseData,
  CurrencyData,
};
