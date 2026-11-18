import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../constants/theme';
import type { WeatherPoint } from '../../lib/weather';
import { WeatherIcon } from './WeatherIcon';

type Props = { points: WeatherPoint[]; formatTemperature: (value: number) => string };

function timeLabel(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '--:--' : date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

export function HourlyForecast({ points, formatTemperature }: Props) {
  return (
    <>
      <Text style={[typography.sectionTitle, styles.sectionTitle]}>Today</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hourlyList}>
        {points.map((point, index) => (
          <View key={`${point.time}-${index}`} style={[styles.hourlySlot, index === 0 && styles.hourlySelected]}>
            <Text style={[styles.hourlyTime, index === 0 && styles.selectedText]}>{timeLabel(point.time)}</Text>
            <WeatherIcon code={point.weatherCode} size={25} />
            <Text style={styles.hourlyTemp}>{formatTemperature(point.temperature)}</Text>
          </View>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { marginBottom: spacing.md },
  hourlyList: { gap: spacing.sm },
  hourlySlot: { width: 64, paddingVertical: spacing.sm, alignItems: 'center', gap: spacing.sm, borderRadius: 8, backgroundColor: colors.surfaceVariant },
  hourlySelected: { backgroundColor: colors.accentBlue },
  hourlyTime: { color: colors.textSecondary, fontSize: 12 },
  selectedText: { color: colors.textPrimary },
  hourlyTemp: { color: colors.textPrimary, fontSize: 14, fontWeight: '500' },
});
