import {
  Ctx,
  Start,
  Update,
  Command,
  InjectBot,
  Sender,
} from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';

import { botCommands, botName } from './bot.constants';
import { CoinMarketService } from 'src/coin-market/coin-market.service';
import { CryptocurrencyId } from 'src/coin-market/coin-market.types';
import { CurrencyRateService } from 'src/currency-rate/currency-rate.service';
import { Currency } from 'src/currency-rate/currency-rate.types';
import { NewsService } from 'src/news/news.service';
import { WeatherService } from 'src/weather/weather.service';
import { cityCoordinates, weatherIconMap } from 'src/weather/weather.constants';
import { HolidaysService } from 'src/holidays/holidays.service';
import { CacheService } from 'src/cache/cache.service';
import { TelegrafExceptionFilter } from 'src/filters/telegraf-exception.filter';
import { UseFilters } from '@nestjs/common';
import { GoodMorningService } from 'src/good-morning/good-morning.service';

// https://core.telegram.org/bots/api
// https://core.telegram.org/bots/features#keyboards
// https://github.com/feathers-studio/telegraf-docs

@Update()
@UseFilters(TelegrafExceptionFilter)
export class BotUpdateService {
  constructor(
    @InjectBot(botName) private readonly bot: Telegraf<Context>,
    private readonly cacheService: CacheService,
    private readonly coinMarketService: CoinMarketService,
    private readonly currencyRateService: CurrencyRateService,
    private readonly newsService: NewsService,
    private readonly weatherService: WeatherService,
    private readonly holidaysService: HolidaysService,
    private readonly goodMorningService: GoodMorningService,
  ) {
    this.bot.telegram.setMyCommands(
      Object.entries(botCommands).map(([, { command, description }]) => ({
        command,
        description,
      })),
    );
  }

  @Start()
  async start(@Ctx() ctx: Context) {
    await this.cacheService.clear();
    await ctx.reply('👋🏻');
  }

  @Command(botCommands.hi.command)
  async sendHey(@Ctx() ctx: Context, @Sender('first_name') firstName: string) {
    await ctx.replyWithHTML(`<b>Hi, ${firstName} 👋🏻</b>`);
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

  @Command(botCommands.holiday.command)
  async sendHoliday(@Ctx() ctx: Context) {
    const currentDate = new Date();
    const month = `${currentDate.getMonth() + 1}`.padStart(2, '0');
    const day = `${currentDate.getDate()}`.padStart(2, '0');

    try {
      const holiday = await this.holidaysService.getRandomHolidayByDate(
        `${month}-${day}`,
      );
      await ctx.reply(holiday);
    } catch {
      await ctx.reply('Нет праздников. Соси хуй быдло');
    }
  }

  @Command(botCommands.good_morning.command)
  async sendGoodMorningPicture(@Ctx() ctx: Context) {
    const pictureUrl = this.goodMorningService.getRandomGoodMorningPicture();

    await ctx.replyWithPhoto({ url: pictureUrl });
  }
}
