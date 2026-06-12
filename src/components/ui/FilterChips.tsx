import { ScrollView, StyleSheet } from 'react-native';
import { Chip } from './Chip';
import { spacing } from '@/theme';

type Props = {
  items: readonly string[];
  value: string;
  onChange: (item: string) => void;
};

/** Horizontally scrolling row of filter chips. */
export function FilterChips({ items, value, onChange }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {items.map((item) => (
        <Chip
          key={item}
          label={item}
          active={value === item}
          onPress={() => onChange(item)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: spacing.sm, paddingHorizontal: spacing.lg },
});
