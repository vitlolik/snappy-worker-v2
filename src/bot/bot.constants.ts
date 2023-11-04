import { BotCommand } from 'telegraf/typings/core/types/typegram';

const botName = 'snappy-worker';

const botCommands = {
  hi: {
    command: 'hi',
    description: 'ботик скажет привет',
  },
  day: {
    command: 'day',
    description: 'какой сегодня день',
  },
};

const botCommandList: readonly BotCommand[] = Object.entries(botCommands).map(
  ([, { command, description }]) => ({ command, description }),
);

export { botCommandList, botCommands, botName };
