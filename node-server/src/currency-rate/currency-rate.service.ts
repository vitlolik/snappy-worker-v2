import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CurrenciesExchangeRateResponse,
  Currency,
  CurrencyData,
} from './currency-rate.types';
import { oneHourInMs } from 'src/app.constants';
import { CacheService } from 'src/cache/cache.service';

@Injectable()
export class CurrencyRateService {
  private apiUrl = 'https://www.cbr-xml-daily.ru/daily_json.js';

  constructor(
    private readonly cacheService: CacheService,
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
    return this.cacheService.withCache(
      'currency-exchange-rate',
      oneHourInMs,
      async () => {
        try {
          const { data } =
            await this.httpService.axiosRef.get<CurrenciesExchangeRateResponse>(
              this.apiUrl,
            );

          return this.getParsedResponse(data, currencies);
        } catch (error) {
          throw new BadRequestException(
            'CurrencyRateService: Cannot get currency exchange rate',
            { cause: error },
          );
        }
      },
    );
  }
}
