import { Module } from '@nestjs/common';
import { BotUpdate } from './bot.update';
import { CoinMarketModule } from 'src/coin-market/coin-market.module';
import { CurrencyRateModule } from 'src/currency-rate/currency-rate.module';
import { NewsModule } from 'src/news/news.module';

@Module({
  imports: [CoinMarketModule, CurrencyRateModule, NewsModule],
  providers: [BotUpdate],
})
export class BotModule {}
