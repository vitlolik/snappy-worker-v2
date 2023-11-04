import { Ctx, Start, Update, Command, InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';

import { WhatDayTodayService } from 'src/what-day-today/what-day-today.service';
import { botCommandList, botCommands, botName } from './bot.constants';

@Update()
export class BotUpdate {
  constructor(
    @InjectBot(botName) private readonly bot: Telegraf<Context>,
    private readonly whatDayTodayService: WhatDayTodayService,
  ) {}

  @Start()
  async start(@Ctx() ctx: Context) {
    await this.bot.telegram.setMyCommands(botCommandList);
    await ctx.reply('👋🏻');
  }

  @Command(botCommands.hi.command)
  async sendHey(@Ctx() ctx: Context) {
    await ctx.replyWithHTML('<b>Привет 👋🏻</b>');
  }

  @Command(botCommands.day.command)
  async sendDayName(@Ctx() ctx: Context) {
    const names = await this.whatDayTodayService.getNames();
    await ctx.reply(names[0]);
  }
}
