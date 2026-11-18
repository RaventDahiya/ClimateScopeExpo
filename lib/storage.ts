import AsyncStorage from '@react-native-async-storage/async-storage';
import type { City } from './weather';

let weatherCache: string | null = null;
let cityCache: City | null = null;

function isCity(value: unknown): value is City {
  if (!value || typeof value !== 'object') return false;
  const city = value as Partial<City>;
  return typeof city.name === 'string'
    && typeof city.country === 'string'
    && typeof city.latitude === 'number'
    && Number.isFinite(city.latitude)
    && typeof city.longitude === 'number'
    && Number.isFinite(city.longitude);
}

export const weatherStorage = {
  async get(): Promise<string | null> {
    return (await AsyncStorage.getItem('climatescope.weather')) ?? weatherCache;
  },
  async set(value: string): Promise<void> {
    weatherCache = value;
    await AsyncStorage.setItem('climatescope.weather', value);
  },
  async clear(): Promise<void> {
    weatherCache = null;
    await AsyncStorage.removeItem('climatescope.weather');
  },
};

export const cityStorage = {
  async get(): Promise<City | null> {
    const stored = await AsyncStorage.getItem('climatescope.city');
    if (stored) {
      try {
        const city: unknown = JSON.parse(stored);
        if (isCity(city)) return city;
      } catch {
      }
      await AsyncStorage.removeItem('climatescope.city');
    }
    return cityCache;
  },
  async set(city: City): Promise<void> {
    cityCache = city;
    await AsyncStorage.setItem('climatescope.city', JSON.stringify(city));
  },
  async clear(): Promise<void> {
    cityCache = null;
    await AsyncStorage.removeItem('climatescope.city');
  },
};
