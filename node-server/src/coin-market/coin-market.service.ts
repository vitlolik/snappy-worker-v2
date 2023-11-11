import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { catchError, lastValueFrom, map } from 'rxjs';
import {
  CryptocurrencyId,
  CryptocurrencyQuote,
  CryptocurrencyQuoteResponse,
} from './coin-market.types';
import { oneHourInMs } from 'src/app.constants';

@Injectable()
export class CoinMarketService {
  private apiToken: string;
  private apiUrl = 'https://pro-api.coinmarketcap.com/v2';

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    readonly configService: ConfigService,
    private readonly httpService: HttpService,
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
    const currenciesFromCache = await this.cacheManager.get<
      CryptocurrencyQuote[]
    >('crypto-currencies');

    if (currenciesFromCache) return currenciesFromCache;

    const request = this.httpService
      .get(`${this.apiUrl}/cryptocurrency/quotes/latest`, {
        params: {
          id: ids.join(','),
        },
        headers: { 'X-CMC_PRO_API_KEY': this.apiToken },
      })
      .pipe(map((response) => response.data))
      .pipe(
        catchError((error) => {
          console.log(error);
          throw new HttpException(
            'CoinMarketService: Cannot get cryptocurrencies',
            HttpStatus.BAD_REQUEST,
            { cause: error },
          );
        }),
      );

    const response = await lastValueFrom<CryptocurrencyQuoteResponse>(request);
    const currencies = this.getParsedResponse(response);

    if (currencies.length) {
      await this.cacheManager.set('crypto-currencies', currencies, oneHourInMs);
    }

    return currencies;
  }
}
