import { StyleSheet, Text, View } from 'react-native';
import { Avatar } from '@mohit008garg/open-field-common-components';
import { colors, fontSize, radius, spacing } from '@/theme';
import type { Connection } from '@/types';

export function ConnectionRow({ connection }: { connection: Connection }) {
  return (
    <View style={styles.row}>
      <Avatar name={connection.name} size={48} />
      <View style={styles.info}>
        <Text style={styles.name}>{connection.name}</Text>
        <Text style={styles.role}>{connection.role}</Text>
      </View>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{connection.status}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  info: { flex: 1 },
  name: { fontSize: fontSize.md, fontWeight: '700', color: colors.text },
  role: { fontSize: fontSize.xs, color: colors.textMuted },
  badge: {
    paddingHorizontal: spacing.md,
    height: 34,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontSize: fontSize.xs, fontWeight: '700', color: colors.textMuted },
});
