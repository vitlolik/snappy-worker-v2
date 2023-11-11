import { Module } from '@nestjs/common';
import { HolidaysService } from './holidays.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [HolidaysService],
  exports: [HolidaysService],
})
export class HolidaysModule {}
