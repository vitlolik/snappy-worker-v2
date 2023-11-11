import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CityCoords,
  WeatherDataWithCity,
  WeatherResponse,
} from './weather.types';
import { CacheService } from 'src/cache/cache.service';
import { oneHourInMs } from 'src/app.constants';

@Injectable()
export class WeatherService {
  private apiKey: string;
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

  constructor(
    private readonly cacheService: CacheService,
    private readonly httpService: HttpService,
    readonly configService: ConfigService,
  ) {
    this.apiKey = configService.get('OPEN_WEATHER_API_KEY') as string;
  }

  private async getWeatherByCoords({
    cityName,
    coords: [lat, lon],
  }: CityCoords): Promise<WeatherDataWithCity> {
    try {
      const { data } = await this.httpService.axiosRef.get<WeatherResponse>(
        this.apiUrl,
        {
          params: {
            lat,
            lon,
            units: 'metric',
            appid: this.apiKey,
            lang: 'ru',
          },
        },
      );

      return {
        ...data,
        weather: data.weather[0],
        cityName,
      };
    } catch (error) {
      throw new BadRequestException('WeatherService: Cannot get weather data', {
        cause: error,
      });
    }
  }

  async getWeatherByCoordsList(
    coordsList: CityCoords[],
  ): Promise<WeatherDataWithCity[]> {
    return this.cacheService.withCache('weather', oneHourInMs, () =>
      Promise.all(coordsList.map((coords) => this.getWeatherByCoords(coords))),
    );
  }
}
