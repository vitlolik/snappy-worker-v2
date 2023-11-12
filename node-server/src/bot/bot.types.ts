import type { BotCommand } from 'telegraf/typings/core/types/typegram';

type Prettify<T> = {
  [K in keyof T]: T[K];
  // eslint-disable-next-line @typescript-eslint/ban-types
} & {};

type CommandRecord<T> = T extends [
  infer First extends string,
  ...infer Rest extends readonly string[],
]
  ? Prettify<
      Record<First, { command: First; description: string }> &
        CommandRecord<Rest>
    >
  : unknown;

export type { BotCommand, CommandRecord };
