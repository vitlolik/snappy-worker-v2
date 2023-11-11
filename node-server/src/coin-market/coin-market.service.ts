import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CryptocurrencyId,
  CryptocurrencyQuote,
  CryptocurrencyQuoteResponse,
} from './coin-market.types';
import { oneHourInMs } from 'src/app.constants';
import { CacheService } from 'src/cache/cache.service';

@Injectable()
export class CoinMarketService {
  private apiToken: string;
  private apiUrl = 'https://pro-api.coinmarketcap.com/v2';

  constructor(
    readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly cacheService: CacheService,
  ) {
    this.apiToken = configService.get('COIN_MARKET_TOKEN') as string;
  }

  private getParsedResponse(
    responseData: CryptocurrencyQuoteResponse,
  ): CryptocurrencyQuote[] {
    return [CryptocurrencyId.btc, CryptocurrencyId.usdt, CryptocurrencyId.ton]
      .map((id) => responseData.data[id])
      .filter(Boolean);
  }

  async getCryptocurrenciesQuotes(
    ids: CryptocurrencyId[],
  ): Promise<CryptocurrencyQuote[]> {
    return this.cacheService.withCache(
      'crypto-currencies',
      oneHourInMs,
      async () => {
        try {
          const { data } =
            await this.httpService.axiosRef.get<CryptocurrencyQuoteResponse>(
              `${this.apiUrl}/cryptocurrency/quotes/latest`,
              {
                params: { id: ids.join(',') },
                headers: { 'X-CMC_PRO_API_KEY': this.apiToken },
              },
            );

          return this.getParsedResponse(data);
        } catch (error) {
          throw new BadRequestException(
            'CoinMarketService: Cannot get cryptocurrencies',
            { cause: error },
          );
        }
      },
    );
  }
}
