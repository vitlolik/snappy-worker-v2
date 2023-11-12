import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { BotCommand } from './bot/bot.types';

@Controller('commands')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  getBotCommands(): Promise<BotCommand[]> {
    return this.appService.getBotCommands();
  }
}
