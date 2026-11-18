import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  City,
  formatTemperature,
  formatWind,
  WeatherData,
  weatherVisual,
} from "../lib/weather";
import { weatherRepository } from "../lib/weatherRepository";
import { SEARCH_DEBOUNCE_MS } from "../lib/constants";

function sameCity(first: City, second: City): boolean {
  return (
    first.latitude === second.latitude && first.longitude === second.longitude
  );
}

export function useWeatherViewModel() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [fahrenheit, setFahrenheit] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cities, setCities] = useState<City[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const searchAbort = useRef<AbortController | null>(null);
  const weatherAbort = useRef<AbortController | null>(null);

  const loadWeather = useCallback(async (city: City, showLoading = true) => {
    weatherAbort.current?.abort();
    const controller = new AbortController();
    weatherAbort.current = controller;
    await weatherRepository.saveLastCity(city);
    setWeather((current) =>
      current && sameCity(current.city, city) ? current : null,
    );
    if (showLoading) setLoading(true);
    setError(null);
    setIsOffline(false);
    try {
      const result = await weatherRepository.fetchWeather(
        city,
        controller.signal,
      );
      setWeather(result);
      await weatherRepository.saveWeather(result);
    } catch (reason) {
      if (controller.signal.aborted) return;
      const cachedWeather = await weatherRepository.getCachedWeather(city);
      if (cachedWeather) {
        setWeather(cachedWeather);
        setIsOffline(true);
      } else {
        setError(
          reason instanceof TypeError
            ? "No internet connection"
            : reason instanceof Error && reason.message === "timeout"
              ? "The request timed out. Please try again."
              : "No cached weather is available for this city.",
        );
      }
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    Promise.all([
      weatherRepository.getCachedWeather(),
      weatherRepository.getLastCity(),
    ])
      .then(([cached, storedCity]) => {
        if (!active) return;
        if (cached) {
          if (storedCity && !sameCity(cached.city, storedCity))
            loadWeather(storedCity);
          else {
            setWeather(cached);
            setLoading(false);
            loadWeather(storedCity ?? cached.city, false);
          }
        } else if (storedCity) {
          loadWeather(storedCity);
        } else {
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setLoading(false);
          setError("Unable to read saved weather data.");
        }
      });
    return () => {
      active = false;
      weatherAbort.current?.abort();
      searchAbort.current?.abort();
    };
  }, [loadWeather]);

  const openSearch = useCallback(() => {
    setQuery("");
    setCities([]);
    setSearchError(null);
    setSearchOpen(true);
  }, []);

  const clearSearch = useCallback(() => {
    setQuery("");
    setCities([]);
    setSearchError(null);
  }, []);

  const runSearch = useCallback(async (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!/[a-z0-9]/i.test(trimmed)) {
      setSearching(false);
      setCities([]);
      return;
    }
    searchAbort.current?.abort();
    const controller = new AbortController();
    searchAbort.current = controller;
    setSearching(true);
    setSearchError(null);
    try {
      const results = await weatherRepository.searchCities(
        trimmed,
        controller.signal,
      );
      setCities(results);
      if (results.length === 0)
        setSearchError(`No results found for '${trimmed}'`);
    } catch (reason) {
      if (!controller.signal.aborted)
        setSearchError(
          reason instanceof TypeError
            ? "No internet connection"
            : reason instanceof Error && reason.message === "timeout"
              ? "The search request timed out. Please try again."
              : "Something went wrong. Please try again.",
        );
    } finally {
      if (!controller.signal.aborted) setSearching(false);
    }
  }, []);

  useEffect(() => {
    if (!searchOpen) return;
    const trimmed = query.trim();
    searchAbort.current?.abort();
    if (!/[a-z0-9]/i.test(trimmed)) {
      setCities([]);
      setSearchError(null);
      setSearching(false);
      return;
    }
    const timeout = setTimeout(() => runSearch(query), SEARCH_DEBOUNCE_MS);
    return () => {
      clearTimeout(timeout);
      searchAbort.current?.abort();
    };
  }, [query, runSearch, searchOpen]);

  const selectCity = useCallback(
    (city: City) => {
      setSearchOpen(false);
      loadWeather(city);
    },
    [loadWeather],
  );

  const refresh = useCallback(async () => {
    if (!weather) return;
    setRefreshing(true);
    await loadWeather(weather.city, false);
    setRefreshing(false);
  }, [loadWeather, weather]);

  const retry = useCallback(async () => {
    const lastCity = await weatherRepository.getLastCity();
    if (lastCity) loadWeather(lastCity);
    else openSearch();
  }, [loadWeather, openSearch]);

  return {
    weather,
    loading,
    refreshing,
    error,
    isOffline,
    fahrenheit,
    searchOpen,
    query,
    cities,
    searching,
    searchError,
    visual: useMemo(
      () => (weather ? weatherVisual(weather.current.weatherCode) : null),
      [weather],
    ),
    temperature: weather
      ? formatTemperature(weather.current.temperature, fahrenheit)
      : "",
    formatTemperature: (value: number) => formatTemperature(value, fahrenheit),
    formatWind: (value: number) => formatWind(value, fahrenheit),
    openSearch,
    setSearchOpen,
    setQuery,
    clearSearch,
    setFahrenheit,
    runSearch,
    selectCity,
    refresh,
    retry,
  };
}
