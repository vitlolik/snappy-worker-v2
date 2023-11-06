type Coords = [number, number];

type City = { cityName: string };

type CityCoords = City & { coords: Coords };

type WeatherIcon =
  | '01d'
  | '02d'
  | '03d'
  | '04d'
  | '09d'
  | '10d'
  | '11d'
  | '13d'
  | '50d'
  | '01n'
  | '02n'
  | '03n'
  | '04n'
  | '09n'
  | '10n'
  | '11n'
  | '13n'
  | '50n';

type Weather = {
  id: number;
  description: string;
  icon: WeatherIcon;
};

type WeatherResponse = {
  weather: Weather[];
  main: {
    temp: number;
    feels_like: number;
  };
};

type WeatherDataWithCity = Omit<WeatherResponse, 'weather'> &
  City & { weather: Weather };

export type { WeatherIcon, WeatherResponse, CityCoords, WeatherDataWithCity };
