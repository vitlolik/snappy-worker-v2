import { Injectable } from '@nestjs/common';
import { botCommandList } from './bot/bot.constants';
import { BotCommand } from 'telegraf/typings/core/types/typegram';

@Injectable()
export class AppService {
  getBotCommands(): readonly BotCommand[] {
    return botCommandList;
  }
}
