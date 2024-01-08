import type { BotCommand } from 'telegraf/typings/core/types/typegram';

type Prettify<T> = {
  [K in keyof T]: T[K];
  // eslint-disable-next-line @typescript-eslint/ban-types
} & {};

type CommandRecord<T> = T extends [
  infer Command extends string,
  ...infer RestCommands extends readonly string[],
]
  ? Prettify<
      {
        [Key in Command]: {
          command: Key;
          description: string;
        };
      } & CommandRecord<RestCommands>
    >
  : unknown;

export type { BotCommand, CommandRecord };
