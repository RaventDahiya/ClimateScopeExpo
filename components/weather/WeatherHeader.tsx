import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../constants/theme';

type Props = {
  city: string;
  country: string;
  updatedAt: string;
  onPress: () => void;
};

function dateLabel(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
}

export function WeatherHeader({ city, country, updatedAt, onPress }: Props) {
  return (
    <View style={styles.header}>
      <Pressable style={styles.cityButton} onPress={onPress}>
        <View>
          <Text style={typography.headerCity}>{city}</Text>
          <Text style={typography.headerTime}>{country}</Text>
        </View>
        <Text style={styles.chevron}>⌄</Text>
      </Pressable>
      <Text style={typography.headerTime}>{dateLabel(updatedAt)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: spacing.lg, paddingBottom: spacing.sm },
  cityButton: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  chevron: { color: colors.textSecondary, fontSize: 24, marginTop: -4 },
});
