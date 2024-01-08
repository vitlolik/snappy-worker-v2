import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BotModule } from './bot/bot.module';
import { botName } from './bot/bot.constants';
import { CacheModule } from '@nestjs/cache-manager';
import { CoinMarketModule } from './coin-market/coin-market.module';
import { CurrencyRateModule } from './currency-rate/currency-rate.module';
import { NewsModule } from './news/news.module';
import { WeatherModule } from './weather/weather.module';
import { CacheService } from './cache/cache.service';
import { HolidaysModule } from './holidays/holidays.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { BotUpdateService } from './bot/bot-update.service';
import { GoodMorningModule } from './good-morning/good-morning.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TelegrafModule.forRootAsync({
      botName,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        token: configService.get('TELEGRAM_BOT_TOKEN') as string,
      }),
      inject: [ConfigService],
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    BotModule,
    CoinMarketModule,
    CurrencyRateModule,
    NewsModule,
    WeatherModule,
    HolidaysModule,
    GoodMorningModule,
  ],
  controllers: [AppController],
  providers: [AppService, CacheService, BotUpdateService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('/');
  }
}
