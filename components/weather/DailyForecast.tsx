import { StyleSheet, Text, View } from 'react-native';
import { card, colors, radii, spacing, typography } from '../../constants/theme';
import type { DailyWeatherPoint } from '../../lib/weather';
import { WeatherIcon } from './WeatherIcon';

type Props = { points: DailyWeatherPoint[]; formatTemperature: (value: number) => string };

function dayLabel(value: string, index: number): string {
  if (index === 0) return 'Today';
  return new Date(`${value}T12:00:00`).toLocaleDateString(undefined, { weekday: 'short' });
}

export function DailyForecast({ points, formatTemperature }: Props) {
  return (
    <>
      <Text style={typography.sectionTitle}>5 days</Text>
      <View style={[card, styles.forecastCard]}>
        {points.map((point, index) => (
          <View key={`${point.time}-${index}`} style={[styles.forecastRow, index < points.length - 1 && styles.forecastDivider]}>
            <Text style={styles.forecastDay}>{dayLabel(point.time, index)}</Text>
            <WeatherIcon code={point.weatherCode} size={25} />
            <Text style={styles.minTemp}>{formatTemperature(point.minTemperature)}</Text>
            <Text style={styles.maxTemp}>{formatTemperature(point.temperature)}</Text>
          </View>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  forecastCard: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, marginTop: spacing.md },
  forecastRow: { minHeight: 58, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  forecastDivider: { borderBottomWidth: 0.5, borderBottomColor: colors.divider },
  forecastDay: { ...typography.forecastDay, flex: 1 },
  minTemp: { color: colors.textSecondary, fontSize: 16, width: 52, textAlign: 'right' },
  maxTemp: { color: colors.textPrimary, fontSize: 16, width: 52, textAlign: 'right' },
});
