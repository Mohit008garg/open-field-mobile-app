import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { colors, fontSize, radius, spacing } from '@/theme';
import type { IconName } from '@/types';

export type QuickItem = {
  icon: IconName;
  label: string;
  tint: string;
  color: string;
};

const ITEMS: QuickItem[] = [
  { icon: 'person-add', label: 'Find Players', tint: '#DCFCE7', color: '#16A34A' },
  { icon: 'school', label: 'Find Coaches', tint: '#DBEAFE', color: '#2563EB' },
  { icon: 'business', label: 'Academies', tint: '#F3E8FF', color: '#9333EA' },
  { icon: 'trophy', label: 'Tournaments', tint: '#FFEDD5', color: '#EA580C' },
];

type Props = {
  onItemPress?: (label: string) => void;
  onViewAll?: () => void;
};

export function QuickAccess({ onItemPress, onViewAll }: Props) {
  return (
    <View style={styles.wrap}>
      <SectionHeader title="Quick Access" actionLabel="View All" onAction={onViewAll} />
      <View style={styles.row}>
        {ITEMS.map((q) => (
          <Pressable key={q.label} style={styles.item} onPress={() => onItemPress?.(q.label)}>
            <View style={[styles.icon, { backgroundColor: q.tint }]}>
              <Ionicons name={q.icon} size={22} color={q.color} />
            </View>
            <Text style={styles.label}>{q.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  item: { alignItems: 'center', gap: spacing.xs, width: '23%' },
  icon: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: 11, color: colors.textMuted, fontWeight: '600', textAlign: 'center' },
});
