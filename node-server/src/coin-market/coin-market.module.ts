import { Module } from '@nestjs/common';
import { CoinMarketService } from './coin-market.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { CacheService } from 'src/cache/cache.service';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [CoinMarketService, CacheService],
  exports: [CoinMarketService],
})
export class CoinMarketModule {}
