import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { WhatDayTodayService } from './what-day-today.service';

@Module({
  imports: [HttpModule],
  providers: [WhatDayTodayService],
  exports: [WhatDayTodayService],
})
export class WhatDayTodayModule {}
