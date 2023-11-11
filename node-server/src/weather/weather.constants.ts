import { CityCoords, WeatherIcon } from './weather.types';

const cityCoordinates: {
  barcelona: CityCoords;
  rostov: CityCoords;
  tbilisi: CityCoords;
  astana: CityCoords;
} = {
  barcelona: { cityName: 'Барселона', coords: [41.390205, 2.154007] },
  rostov: {
    cityName: 'Ростов-на-Дону',
    coords: [47.233334, 39.700001],
  },
  tbilisi: { cityName: 'Тбилиси', coords: [41.716667, 44.783333] },
  astana: { cityName: 'Астана', coords: [51.169392, 71.449074] },
};

const weatherIconMap: Record<WeatherIcon, string> = {
  '01d': '☀️',
  '02d': '🌤️',
  '03d': '☁️',
  '04d': '☁️',
  '09d': '🌧️',
  '10d': '🌦️',
  '11d': '🌩️',
  '13d': '❄️',
  '50d': '🌫️',
  '01n': '🌚',
  '02n': '🌗',
  '03n': '☁︎',
  '04n': '☁︎',
  '09n': '🌧️',
  '10n': '🌧️',
  '11n': '🌩️',
  '13n': '❄️',
  '50n': '🌫️',
};

export { cityCoordinates, weatherIconMap };
