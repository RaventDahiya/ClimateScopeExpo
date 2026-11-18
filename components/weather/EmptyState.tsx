import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, typography } from '../../constants/theme';

export function EmptyState({ onSearch }: { onSearch: () => void }) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⌕</Text>
      <Text style={typography.body}>Search for a city to see its weather</Text>
      <Pressable style={styles.button} onPress={onSearch}>
        <Text style={styles.buttonText}>Search city</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.lg },
  icon: { color: colors.textSecondary, fontSize: 48 },
  button: { backgroundColor: colors.accentBlue, borderRadius: radii.md, paddingVertical: spacing.md, paddingHorizontal: spacing.xl },
  buttonText: { color: colors.textPrimary, fontWeight: '600' },
});
