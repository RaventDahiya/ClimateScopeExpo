import { StyleSheet, Text } from 'react-native';
import { weatherVisual } from '../../lib/weather';

export function WeatherIcon({ code, size = 34 }: { code: number; size?: number }) {
  const visual = weatherVisual(code);
  return <Text accessibilityLabel={visual.label} style={[styles.icon, { color: visual.tint, fontSize: size }]}>{visual.icon}</Text>;
}

const styles = StyleSheet.create({
  icon: { textAlign: 'center', fontWeight: '600' },
});
