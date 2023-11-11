enum CryptocurrencyId {
  btc = 1,
  ton = 11419,
  usdt = 825,
}

type CryptocurrencyQuote = {
  id: CryptocurrencyId;
  name: string;
  symbol: string;
  quote: {
    USD: {
      price: number;
      percent_change_24h: number;
    };
  };
};

type CryptocurrencyQuoteResponse = {
  data: Record<string, CryptocurrencyQuote>;
};

export { CryptocurrencyId, CryptocurrencyQuote, CryptocurrencyQuoteResponse };
