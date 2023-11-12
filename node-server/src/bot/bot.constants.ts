import { CommandRecord } from './bot.types';

const botName = 'snappy-worker';

const botCommands: CommandRecord<
  ['hi', 'news', 'tugrik', 'rate', 'weather', 'holiday']
> = {
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
  weather: {
    command: 'weather',
    description: 'погода',
  },
  holiday: {
    command: 'holiday',
    description: 'какой сегодня праздник',
  },
};

export { botCommands, botName };
