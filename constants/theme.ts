import { TextStyle, ViewStyle } from 'react-native';

export const colors = {
  background: '#1E1E1E',
  surface: '#2A2A2E',
  surfaceVariant: '#333338',
  textPrimary: '#FFFFFF',
  textSecondary: '#9E9EA8',
  accentBlue: '#3B82F6',
  weatherYellow: '#FACC15',
  weatherWhite: '#E2E2E8',
  weatherBlue: '#60A5FA',
  error: '#EF4444',
  offlineBanner: '#3B3B40',
  divider: '#3B3B40',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const;

export const typography: Record<string, TextStyle> = {
  heroTemperature: { fontSize: 72, fontWeight: '700', letterSpacing: -2, color: colors.textPrimary },
  heroCondition: { fontSize: 18, color: colors.textSecondary, lineHeight: 25 },
  headerCity: { fontSize: 22, fontWeight: '600', color: colors.textPrimary },
  headerTime: { fontSize: 14, color: colors.textSecondary, letterSpacing: 0.2 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: colors.textPrimary, letterSpacing: 0.5 },
  body: { fontSize: 16, color: colors.textPrimary },
  label: { fontSize: 14, fontWeight: '500', color: colors.textSecondary },
  metricValue: { fontSize: 20, fontWeight: '600', color: colors.textPrimary },
  caption: { fontSize: 12, color: colors.textSecondary, letterSpacing: 0.3 },
  forecastDay: { fontSize: 16, fontWeight: '500', color: colors.textPrimary },
};

export const card: ViewStyle = {
  backgroundColor: colors.surface,
  borderRadius: radii.lg,
};
