import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, fontSize, radius, spacing } from '@/theme';
import type { IconName } from '@/types';

type Props = {
  icon: IconName;
  label: string;
  /** Brand icon colour (used on the outlined Google variant). */
  iconColor?: string;
  /** Solid background colour (Facebook/Apple). Omit for the outlined variant. */
  filled?: string;
  onPress?: () => void;
};

export function SocialButton({ icon, label, iconColor, filled, onPress }: Props) {
  const fg = filled ? colors.textInverse : colors.text;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        filled ? { backgroundColor: filled } : styles.outline,
        pressed && { opacity: 0.85 },
      ]}
    >
      <Ionicons name={icon} size={20} color={iconColor ?? fg} />
      <Text style={[styles.label, { color: fg }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 50,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  outline: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  label: { fontSize: fontSize.md, fontWeight: '700' },
});
