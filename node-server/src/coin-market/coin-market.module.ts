import { Module } from '@nestjs/common';
import { CoinMarketService } from './coin-market.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [CoinMarketService],
  exports: [CoinMarketService],
})
export class CoinMarketModule {}
