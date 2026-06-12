import { Ionicons } from '@expo/vector-icons';
import {
  Pressable,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { colors, fontSize, radius, spacing } from '@/theme';
import type { IconName } from '@/types';

type Props = TextInputProps & {
  /** slate-100 fill (no border) instead of white-with-border. */
  filled?: boolean;
  /** Icon rendered inside the field, on the right. */
  trailingIcon?: IconName;
  /** When set, renders a separate square filter button beside the field. */
  onFilterPress?: () => void;
};

export function SearchBar({
  filled,
  trailingIcon,
  onFilterPress,
  placeholder = 'Search...',
  ...rest
}: Props) {
  return (
    <View style={styles.row}>
      <View style={[styles.field, filled ? styles.filled : styles.outlined]}>
        <Ionicons name="search" size={18} color={colors.textFaint} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.textFaint}
          {...rest}
        />
        {trailingIcon ? (
          <Ionicons name={trailingIcon} size={18} color={colors.textFaint} />
        ) : null}
      </View>
      {onFilterPress ? (
        <Pressable style={styles.filterBtn} onPress={onFilterPress}>
          <Ionicons name="options-outline" size={20} color={colors.text} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  field: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 46,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
  },
  outlined: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filled: {
    backgroundColor: colors.surfaceAlt,
  },
  input: { flex: 1, fontSize: fontSize.sm, color: colors.text },
  filterBtn: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
