import { Module } from '@nestjs/common';
import { GoodMorningService } from './good-morning.service';

@Module({
  providers: [GoodMorningService],
  exports: [GoodMorningService],
})
export class GoodMorningModule {}
