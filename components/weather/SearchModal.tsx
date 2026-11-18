import { ActivityIndicator, FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, radii, spacing, typography } from '../../constants/theme';
import type { City } from '../../lib/weather';

type Props = {
  visible: boolean;
  query: string;
  cities: City[];
  searching: boolean;
  searchError: string | null;
  onClose: () => void;
  onQueryChange: (value: string) => void;
  onClear: () => void;
  onSubmit: () => void;
  onSelect: (city: City) => void;
};

export function SearchModal({ visible, query, cities, searching, searchError, onClose, onQueryChange, onClear, onSubmit, onSelect }: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.modalBackdrop} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>⌕</Text>
            <TextInput autoFocus value={query} onChangeText={onQueryChange} onSubmitEditing={onSubmit} placeholder="Search for a city…" placeholderTextColor={colors.textSecondary} returnKeyType="search" style={styles.searchInput} />
            {query.length > 0 && <Pressable onPress={onClear}><Text style={styles.clearButton}>×</Text></Pressable>}
          </View>
          {searching && <ActivityIndicator style={styles.searchLoading} color={colors.accentBlue} />}
          {searchError && <Text style={styles.searchError}>{searchError}</Text>}
          <FlatList
            data={cities}
            keyExtractor={(item) => `${item.latitude}-${item.longitude}`}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <Pressable style={styles.resultTile} onPress={() => onSelect(item)}>
                <Text style={typography.body}>{item.name}</Text>
                <Text style={typography.caption}>{[item.admin1, item.country].filter(Boolean).join(', ')}</Text>
              </Pressable>
            )}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: '#00000066' },
  sheet: { height: '85%', backgroundColor: colors.background, borderTopLeftRadius: radii.xl, borderTopRightRadius: radii.xl, paddingTop: spacing.sm },
  handle: { width: 40, height: 4, borderRadius: radii.full, backgroundColor: colors.divider, alignSelf: 'center', marginBottom: spacing.lg },
  searchBox: { marginHorizontal: spacing.lg, paddingHorizontal: spacing.md, height: 52, borderRadius: radii.md, backgroundColor: colors.surfaceVariant, flexDirection: 'row', alignItems: 'center' },
  searchIcon: { color: colors.textSecondary, fontSize: 22, marginRight: spacing.sm },
  searchInput: { flex: 1, color: colors.textPrimary, fontSize: 16 },
  clearButton: { color: colors.textSecondary, fontSize: 28, paddingLeft: spacing.sm },
  searchLoading: { marginTop: spacing.lg },
  searchError: { color: colors.textSecondary, textAlign: 'center', padding: spacing.lg },
  resultTile: { marginHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 0.5, borderBottomColor: colors.divider },
});
