import { Ctx, Start, Update, Command, InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';

import { botCommandList, botCommands, botName } from './bot.constants';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CoinMarketService } from 'src/coin-market/coin-market.service';
import { CryptocurrencyId } from 'src/coin-market/coin-market.types';
import { CurrencyRateService } from 'src/currency-rate/currency-rate.service';
import { Currency } from 'src/currency-rate/currency-rate.types';
import { NewsService } from 'src/news/news.service';
import { WeatherService } from 'src/weather/weather.service';
import { cityCoordinates, weatherIconMap } from 'src/weather/weather.constants';

// https://core.telegram.org/bots/api
// https://core.telegram.org/bots/features#keyboards

@Update()
export class BotUpdate {
  constructor(
    @InjectBot(botName) private readonly bot: Telegraf<Context>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly coinMarketService: CoinMarketService,
    private readonly currencyRateService: CurrencyRateService,
    private readonly newsService: NewsService,
    private readonly weatherService: WeatherService,
  ) {}

  @Start()
  async start(@Ctx() ctx: Context) {
    await Promise.all([
      this.cacheManager.reset(),
      this.bot.telegram.setMyCommands(botCommandList),
    ]);
    await ctx.reply('👋🏻');
  }

  @Command(botCommands.hi.command)
  async sendHey(@Ctx() ctx: Context) {
    await ctx.replyWithHTML('<b>Привет 👋🏻</b>');
  }

  @Command(botCommands.news.command)
  async sendRandomNews(@Ctx() ctx: Context) {
    const news = await this.newsService.getRandomFakeNews();

    await ctx.replyWithPhoto({ url: news.img }, { caption: news.text });
  }

  @Command(botCommands.tugrik.command)
  async sendInfoAboutCrypto(@Ctx() ctx: Context) {
    const currencies = await this.coinMarketService.getCryptocurrenciesQuotes([
      CryptocurrencyId.btc,
      CryptocurrencyId.ton,
      CryptocurrencyId.usdt,
    ]);

    const messages = currencies.map((item) => {
      const {
        symbol,
        quote: {
          USD: { price, percent_change_24h },
        },
      } = item;
      const isNegativeChange = percent_change_24h < 0;

      return `<i>${symbol}</i> — <code>${price.toFixed(2)}</code> (на ${
        isNegativeChange ? '-' : ''
      }${Math.abs(percent_change_24h).toFixed(2)}% изменился за 24 часа)`;
    });

    await ctx.replyWithHTML(
      `\n<b>Курсы тугриков $</b>\n\n${messages.join('\n\n')}`,
    );
  }

  @Command(botCommands.rate.command)
  async sendInfoAboutCurrency(@Ctx() ctx: Context) {
    const currencies = await this.currencyRateService.getCurrencyExchangeRate([
      Currency.usd,
      Currency.eur,
    ]);

    const messages = currencies.map((item) => {
      const { value, name } = item;
      return `<i>${name}</i> — <code>${value.toFixed(2)}</code>`;
    });

    await ctx.replyWithHTML(
      `\n<b>Курсы валют ₽</b>\n\n${messages.join('\n\n')}`,
    );
  }

  @Command(botCommands.weather.command)
  async sendWeather(@Ctx() ctx: Context) {
    const data = await this.weatherService.getWeatherByCoordsList([
      cityCoordinates.barcelona,
      cityCoordinates.rostov,
      cityCoordinates.astana,
      cityCoordinates.tbilisi,
    ]);
    const renderTemperature = (value: number) => {
      value = Math.round(value);
      const isNegative = value < 0;

      return `${isNegative ? '-' : '+'}${Math.abs(value)}`;
    };

    const messages = data.map(({ cityName, weather, main }) => {
      return `<b>${cityName} ${
        weatherIconMap[weather.icon]
      }</b>\n<i>${renderTemperature(main.temp)}</i>, ${weather.description}`;
    });

    await ctx.replyWithHTML(messages.join('\n\n'));
  }
}
