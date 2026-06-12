import { ReactNode } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Avatar } from './Avatar';
import { Logo } from './Logo';
import { colors, fontSize, spacing } from '@/theme';
import type { IconName } from '@/types';

type Props = {
  title?: string;
  logo?: boolean;
  showBack?: boolean;
  showMenu?: boolean;
  leadingAvatar?: string;
  /** Right-side cluster, typically <HeaderIcon> elements. */
  right?: ReactNode;
  bordered?: boolean;
  onBack?: () => void;
};

/** Standard top bar shared by every screen. */
export function ScreenHeader({
  title,
  logo,
  showBack,
  showMenu,
  leadingAvatar,
  right,
  bordered,
  onBack,
}: Props) {
  const router = useRouter();

  return (
    <View style={[styles.bar, bordered && styles.bordered]}>
      <View style={styles.left}>
        {showBack ? (
          <Pressable onPress={onBack ?? (() => router.back())} hitSlop={8}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
        ) : null}
        {showMenu ? <Ionicons name="menu" size={26} color={colors.text} /> : null}
        {logo ? <Logo size={26} /> : null}
        {leadingAvatar ? <Avatar name={leadingAvatar} size={32} /> : null}
        {title ? <Text style={styles.title}>{title}</Text> : null}
      </View>
      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  );
}

/** A right-aligned header icon with an optional notification dot. */
export function HeaderIcon({
  name,
  onPress,
  badge,
}: {
  name: IconName;
  onPress?: () => void;
  badge?: boolean;
}) {
  return (
    <Pressable onPress={onPress} hitSlop={8}>
      <Ionicons name={name} size={22} color={colors.text} />
      {badge ? <View style={styles.dot} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    height: 52,
    backgroundColor: colors.surface,
  },
  bordered: { borderBottomWidth: 1, borderBottomColor: colors.border },
  left: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  right: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  title: { fontSize: fontSize.lg, fontWeight: '800', color: colors.text },
  dot: {
    position: 'absolute',
    top: -1,
    right: -1,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
  },
});
