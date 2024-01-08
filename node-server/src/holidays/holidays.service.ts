import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HolidaysService {
  private apiUrl: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.apiUrl = `http://${configService.get('HOLIDAYS_SERVER_HOSTNAME')}`;
  }

  /**
   * @param date MM-DD
   */
  async getRandomHolidayByDate(date: string): Promise<string> {
    try {
      const { data: holidays } = await this.httpService.axiosRef.get<string[]>(
        `${this.apiUrl}/${date}.json`,
      );

      if (!holidays.length) {
        throw new NotFoundException('HolidaysService: no holidays');
      }

      return holidays[Math.floor(Math.random() * holidays.length)];
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      throw new BadRequestException('HolidaysService: not response', {
        cause: error,
      });
    }
  }
}
