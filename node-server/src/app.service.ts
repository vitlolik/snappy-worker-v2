import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';

import { botName } from './bot/bot.constants';
import { BotCommand } from './bot/bot.types';

@Injectable()
export class AppService {
  constructor(@InjectBot(botName) private readonly bot: Telegraf<Context>) {}

  async getBotCommands(): Promise<BotCommand[]> {
    return this.bot.telegram.getMyCommands();
  }
}
