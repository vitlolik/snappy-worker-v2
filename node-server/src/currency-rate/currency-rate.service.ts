import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import {
  CurrenciesExchangeRateResponse,
  Currency,
  CurrencyData,
} from './currency-rate.types';
import { catchError, lastValueFrom, map } from 'rxjs';
import { oneHourInMs } from 'src/app.constants';

@Injectable()
export class CurrencyRateService {
  private apiUrl = 'https://www.cbr-xml-daily.ru/daily_json.js';

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly httpService: HttpService,
  ) {}

  private getParsedResponse(
    { Valute }: CurrenciesExchangeRateResponse,
    currencies: Currency[],
  ): CurrencyData[] {
    return currencies.map((item) => {
      const currency = Valute[item];

      return {
        name: currency.Name,
        value: currency.Value,
        preValue: currency.Previous,
      };
    });
  }

  async getCurrencyExchangeRate(
    currencies: Currency[],
  ): Promise<CurrencyData[]> {
    const currenciesFromCache = await this.cacheManager.get<CurrencyData[]>(
      'currency-exchange-rate',
    );

    if (currenciesFromCache) return currenciesFromCache;

    const request = this.httpService
      .get(this.apiUrl)
      .pipe(map((response) => response.data))
      .pipe(
        catchError((error) => {
          console.log(error);
          throw new HttpException(
            'CurrencyRateService: Cannot get currency exchange rate',
            HttpStatus.BAD_REQUEST,
            { cause: error },
          );
        }),
      );

    const response = await lastValueFrom<CurrenciesExchangeRateResponse>(
      request,
    );
    const currencyExchangeRate = this.getParsedResponse(response, currencies);

    if (currencyExchangeRate.length) {
      await this.cacheManager.set(
        'currency-exchange-rate',
        currencyExchangeRate,
        oneHourInMs,
      );
    }

    return currencyExchangeRate;
  }
}
