import { Module } from '@nestjs/common';
import { BotUpdate } from './bot.update';
import { CoinMarketModule } from 'src/coin-market/coin-market.module';
import { CurrencyRateModule } from 'src/currency-rate/currency-rate.module';
import { NewsModule } from 'src/news/news.module';
import { WeatherModule } from 'src/weather/weather.module';
import { HolidaysModule } from 'src/holidays/holidays.module';

@Module({
  imports: [
    CoinMarketModule,
    CurrencyRateModule,
    NewsModule,
    WeatherModule,
    HolidaysModule,
  ],
  providers: [BotUpdate],
})
export class BotModule {}
