import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { BotCommand } from 'telegraf/typings/core/types/typegram';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getBotCommands(): readonly BotCommand[] {
    return this.appService.getBotCommands();
  }
}
