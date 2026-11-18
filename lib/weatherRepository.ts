import { cityStorage, weatherStorage } from './storage';
import {
  City,
  fetchWeather,
  searchCities,
  WeatherData,
} from './weather';

const CACHE_VERSION = 1;

type WeatherCache = {
  version: number;
  data: WeatherData;
};

function isWeatherData(value: unknown): value is WeatherData {
  if (!value || typeof value !== 'object') return false;
  const data = value as Partial<WeatherData>;
  return Boolean(data.city && data.current && Array.isArray(data.daily) && Array.isArray(data.hourly));
}

function sameCity(first: City, second: City): boolean {
  return first.latitude === second.latitude && first.longitude === second.longitude;
}

export const weatherRepository = {
  fetchWeather,
  searchCities,
  async saveWeather(data: WeatherData): Promise<void> {
    const cache: WeatherCache = { version: CACHE_VERSION, data };
    await weatherStorage.set(JSON.stringify(cache));
  },
  async getCachedWeather(city?: City): Promise<WeatherData | null> {
    const cached = await weatherStorage.get();
    if (!cached) return null;
    try {
      const parsed: unknown = JSON.parse(cached);
      const cache = parsed && typeof parsed === 'object' && 'version' in parsed && 'data' in parsed
        ? parsed as Partial<WeatherCache>
        : { version: 0, data: parsed as WeatherData };
      if (cache.version !== CACHE_VERSION && cache.version !== 0) return null;
      if (!isWeatherData(cache.data) || (city && !sameCity(cache.data.city, city))) return null;
      return cache.data;
    } catch {
      await weatherStorage.clear();
      return null;
    }
  },
  getLastCity: cityStorage.get,
  saveLastCity: cityStorage.set,
};
