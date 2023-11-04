import { BotCommand } from 'telegraf/typings/core/types/typegram';

const botName = 'snappy-worker';

const botCommands = {
  hi: {
    command: 'hi',
    description: 'ботик скажет привет',
  },
  news: {
    command: 'news',
    description: 'пиздец',
  },
  tugrik: {
    command: 'tugrik',
    description: 'инфа по тугрикам',
  },
  rate: {
    command: 'rate',
    description: 'инфа по валютам',
  },
};

const botCommandList: readonly BotCommand[] = Object.entries(botCommands).map(
  ([, { command, description }]) => ({ command, description }),
);

export { botCommandList, botCommands, botName };
