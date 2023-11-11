import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { CacheService } from 'src/cache/cache.service';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [WeatherService, CacheService],
  exports: [WeatherService],
})
export class WeatherModule {}
