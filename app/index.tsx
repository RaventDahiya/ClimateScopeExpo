import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing } from "../constants/theme";
import { CurrentWeatherCard } from "../components/weather/CurrentWeatherCard";
import { DailyForecast } from "../components/weather/DailyForecast";
import { HourlyForecast } from "../components/weather/HourlyForecast";
import { OfflineBanner } from "../components/weather/OfflineBanner";
import { SearchModal } from "../components/weather/SearchModal";
import { WeatherHeader } from "../components/weather/WeatherHeader";
import { EmptyState } from "../components/weather/EmptyState";
import { ErrorState } from "../components/weather/ErrorState";
import { MetricCard } from "../components/weather/MetricCard";
import { useWeatherViewModel } from "../hooks/useWeatherViewModel";

export default function App() {
  const {
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
    visual,
    temperature,
    formatTemperature: formatWeatherTemperature,
    formatWind: formatWeatherWind,
    openSearch,
    setSearchOpen,
    setQuery,
    clearSearch,
    setFahrenheit,
    runSearch,
    selectCity,
    refresh,
    retry,
  } = useWeatherViewModel();

  let content;

  if (loading && !weather) {
    content = (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.accentBlue} size="large" />
      </View>
    );
  } else if (error && !weather) {
    content = <ErrorState message={error} onRetry={retry} />;
  } else if (weather) {
    content = (
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={colors.accentBlue}
          />
        }
      >
        <WeatherHeader
          city={weather.city.name}
          country={weather.city.country}
          updatedAt={weather.lastUpdated}
          onPress={openSearch}
        />
        {isOffline && <OfflineBanner lastUpdated={weather.lastUpdated} />}
        <CurrentWeatherCard
          weatherCode={weather.current.weatherCode}
          temperature={temperature}
          condition={visual?.label ?? "Unknown"}
        />
        <HourlyForecast
          points={weather.hourly}
          formatTemperature={formatWeatherTemperature}
        />
        <View style={styles.metrics}>
          <MetricCard
            icon="≋"
            label="Wind"
            value={formatWeatherWind(weather.current.windSpeed)}
          />
          <MetricCard
            icon="💧"
            label="Humidity"
            value={`${Math.round(weather.current.humidity)}%`}
            iconColor={colors.accentBlue}
          />
        </View>
        <DailyForecast
          points={weather.daily}
          formatTemperature={formatWeatherTemperature}
        />
        <Pressable
          style={styles.unitToggle}
          onPress={() => setFahrenheit((value) => !value)}
        >
          <Text style={styles.unitToggleText}>
            Show °{fahrenheit ? "C" : "F"}
          </Text>
        </Pressable>
      </ScrollView>
    );
  } else {
    content = <EmptyState onSearch={openSearch} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      {content}
      <SearchModal
        visible={searchOpen}
        query={query}
        cities={cities}
        searching={searching}
        searchError={searchError}
        onClose={() => setSearchOpen(false)}
        onQueryChange={setQuery}
        onClear={clearSearch}
        onSubmit={() => runSearch(query)}
        onSelect={selectCity}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  metrics: {
    flexDirection: "row",
    gap: spacing.md,
    marginVertical: spacing.lg,
  },
  unitToggle: {
    alignSelf: "center",
    marginTop: spacing.xl,
    padding: spacing.sm,
  },
  unitToggleText: { color: colors.accentBlue, fontSize: 14, fontWeight: "600" },
});
