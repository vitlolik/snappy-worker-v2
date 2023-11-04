import { Module } from '@nestjs/common';
import { BotUpdate } from './bot.update';
import { WhatDayTodayModule } from 'src/what-day-today/what-day-today.module';

@Module({
  imports: [WhatDayTodayModule],
  providers: [BotUpdate],
})
export class BotModule {}
