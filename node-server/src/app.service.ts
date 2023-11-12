import { Injectable } from '@nestjs/common';
import { botName } from './bot/bot.constants';
import { BotCommand } from 'telegraf/typings/core/types/typegram';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';

@Injectable()
export class AppService {
  constructor(@InjectBot(botName) private readonly bot: Telegraf<Context>) {}

  getBotCommands(): Promise<BotCommand[]> {
    return this.bot.telegram.getMyCommands();
  }
}
