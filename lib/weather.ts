import {
  API_BASE_URL,
  FORECAST_DAYS,
  GEOCODING_API_BASE_URL,
  HOURLY_FORECAST_LIMIT,
  NETWORK_TIMEOUT_MS,
  SEARCH_RESULT_LIMIT,
} from './constants';

export type City = {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
};

export type WeatherPoint = {
  time: string;
  temperature: number;
  weatherCode: number;
};

export type DailyWeatherPoint = WeatherPoint & {
  minTemperature: number;
};

export type WeatherData = {
  city: City;
  timezone: string;
  current: {
    temperature: number;
    humidity: number;
    weatherCode: number;
    windSpeed: number;
  };
  daily: DailyWeatherPoint[];
  hourly: WeatherPoint[];
  lastUpdated: string;
};

export type WeatherVisual = {
  label: string;
  icon: string;
  tint: string;
};

export function weatherVisual(code: number): WeatherVisual {
  if ([0, 1].includes(code)) return { label: code === 0 ? 'Clear Sky' : 'Mainly Clear', icon: '☀', tint: '#FACC15' };
  if ([2, 3, 45, 48].includes(code)) return { label: code === 2 ? 'Partly Cloudy' : code === 3 ? 'Overcast' : 'Fog', icon: '☁', tint: '#E2E2E8' };
  if ([51, 53, 55].includes(code)) return { label: 'Drizzle', icon: '≋', tint: '#60A5FA' };
  if ([61, 63, 65, 80, 81, 82].includes(code)) return { label: code >= 80 ? 'Rain Showers' : 'Rain', icon: '💧', tint: '#60A5FA' };
  if ([71, 73, 75].includes(code)) return { label: 'Snow', icon: '❄', tint: '#E2E2E8' };
  if ([95, 96, 99].includes(code)) return { label: 'Thunderstorm', icon: 'ϟ', tint: '#FACC15' };
  return { label: 'Unknown', icon: '?', tint: '#9E9EA8' };
}

async function fetchWithTimeout(url: string, signal?: AbortSignal): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), NETWORK_TIMEOUT_MS);
  const abortRequest = () => controller.abort();
  signal?.addEventListener('abort', abortRequest, { once: true });

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (controller.signal.aborted && !signal?.aborted) throw new Error('timeout');
    return response;
  } catch (reason) {
    if (controller.signal.aborted && !signal?.aborted) throw new Error('timeout');
    throw reason;
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', abortRequest);
  }
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

export async function searchCities(query: string, signal?: AbortSignal): Promise<City[]> {
  const url = `${GEOCODING_API_BASE_URL}/search?name=${encodeURIComponent(query)}&count=${SEARCH_RESULT_LIMIT}&language=en&format=json`;
  const response = await fetchWithTimeout(url, signal);
  if (!response.ok) throw new Error('network');
  const json: { results?: Array<Record<string, unknown>> } = await response.json();
  return (json.results ?? []).map((result) => ({
    name: typeof result.name === 'string' ? result.name : 'Unknown',
    latitude: asNumber(result.latitude),
    longitude: asNumber(result.longitude),
    country: typeof result.country === 'string' ? result.country : '',
    admin1: typeof result.admin1 === 'string' ? result.admin1 : undefined,
  }));
}

export async function fetchWeather(city: City, signal?: AbortSignal): Promise<WeatherData> {
  const params = [
    `latitude=${city.latitude}`,
    `longitude=${city.longitude}`,
    'current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m',
    'daily=weather_code,temperature_2m_max,temperature_2m_min',
    'hourly=temperature_2m,weather_code',
    `forecast_days=${FORECAST_DAYS}`,
    'timezone=auto',
  ].join('&');
  const response = await fetchWithTimeout(`${API_BASE_URL}/forecast?${params}`, signal);
  if (!response.ok) throw new Error('network');
  const json: {
    timezone?: string;
    current?: Record<string, unknown>;
    daily?: { time?: unknown[]; weather_code?: unknown[]; temperature_2m_min?: unknown[]; temperature_2m_max?: unknown[] };
    hourly?: { time?: unknown[]; weather_code?: unknown[]; temperature_2m?: unknown[] };
  } = await response.json();
  const current = json.current ?? {};
  const daily = json.daily ?? {};
  const hourly = json.hourly ?? {};
  const dailyTimes = Array.isArray(daily.time) ? daily.time : [];
  const dailyCodes = Array.isArray(daily.weather_code) ? daily.weather_code : [];
  const mins = Array.isArray(daily.temperature_2m_min) ? daily.temperature_2m_min : [];
  const maxes = Array.isArray(daily.temperature_2m_max) ? daily.temperature_2m_max : [];
  const hourlyTimes = Array.isArray(hourly.time) ? hourly.time : [];
  const hourlyCodes = Array.isArray(hourly.weather_code) ? hourly.weather_code : [];
  const hourlyTemps = Array.isArray(hourly.temperature_2m) ? hourly.temperature_2m : [];
  return {
    city,
    timezone: typeof json.timezone === 'string' ? json.timezone : 'UTC',
    current: {
      temperature: asNumber(current.temperature_2m),
      humidity: asNumber(current.relative_humidity_2m),
      weatherCode: asNumber(current.weather_code),
      windSpeed: asNumber(current.wind_speed_10m),
    },
    daily: dailyTimes.map((time, index) => ({
      time: typeof time === 'string' ? time : '',
      temperature: asNumber(maxes[index]),
      weatherCode: asNumber(dailyCodes[index]),
      minTemperature: asNumber(mins[index]),
    })),
    hourly: hourlyTimes.slice(0, HOURLY_FORECAST_LIMIT).map((time, index) => ({
      time: typeof time === 'string' ? time : '',
      temperature: asNumber(hourlyTemps[index]),
      weatherCode: asNumber(hourlyCodes[index]),
    })),
    lastUpdated: new Date().toISOString(),
  };
}

export function formatTemperature(value: number, fahrenheit: boolean): string {
  const converted = fahrenheit ? (value * 9) / 5 + 32 : value;
  return `${Math.round(converted)}°${fahrenheit ? 'F' : 'C'}`;
}

export function formatWind(value: number, fahrenheit: boolean): string {
  const converted = fahrenheit ? value * 0.621371 : value;
  return `${Math.round(converted)} ${fahrenheit ? 'mph' : 'km/h'}`;
}
