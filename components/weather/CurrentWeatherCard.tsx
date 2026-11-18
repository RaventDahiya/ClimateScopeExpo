import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../constants/theme';
import { WeatherIcon } from './WeatherIcon';

type Props = { weatherCode: number; temperature: string; condition: string };

export function CurrentWeatherCard({ weatherCode, temperature, condition }: Props) {
  return (
    <View style={styles.hero}>
      <View style={styles.glow}><WeatherIcon code={weatherCode} size={78} /></View>
      <Text style={typography.heroTemperature}>{temperature}</Text>
      <Text style={typography.heroCondition}>{condition}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', paddingVertical: spacing.xxl },
  glow: { width: 160, height: 160, borderRadius: 80, alignItems: 'center', justifyContent: 'center', backgroundColor: '#343429' },
});
