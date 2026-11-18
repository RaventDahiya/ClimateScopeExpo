import { StyleSheet, Text, View } from 'react-native';
import { card, colors, spacing, typography } from '../../constants/theme';

type Props = { icon: string; label: string; value: string; iconColor?: string };

export function MetricCard({ icon, label, value, iconColor = colors.textSecondary }: Props) {
  return (
    <View style={[card, styles.card]}>
      <Text style={[styles.icon, { color: iconColor }]}>{icon}</Text>
      <Text style={typography.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, padding: spacing.lg, gap: spacing.sm },
  icon: { fontSize: 24 },
  value: { ...typography.metricValue },
});
