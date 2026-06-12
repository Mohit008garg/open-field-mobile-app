import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, spacing } from '@/theme';

type Props = {
  tabs: readonly string[];
  value: string;
  onChange: (tab: string) => void;
  /** Show a divider line under the whole row. */
  bordered?: boolean;
};

/** Underlined text tabs (Connections / About / Upcoming ...). */
export function SegmentedTabs({ tabs, value, onChange, bordered = true }: Props) {
  return (
    <View style={[styles.row, bordered && styles.bordered]}>
      {tabs.map((t) => (
        <Pressable key={t} onPress={() => onChange(t)} style={styles.tab}>
          <Text style={[styles.label, value === t && styles.active]}>{t}</Text>
          {value === t ? <View style={styles.underline} /> : null}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.lg },
  bordered: { borderBottomWidth: 1, borderBottomColor: colors.border },
  tab: { paddingVertical: spacing.sm },
  label: { fontSize: fontSize.sm, fontWeight: '600', color: colors.textMuted },
  active: { color: colors.primary },
  underline: {
    height: 2,
    backgroundColor: colors.primary,
    marginTop: spacing.sm,
    marginBottom: -1,
    borderRadius: 2,
  },
});
