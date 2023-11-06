import { Catch, ExceptionFilter } from '@nestjs/common';
import { TelegrafException } from 'nestjs-telegraf';
import { TelegramError } from 'telegraf';

@Catch(TelegrafException, TelegramError)
export class TelegrafExceptionFilter implements ExceptionFilter {
  async catch(exception: TelegrafException | TelegramError): Promise<void> {
    console.log('TELEGRAM BOT ERROR', exception);
  }
}
