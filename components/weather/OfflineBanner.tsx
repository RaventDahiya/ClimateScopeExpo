import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing } from '../../constants/theme';

export function OfflineBanner({ lastUpdated }: { lastUpdated: string }) {
  const time = new Date(lastUpdated);
  const label = Number.isNaN(time.getTime()) ? '--:--' : time.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  return <View style={styles.banner}><Text style={styles.text}>Data may be outdated  •  Last updated: {label}</Text></View>;
}

const styles = StyleSheet.create({
  banner: { backgroundColor: colors.offlineBanner, borderRadius: radii.md, padding: spacing.sm, marginTop: spacing.sm },
  text: { color: colors.textSecondary, fontSize: 12, textAlign: 'center' },
});
