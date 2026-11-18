# ClimateScope

ClimateScope is a dark-themed Expo weather app that searches Open-Meteo for a
city, loads its current conditions, and presents hourly and five-day forecast
data. It is implemented with React Native, Expo Router, and TypeScript.

## Run the app

### Prerequisites

- Node.js compatible with the installed Expo toolchain
- npm
- Android Studio and an emulator, Xcode and an iOS simulator, or Expo web

### Install and start

```bash
npm install
npm run start
```

Choose a target from the Expo developer menu, or run one directly:

```bash
npm run android
npm run ios
npm run web
```

No API key or environment variables are required. The app uses the free
[Open-Meteo geocoding API](https://open-meteo.com/en/docs/geocoding-api) and
[forecast API](https://open-meteo.com/en/docs).

## What is implemented

- Search by city name with 400 ms debounce and a five-result selection list.
- Two-step request flow: geocoding first, then forecast by latitude and
  longitude.
- Current city, country, temperature, condition, weather icon, humidity, and
  wind speed.
- Five-day minimum/maximum forecast and a 24-hour temperature strip.
- Empty, loading, timeout, network-error, no-result, and retry states.
- Last successful weather response and city persisted with AsyncStorage.
- Offline fallback with an explicit “data may be outdated” banner.
- Cancellation of stale searches and weather requests.
- Pull-to-refresh, Celsius/Fahrenheit toggle, and system dark-theme setup.

## Architecture

The app uses a **component-based React Native UI with MVVM and a Repository
pattern**. `app/index.tsx` is a composition root: it connects the ViewModel
to small presentational components. The custom hook owns presentation state;
the repository coordinates network and persistence; typed model and mapping
functions keep API details out of the UI.

```text
app/index.tsx
  ├── SearchModal
  ├── WeatherHeader
  ├── CurrentWeatherCard
  ├── HourlyForecast
  ├── MetricCard
  ├── DailyForecast
  ├── EmptyState / ErrorState
  └── OfflineBanner

hooks/useWeatherViewModel.ts
  -> lib/weatherRepository.ts
      -> lib/weather.ts
      -> lib/storage.ts
```

### Important paths and symbols

- `app/index.tsx` — `App`; composition root, screen-level branching, and
  ViewModel event wiring.
- `components/weather/SearchModal.tsx` — `SearchModal`; search input,
  loading indicator, errors, and city result selection.
- `components/weather/WeatherHeader.tsx` — `WeatherHeader`; selected city and
  last-updated date.
- `components/weather/CurrentWeatherCard.tsx` — `CurrentWeatherCard`;
  current icon, temperature, and condition.
- `components/weather/HourlyForecast.tsx` — `HourlyForecast`; horizontal
  hourly weather list.
- `components/weather/DailyForecast.tsx` — `DailyForecast`; five-day
  minimum/maximum forecast.
- `components/weather/OfflineBanner.tsx` — `OfflineBanner`; cached-data
  status message.
- `components/weather/WeatherIcon.tsx` — `WeatherIcon`; maps WMO codes to an
  accessible visual.
- `components/weather/MetricCard.tsx` — `MetricCard`; displays wind and
  humidity metrics.
- `components/weather/EmptyState.tsx` — `EmptyState`; first-launch guidance.
- `components/weather/ErrorState.tsx` — `ErrorState`; retryable failures.
- `hooks/useWeatherViewModel.ts` — `useWeatherViewModel`, `loadWeather`,
  `runSearch`, `refresh`, and `retry`.
- `lib/weather.ts` — `City`, `WeatherData`, `WeatherPoint`,
  `DailyWeatherPoint`, `weatherVisual`, `fetchWithTimeout`, `searchCities`,
  `fetchWeather`, `formatTemperature`, and `formatWind`.
- `lib/weatherRepository.ts` — `weatherRepository`, cache versioning,
  `getCachedWeather`, and `saveWeather`.
- `lib/storage.ts` — `weatherStorage`, `cityStorage`, and persisted keys
  `climatescope.weather` and `climatescope.city`.
- `constants/theme.ts` — shared colors, spacing, radii, typography, and card
  styles.
- `lib/constants.ts` — API URLs, `SEARCH_DEBOUNCE_MS` (400), network timeout
  (10 seconds), five forecast days, and hourly limit.

## Edge-case handling

- Blank or punctuation-only input is ignored without an API call.
- Multiple matching cities are shown with region and country so the user can
  choose the intended location.
- Missing `results` is treated as an empty result list.
- Slow requests time out after 10 seconds.
- A new request aborts the previous request, preventing stale results.
- Unknown WMO codes map to `Unknown` with a neutral icon.
- No cache plus no network shows a retryable error; cached data remains visible
  when refresh fails and is marked as potentially outdated.
- AsyncStorage data is versioned and structurally checked before use.
- React state and effects are cleaned up on unmount to avoid updating an
  inactive screen.

## Libraries and versions

The versions below come from `package.json`:

- Expo `~58.0.23`
- Expo Router `~58.0.30`
- React `19.3.0`
- React Native `0.88.1`
- TypeScript `~6.0.3`
- `@react-native-async-storage/async-storage` `2.2.0`
- `react-native-safe-area-context` `~5.11.1`
- `expo-status-bar` `~58.0.4`

## Assumptions and limitations

- Temperature is requested in Open-Meteo's default Celsius units; Fahrenheit is
  derived locally for display.
- Weather icons are text symbols mapped from WMO codes, so they do not require
  image assets.
- The app currently uses one screen with a modal search flow instead of a
  separate navigation screen.
- There is no automated test suite yet.
- Open-Meteo availability and device connectivity remain external dependencies.

## License

This project retains the MIT license included in the repository.
