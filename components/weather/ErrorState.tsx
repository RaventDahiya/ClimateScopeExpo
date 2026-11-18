import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, typography } from '../../constants/theme';

type Props = { message: string; onRetry: () => void };

export function ErrorState({ message, onRetry }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>!</Text>
      <Text style={typography.body}>{message}</Text>
      <Pressable style={styles.button} onPress={onRetry}>
        <Text style={styles.buttonText}>Retry</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.lg },
  icon: { color: colors.error, fontSize: 48 },
  button: { backgroundColor: colors.accentBlue, borderRadius: radii.md, paddingVertical: spacing.md, paddingHorizontal: spacing.xl },
  buttonText: { color: colors.textPrimary, fontWeight: '600' },
});
