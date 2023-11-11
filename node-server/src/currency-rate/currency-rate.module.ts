import { Module } from '@nestjs/common';
import { CurrencyRateService } from './currency-rate.service';
import { HttpModule } from '@nestjs/axios';
import { CacheService } from 'src/cache/cache.service';

@Module({
  imports: [HttpModule],
  providers: [CurrencyRateService, CacheService],
  exports: [CurrencyRateService],
})
export class CurrencyRateModule {}
