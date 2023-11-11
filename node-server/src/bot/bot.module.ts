import { Module } from '@nestjs/common';
import { BotUpdateService } from './bot-update.service';
import { CoinMarketModule } from 'src/coin-market/coin-market.module';
import { CurrencyRateModule } from 'src/currency-rate/currency-rate.module';
import { NewsModule } from 'src/news/news.module';
import { WeatherModule } from 'src/weather/weather.module';
import { HolidaysModule } from 'src/holidays/holidays.module';
import { CacheService } from 'src/cache/cache.service';

@Module({
  imports: [
    CoinMarketModule,
    CurrencyRateModule,
    NewsModule,
    WeatherModule,
    HolidaysModule,
  ],
  providers: [BotUpdateService, CacheService],
})
export class BotModule {}
